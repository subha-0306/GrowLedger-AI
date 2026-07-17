import os
import sys
import pandas as pd
import joblib

# Ensure that backend root and ml paths are resolved properly so that pickles and relative imports work
script_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(script_dir)

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
if script_dir not in sys.path:
    sys.path.insert(0, script_dir)

# Now we can safely import other modules
try:
    from ml.preprocessing import preprocess_data, INVERSE_MAPPING
except ModuleNotFoundError:
    from preprocessing import preprocess_data, INVERSE_MAPPING

from feature_engineering.feature_engineering import build_features
from explainability.shap_explainer import ShapExplainer
from explainability.formatter import format_explanation_payload
from counterfactual.coach import run_financial_coach

class PredictionPipeline:
    """
    Coordinates and executes the entire inference pipeline for a single user record:
    1. Input normalization/default calculations
    2. Feature engineering
    3. Preprocessing (dropping analytical properties & aligns columns using pre-fitted categories)
    4. SHAP explainability analysis
    5. Formatting of raw metrics into human-readable stories
    6. Counterfactual coaching roadmap generation
    """
    def __init__(self):
        # Resolve target paths
        self.model_dir = os.path.join(script_dir, "saved_models")
        self.model_path = os.path.join(self.model_dir, "growledger_model.pkl")
        self.preprocessor_path = os.path.join(self.model_dir, "preprocessor.pkl")
        
        if not os.path.exists(self.model_path) or not os.path.exists(self.preprocessor_path):
            raise FileNotFoundError(f"Model or preprocessor missing under directory: {self.model_dir}")
            
        print(f"Pipeline: Loading serialized artifacts from {self.model_dir}")
        self.model = joblib.load(self.model_path)
        self.preprocessor = joblib.load(self.preprocessor_path)
        
        # Initialize the TreeSHAP explainer wrapper
        self.explainer = ShapExplainer(model_dir=self.model_dir)

    def predict(self, raw_input):
        """
        Processes raw user input dictionary and returns a comprehensive structured prediction payload.
        
        Args:
            raw_input (dict): Sanitized user financial inputs from the client.
            
        Returns:
            dict: Enriched dictionary containing predicted class, confidence, explanations, and coaching.
        """
        input_copy = raw_input.copy()
        
        # 1. Fill missing ratio properties with derived defaults based on raw inputs
        income = float(input_copy.get("monthly_income", 0))
        expenses = float(input_copy.get("monthly_expenses", 0))
        savings = float(input_copy.get("savings", 0))
        
        if "expense_ratio" not in input_copy:
            input_copy["expense_ratio"] = round(expenses / income if income > 0 else 0.0, 4)
        if "savings_ratio" not in input_copy:
            input_copy["savings_ratio"] = round(savings / income if income > 0 else 0.0, 4)
        if "emi_ratio" not in input_copy:
            input_copy["emi_ratio"] = 0.0
            
        # 2. Represent input as a 1-row Pandas DataFrame to feed the pipeline functions
        df_raw = pd.DataFrame([input_copy])
        
        # 3. Call feature engineering pipeline to add derived indices
        df_engineered = build_features(df_raw)
        
        # 4. Apply preprocessing (drops analytical properties & aligns columns using pre-fitted categories)
        X_processed, _, _ = preprocess_data(df_engineered, preprocessor=self.preprocessor)
        
        # 5. Calculate TreeSHAP values for predicted class
        raw_explanation = self.explainer.explain_processed_user(X_processed)
        
        # 6. Parse and enrich feature attributions to consumer-friendly explanations
        formatted_explanation = format_explanation_payload(raw_explanation)
        
        # 7. Convert processed row to dictionary for counterfactual analysis
        processed_user_features = X_processed.iloc[0].to_dict()
        
        # Run counterfactual coaching rules
        coach_output = run_financial_coach(
            processed_user_features=processed_user_features,
            formatted_explanation=formatted_explanation,
            prediction=formatted_explanation["prediction"]
        )
        
        # 8. Return consolidated response
        return {
            "prediction": formatted_explanation["prediction"],
            "confidence": formatted_explanation["confidence"],
            "strengthened_profile": formatted_explanation["strengthened_profile"],
            "reduced_readiness": formatted_explanation["reduced_readiness"],
            "financial_story": formatted_explanation["financial_story"],
            "coaching": coach_output,
            "model_metadata": {
                "model": formatted_explanation.get("model", "LightGBM"),
                "explanation_method": formatted_explanation.get("explanation_method", "TreeSHAP")
            }
        }
