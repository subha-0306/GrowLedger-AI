import os
import joblib
import lightgbm as lgb

# Try imports supporting running both as a module from backend root or directly
try:
    from ml.preprocessing import prepare_train_test_split
except ModuleNotFoundError:
    from preprocessing import prepare_train_test_split

def train_model():
    """
    Loads preprocessed datasets, trains a multiclass LightGBM classifier,
    and serializes both the trained model and the fitted preprocessor object.
    
    Returns:
        lgb.LGBMClassifier: The trained model instance.
    """
    # 1. Fetch preprocessed data splits & preprocessor object
    data_dict = prepare_train_test_split()
    X_train = data_dict["X_train"]
    y_train = data_dict["y_train"]
    preprocessor = data_dict["preprocessor"]
    
    # 2. Configure LightGBM Multiclass Classifier
    print("Training LightGBM classifier...")
    model = lgb.LGBMClassifier(
        objective="multiclass",
        num_class=3,
        random_state=42,
        learning_rate=0.05,
        n_estimators=200,
        max_depth=6,
        verbose=-1  # Suppresses internal training logs for clean output
    )
    
    # 3. Fit the model on the training data
    model.fit(X_train, y_train)
    print("Model training complete.")
    
    # 4. Save both the model and the preprocessor
    # Create saved_models folder relative to this file's location
    script_dir = os.path.dirname(os.path.abspath(__file__))
    saved_models_dir = os.path.join(script_dir, "saved_models")
    os.makedirs(saved_models_dir, exist_ok=True)
    
    model_path = os.path.join(saved_models_dir, "growledger_model.pkl")
    preprocessor_path = os.path.join(saved_models_dir, "preprocessor.pkl")
    
    # Save files using joblib
    joblib.dump(model, model_path)
    joblib.dump(preprocessor, preprocessor_path)
    
    print(f"Artifacts saved successfully:")
    print(f"  - Model: {model_path}")
    print(f"  - Preprocessor: {preprocessor_path}")
    
    return model

if __name__ == "__main__":
    train_model()
