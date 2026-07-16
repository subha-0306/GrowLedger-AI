import os
import joblib
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    classification_report, confusion_matrix
)

# Try imports supporting running both as a module from backend root or directly
try:
    from ml.preprocessing import prepare_train_test_split, INVERSE_MAPPING
except ModuleNotFoundError:
    from preprocessing import prepare_train_test_split, INVERSE_MAPPING

def evaluate_model():
    """
    Loads the saved model and split datasets, computes performance scores,
    and visualizes feature importances and confusion matrices.
    """
    # 1. Fetch splits & configs
    data_dict = prepare_train_test_split()
    X_test = data_dict["X_test"]
    y_test = data_dict["y_test"]
    
    # 2. Resolve model path
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, "saved_models", "growledger_model.pkl")
    
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model not found at path: {model_path}")
        
    print(f"Loading trained model from: {model_path}")
    model = joblib.load(model_path)
    
    # 3. Predict on X_test
    print("Generating predictions on test set...")
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)
    
    # 4. Compute Metrics
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average="macro")
    recall = recall_score(y_test, y_pred, average="macro")
    f1 = f1_score(y_test, y_pred, average="macro")
    
    # Get labels in sorted order
    class_labels = [INVERSE_MAPPING[i] for i in sorted(INVERSE_MAPPING.keys())]
    
    print("\n========================================")
    print("            MODEL EVALUATION            ")
    print("========================================")
    print(f"Accuracy:        {accuracy:.4f}")
    print(f"Precision (Avg): {precision:.4f}")
    print(f"Recall (Avg):    {recall:.4f}")
    print(f"F1 Score (Avg):  {f1:.4f}")
    
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=class_labels))
    
    print("Confusion Matrix:")
    conf_matrix = confusion_matrix(y_test, y_pred)
    print(conf_matrix)
    
    # 5. Prediction Probabilities for the first five samples
    print("\nPrediction Probabilities (First 5 Samples):")
    for i in range(5):
        sample_probs = y_prob[i]
        prob_str = ", ".join([f"{class_labels[j]}: {sample_probs[j]:.4f}" for j in range(len(class_labels))])
        print(f"  - Sample {i+1:05d}: Actual {INVERSE_MAPPING[y_test.iloc[i]]} -> Pred {INVERSE_MAPPING[y_pred[i]]} | Probs [{prob_str}]")
        
    # 6. Feature Importances (Top 10)
    print("\nTop 10 Feature Importances:")
    importances = model.feature_importances_
    features = X_test.columns
    feat_imp = pd.Series(importances, index=features).sort_values(ascending=False)
    print(feat_imp.head(10).to_string())
    
    # 7. Save Confusion Matrix Plot
    plt.figure(figsize=(8, 6))
    sns.heatmap(
        conf_matrix, 
        annot=True, 
        fmt="d", 
        cmap="Blues", 
        xticklabels=class_labels, 
        yticklabels=class_labels
    )
    plt.ylabel("Actual Tier", fontsize=12)
    plt.xlabel("Predicted Tier", fontsize=12)
    plt.title("Confusion Matrix", fontsize=14, pad=15)
    plt.tight_layout()
    
    # Save to artifacts directory (for system rendering in walkthrough)
    artifact_path = r"C:\Users\smily\.gemini\antigravity-ide\brain\c4317263-5544-43ac-aef7-1dc6c202ce7d\confusion_matrix.png"
    plt.savefig(artifact_path, dpi=300)
    print(f"\nSaved confusion matrix to artifacts: {artifact_path}")
    
    # Save to workspace assets directory
    workspace_path = r"c:\Users\smily\OneDrive\Desktop\GrowLedger-AI\assets\confusion_matrix.png"
    os.makedirs(os.path.dirname(workspace_path), exist_ok=True)
    plt.savefig(workspace_path, dpi=300)
    print(f"Saved confusion matrix to workspace: {workspace_path}")
    
    plt.close()
    print("========================================")

if __name__ == "__main__":
    evaluate_model()
