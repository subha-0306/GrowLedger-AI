# Counterfactual Financial Coach coordination engine.
# Identifies the highest negative driver and generates tailored, milestone-based improvement roadmaps.

try:
    from counterfactual.recommendation_rules import get_recommendation
    from counterfactual.roadmap_generator import generate_roadmap
    from counterfactual.projection_engine import estimate_projection
except ModuleNotFoundError:
    from recommendation_rules import get_recommendation
    from roadmap_generator import generate_roadmap
    from projection_engine import estimate_projection

def run_financial_coach(processed_user_features, formatted_explanation, prediction):
    """
    Orchestrates the Counterfactual Coaching flow.
    
    Args:
        processed_user_features (dict or pd.Series): Raw or processed feature inputs for numerical evaluations.
        formatted_explanation (dict): Payload returned by the explanation formatter.
        prediction (str): Current predicted tier (Building, Emerging, Ready).
        
    Returns:
        dict: Fully structured counterfactual advice package.
    """
    # 1. Identify the most important negative SHAP feature from reduced_readiness
    reduced_readiness = formatted_explanation.get("reduced_readiness", [])
    
    if reduced_readiness:
        # First negative feature has the largest negative impact (most negative SHAP value)
        target_feature = reduced_readiness[0].get("feature", "savings_ratio")
    else:
        # Fallback if the profile has no negative drivers (e.g. they are already in the highest Ready tier)
        target_feature = "financial_buffer"
        
    # 2. Map target feature to a core recommendation card
    recommendation = get_recommendation(target_feature, processed_user_features)
    
    # 3. Generate structured 30/60/90 day milestone roadmap
    roadmap = generate_roadmap(recommendation, processed_user_features)
    
    # 4. Generate future tier projection estimate
    projection = estimate_projection(prediction, processed_user_features, recommendation)
    
    # 5. Build dynamic expected impact text
    expected_impact = (
        f"Addressing '{recommendation['title']}' is projected to transition your credit readiness profile "
        f"from {prediction} to {projection['projected_tier']} with an estimated confidence of {projection['confidence']}%."
    )
    
    # 6. Return combined coach payload
    return {
        "priority_action": recommendation["title"],
        "action_description": f"Focus on '{recommendation['title']}' to improve your financial readiness.",
        "quick_win": recommendation["estimated_change"],
        "expected_impact": expected_impact,
        "roadmap": roadmap,
        "future_projection": projection
    }

if __name__ == "__main__":
    # Test script to verify the Counterfactual Coach works end-to-end
    import json
    import os
    import sys
    
    # Resolve paths to allow direct execution
    script_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(script_dir)
    if parent_dir not in sys.path:
        sys.path.append(parent_dir)
        
    from ml.preprocessing import prepare_train_test_split
    from explainability.shap_explainer import ShapExplainer
    from explainability.formatter import format_explanation_payload
    
    print("\n--- Initializing Explainer and Data Splits ---")
    explainer = ShapExplainer()
    data_dict = prepare_train_test_split()
    X_test = data_dict["X_test"]
    
    # Fetch first test record
    first_user = X_test.iloc[[0]]
    raw_user_dict = X_test.iloc[0].to_dict()
    
    # Generate formatted SHAP explainability response
    raw_explanation = explainer.explain_processed_user(first_user)
    formatted_explanation = format_explanation_payload(raw_explanation)
    
    print("\n--- Running Counterfactual Coach ---")
    coach_output = run_financial_coach(
        processed_user_features=raw_user_dict,
        formatted_explanation=formatted_explanation,
        prediction=formatted_explanation["prediction"]
    )
    
    print("\nCounterfactual Coach JSON Output:")
    print(json.dumps(coach_output, indent=2))
