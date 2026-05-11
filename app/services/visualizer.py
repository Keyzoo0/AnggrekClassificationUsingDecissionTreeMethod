import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from sklearn.tree import plot_tree
from app.config import VIS_DIR, FEATURE_NAMES


def render_tree(clf, classes, filename="tree.png"):
    fig, ax = plt.subplots(figsize=(20, 12), dpi=100)
    plot_tree(
        clf,
        feature_names=FEATURE_NAMES,
        class_names=classes,
        filled=True,
        rounded=True,
        fontsize=9,
        ax=ax,
    )
    out = VIS_DIR / filename
    fig.tight_layout()
    fig.savefig(out, bbox_inches="tight")
    plt.close(fig)
    return out


def render_confusion_matrix(cm, labels, filename="confusion_matrix.png"):
    cm = np.array(cm)
    fig, ax = plt.subplots(figsize=(6, 5), dpi=100)
    sns.heatmap(
        cm, annot=True, fmt="d", cmap="Purples",
        xticklabels=labels, yticklabels=labels, ax=ax, cbar=False
    )
    ax.set_xlabel("Predicted")
    ax.set_ylabel("Actual")
    ax.set_title("Confusion Matrix")
    out = VIS_DIR / filename
    fig.tight_layout()
    fig.savefig(out)
    plt.close(fig)
    return out


def render_feature_importance(importance: dict, filename="feature_importance.png"):
    names = list(importance.keys())
    vals = [importance[n] for n in names]
    order = np.argsort(vals)[::-1]
    names = [names[i] for i in order]
    vals = [vals[i] for i in order]
    fig, ax = plt.subplots(figsize=(8, 5), dpi=100)
    bars = ax.barh(names, vals, color="#9333ea")
    ax.invert_yaxis()
    ax.set_xlabel("Importance")
    ax.set_title("Feature Importance")
    for bar, v in zip(bars, vals):
        ax.text(bar.get_width() + 0.005, bar.get_y() + bar.get_height() / 2,
                f"{v:.3f}", va="center", fontsize=9)
    out = VIS_DIR / filename
    fig.tight_layout()
    fig.savefig(out)
    plt.close(fig)
    return out


def render_all(clf, history):
    classes = history["classes"]
    tree_path = render_tree(clf, classes)
    cm_path = render_confusion_matrix(
        history["confusion_matrix"], history["confusion_matrix_labels"]
    )
    fi_path = render_feature_importance(history["feature_importance"])
    return {
        "tree": tree_path.name,
        "confusion_matrix": cm_path.name,
        "feature_importance": fi_path.name,
    }
