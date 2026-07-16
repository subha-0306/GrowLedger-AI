import os
import joblib
import shap
import pandas as pd

class ShapExplainer:
    """
    Wrapper class to calculate SHAP feature attributions on model predictions.
    Utilizes TreeExplainer for optimized tree model evaluations.
    """
    def __init__(self, model_dir=None):
        import sys
        # Resolve target paths and ensure pickle can find the 'preprocessing' module
        script_dir = os.path.dirname(os.path.abspath(__file__))
        parent_dir = os.path.dirname(script_dir)
        ml_dir = os.path.join(parent_dir, "ml")
        if ml_dir not in sys.path:
            sys.path.append(ml_dir)
            
        if model_dir is None:
            model_dir = os.path.join(ml_dir, "saved_models")
            
        model_path = os.path.join(model_dir, "growledger_model.pkl")
        preprocessor_path = os.path.join(model_dir, "preprocessor.pkl")
        
        if not os.path.exists(model_path) or not os.path.exists(preprocessor_path):
            raise FileNotFoundError(f"Model or preprocessor missing under directory: {model_dir}")
            
        print(f"Explainability: Loading artifacts from {model_dir}")
        self.model = joblib.load(model_path)
        self.preprocessor = joblib.load(preprocessor_path)
        
        # Initialize TreeExplainer optimized for LightGBM models
        self.explainer = shap.TreeExplainer(self.model)

    def explain_processed_user(self, X_processed):
        """
        Accepts a single user's preprocessed feature DataFrame (shape 1x24),
        predicts target class and confidence, and extracts top 3 positive and top 3 negative features.
        
        Args:
            X_processed (pd.DataFrame): 1-row DataFrame of preprocessed feature inputs.
            
        Returns:
            dict: Prediction diagnostic payload with top features.
        """
        # 1. Predict target class & probability confidence
        probs = self.model.predict_proba(X_processed)[0]
        pred_class = int(self.model.predict(X_processed)[0])
        confidence = float(probs[pred_class])
        
        # 2. Compute SHAP values
        shap_values = self.explainer.shap_values(X_processed)
        
        # 3. Extract class-specific SHAP scores depending on shape returned
        if isinstance(shap_values, list):
            # List of arrays per class, extract for predicted class
            class_shap = shap_values[pred_class][0]
        else:
            # Multi-class numpy array shape (samples, features, classes)
            if len(shap_values.shape) == 3:
                class_shap = shap_values[0, :, pred_class]
            else:
                class_shap = shap_values[0]
                
        # 4. Extract top positive and negative features
        feature_names = X_processed.columns.tolist()
        feature_shap_pairs = list(zip(feature_names, class_shap))
        
        # Filter contribution directions
        pos_contrib = [pair for pair in feature_shap_pairs if pair[1] > 0]
        neg_contrib = [pair for pair in feature_shap_pairs if pair[1] < 0]
        
        # Sort values (Positive: descending, Negative: ascending)
        pos_contrib.sort(key=lambda x: x[1], reverse=True)
        neg_contrib.sort(key=lambda x: x[1], reverse=False)
        
        # Map values to dictionary list
        positive_features = [{"feature": f, "shap_value": float(v)} for f, v in pos_contrib[:3]]
        negative_features = [{"feature": f, "shap_value": float(v)} for f, v in neg_contrib[:3]]
        
        return {
            "prediction": pred_class,
            "confidence": confidence,
            "positive_features": positive_features,
            "negative_features": negative_features
        }

if __name__ == "__main__":
    # Test script to verify the ShapExplainer works correctly
    import json
    
    # Try imports supporting running both as a module from backend root or directly
    try:
        from ml.preprocessing import prepare_train_test_split, INVERSE_MAPPING
        from explainability.formatter import format_explanation_payload
    except ModuleNotFoundError:
        import sys
        # Add parent folder backend to path if run directly
        sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        from ml.preprocessing import prepare_train_test_split, INVERSE_MAPPING
        from formatter import format_explanation_payload
    
    # Initialize explainer
    explainer = ShapExplainer()
    
    # Load test split
    data_dict = prepare_train_test_split()
    X_test = data_dict["X_test"]
    
    # Fetch first test record (1-row DataFrame)
    first_user = X_test.iloc[[0]]
    actual_label = data_dict["y_test"].iloc[0]
    
    print("\n--- Explaining First User Sample ---")
    print(f"Actual Tier: {INVERSE_MAPPING[actual_label]}")
    
    # Generate raw explanation
    raw_explanation = explainer.explain_processed_user(first_user)
    print("\nRaw Explanation Output:")
    print(json.dumps(raw_explanation, indent=2))
    
    # Format explanation
    formatted_explanation = format_explanation_payload(raw_explanation)
    print("\nFormatted Explanation Output:")
    print(json.dumps(formatted_explanation, indent=2))
