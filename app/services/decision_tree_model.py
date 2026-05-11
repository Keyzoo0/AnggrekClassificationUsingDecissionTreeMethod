import json
from datetime import datetime
import joblib
import numpy as np
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
)
from app.config import (
    MODEL_PATH, FEATURES_CSV, TRAINING_HISTORY, FEATURE_NAMES, CLASSES
)
from app.services.dataset_manager import iter_dataset
from app.services.feature_extractor import extract_from_path


def build_features_csv():
    rows = []
    errors = []
    for cls, path in iter_dataset():
        try:
            result = extract_from_path(path)
            row = {"file": path.name, "class": cls, **result["features"]}
            rows.append(row)
        except Exception as e:
            errors.append({"file": str(path), "error": str(e)})
    if not rows:
        raise RuntimeError("Tidak ada gambar valid untuk diekstrak.")
    df = pd.DataFrame(rows)
    FEATURES_CSV.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(FEATURES_CSV, index=False)
    return df, errors


def train(max_depth=5, criterion="gini", test_size=0.2, min_samples_split=4,
          min_samples_leaf=2, random_state=42):
    df, errors = build_features_csv()
    if len(df) < 6:
        raise RuntimeError(
            f"Dataset terlalu sedikit ({len(df)} sampel). Min 6 sampel total."
        )
    classes_present = sorted(df["class"].unique().tolist())
    if len(classes_present) < 2:
        raise RuntimeError(
            f"Minimal 2 kelas dibutuhkan, hanya ada: {classes_present}"
        )

    X = df[FEATURE_NAMES].values
    y = df["class"].values

    # Stratify hanya jika tiap kelas punya min 2 sampel
    counts = df["class"].value_counts()
    stratify = y if counts.min() >= 2 else None

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=stratify
    )

    clf = DecisionTreeClassifier(
        criterion=criterion,
        max_depth=max_depth,
        min_samples_split=min_samples_split,
        min_samples_leaf=min_samples_leaf,
        random_state=random_state,
    )
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)

    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, average="macro", zero_division=0))
    rec = float(recall_score(y_test, y_pred, average="macro", zero_division=0))
    f1 = float(f1_score(y_test, y_pred, average="macro", zero_division=0))
    cm = confusion_matrix(y_test, y_pred, labels=classes_present).tolist()

    # Cross-validation jika cukup data
    cv_scores = None
    if counts.min() >= 3 and len(df) >= 10:
        try:
            cv = cross_val_score(clf, X, y, cv=min(3, counts.min()), scoring="accuracy")
            cv_scores = {"mean": float(cv.mean()), "std": float(cv.std())}
        except Exception:
            cv_scores = None

    feature_importance = {
        name: float(imp) for name, imp in zip(FEATURE_NAMES, clf.feature_importances_)
    }

    # Per-class metric
    per_class = {}
    for c in classes_present:
        p = float(precision_score(y_test, y_pred, labels=[c], average="macro", zero_division=0))
        r = float(recall_score(y_test, y_pred, labels=[c], average="macro", zero_division=0))
        f = float(f1_score(y_test, y_pred, labels=[c], average="macro", zero_division=0))
        per_class[c] = {"precision": p, "recall": r, "f1": f}

    # Save model
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(
        {
            "model": clf,
            "feature_names": FEATURE_NAMES,
            "classes": classes_present,
            "trained_at": datetime.utcnow().isoformat(),
        },
        MODEL_PATH,
    )

    history = {
        "trained_at": datetime.utcnow().isoformat(),
        "n_samples": int(len(df)),
        "classes": classes_present,
        "hyperparameters": {
            "max_depth": max_depth,
            "criterion": criterion,
            "min_samples_split": min_samples_split,
            "min_samples_leaf": min_samples_leaf,
            "test_size": test_size,
        },
        "metrics": {
            "accuracy": acc,
            "precision_macro": prec,
            "recall_macro": rec,
            "f1_macro": f1,
        },
        "per_class": per_class,
        "confusion_matrix": cm,
        "confusion_matrix_labels": classes_present,
        "feature_importance": feature_importance,
        "cv_scores": cv_scores,
        "errors": errors,
    }
    TRAINING_HISTORY.write_text(json.dumps(history, indent=2))
    return history


def load_model():
    if not MODEL_PATH.exists():
        return None
    return joblib.load(MODEL_PATH)


def model_info():
    if not MODEL_PATH.exists():
        return None
    bundle = joblib.load(MODEL_PATH)
    history = None
    if TRAINING_HISTORY.exists():
        history = json.loads(TRAINING_HISTORY.read_text())
    return {
        "trained_at": bundle.get("trained_at"),
        "classes": bundle.get("classes"),
        "feature_names": bundle.get("feature_names"),
        "history": history,
    }


def predict(feature_vector):
    bundle = load_model()
    if bundle is None:
        raise RuntimeError("Model belum dilatih. Latih model terlebih dahulu.")
    clf: DecisionTreeClassifier = bundle["model"]
    classes = bundle["classes"]
    feature_names = bundle["feature_names"]

    X = np.array([feature_vector], dtype=np.float64)
    pred = clf.predict(X)[0]
    proba = clf.predict_proba(X)[0]
    proba_map = {c: float(p) for c, p in zip(clf.classes_, proba)}
    confidence = float(proba.max())

    # Trace decision path
    node_indicator = clf.decision_path(X)
    leaf_id = clf.apply(X)[0]
    tree = clf.tree_

    path_nodes = node_indicator.indices[
        node_indicator.indptr[0]:node_indicator.indptr[1]
    ]
    decision_path = []
    for node_id in path_nodes:
        if node_id == leaf_id:
            samples = int(tree.n_node_samples[node_id])
            values = tree.value[node_id][0]
            purity = float(values.max() / values.sum()) if values.sum() > 0 else 0.0
            decision_path.append({
                "node_id": int(node_id),
                "type": "LEAF",
                "prediction": str(pred),
                "samples": samples,
                "purity": purity,
            })
        else:
            feat_idx = int(tree.feature[node_id])
            threshold = float(tree.threshold[node_id])
            feat_name = feature_names[feat_idx]
            feat_val = float(X[0, feat_idx])
            go_left = feat_val <= threshold
            decision_path.append({
                "node_id": int(node_id),
                "type": "DECISION",
                "feature": feat_name,
                "threshold": threshold,
                "value": feat_val,
                "go_left": bool(go_left),
                "decision": f"{feat_val:.3f} <= {threshold:.3f} → {go_left}",
            })

    return {
        "prediction": str(pred),
        "confidence": confidence,
        "probabilities": proba_map,
        "decision_path": decision_path,
        "feature_names": feature_names,
        "classes": classes,
    }
