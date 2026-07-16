# Formatter module formatting explainability calculations for the presentation layer.
# Technical column names and SHAP values are resolved to user-friendly conversational explanations.

# Try imports supporting running both as a module from backend root or directly
try:
    from explainability.feature_dictionary import FEATURE_EXPLANATIONS, FEATURE_DICT, FEATURE_CLAUSES
    from ml.preprocessing import INVERSE_MAPPING
except ModuleNotFoundError:
    from feature_dictionary import FEATURE_EXPLANATIONS, FEATURE_DICT, FEATURE_CLAUSES
    from preprocessing import INVERSE_MAPPING

def format_explanation_payload(payload):
    """
    Enriches and formats the raw explainability payload to be fully consumer-friendly.
    Converts numbers to text labels, transforms confidence to percentage,
    replaces SHAP lists with conversational lists, and synthesizes a narrative summary.
    
    Args:
        payload (dict): Output dict from shap_explainer.py containing prediction, confidence,
                        positive_features, and negative_features.
                        
    Returns:
        dict: Redesigned response payload for frontend.
    """
    raw_pred = payload["prediction"]
    pred_label = INVERSE_MAPPING.get(raw_pred, str(raw_pred))
    
    # Format confidence as percentage (e.g. 0.999299 -> 99.93)
    confidence_percentage = round(payload["confidence"] * 100, 2)
    
    # Format positive features -> strengthened_profile
    strengthened_profile = []
    for item in payload["positive_features"]:
        raw_name = item["feature"]
        explanation = FEATURE_EXPLANATIONS.get(raw_name, {}).get("positive")
        if explanation:
            strengthened_profile.append({
                "feature": raw_name,
                "title": explanation["title"],
                "description": explanation["description"]
            })
        else:
            # Fallback for dynamic/new categories
            readable_name = FEATURE_DICT.get(raw_name, raw_name)
            strengthened_profile.append({
                "feature": raw_name,
                "title": f"Healthy {readable_name}",
                "description": f"Your {readable_name.lower()} is contributing positively to your profile."
            })
            
    # Format negative features -> reduced_readiness
    reduced_readiness = []
    for item in payload["negative_features"]:
        raw_name = item["feature"]
        explanation = FEATURE_EXPLANATIONS.get(raw_name, {}).get("negative")
        if explanation:
            reduced_readiness.append({
                "feature": raw_name,
                "title": explanation["title"],
                "description": explanation["description"]
            })
        else:
            # Fallback for dynamic/new categories
            readable_name = FEATURE_DICT.get(raw_name, raw_name)
            reduced_readiness.append({
                "feature": raw_name,
                "title": f"High {readable_name}",
                "description": f"Your {readable_name.lower()} is currently holding back your readiness."
            })
            
    # Generate conversational financial story dynamically using top features (max 2 features per direction)
    pos_clauses = []
    for item in payload["positive_features"][:2]:
        raw_name = item["feature"]
        clause = FEATURE_CLAUSES.get(raw_name, {}).get("positive")
        if clause:
            pos_clauses.append(clause)
            
    neg_clauses = []
    rec_clauses = []
    for item in payload["negative_features"][:2]:
        raw_name = item["feature"]
        clause = FEATURE_CLAUSES.get(raw_name, {}).get("negative")
        rec = FEATURE_CLAUSES.get(raw_name, {}).get("recommendation")
        if clause:
            neg_clauses.append(clause)
        if rec:
            rec_clauses.append(rec)
            
    # Combine positive clauses grammatically
    if len(pos_clauses) == 2:
        pos_str = f"{pos_clauses[0]} and {pos_clauses[1]}"
    elif len(pos_clauses) == 1:
        pos_str = pos_clauses[0]
    else:
        pos_str = "some positive financial behaviors"
        
    # Combine negative clauses grammatically
    if len(neg_clauses) == 2:
        neg_str = f"{neg_clauses[0]} and {neg_clauses[1]}"
    elif len(neg_clauses) == 1:
        neg_str = neg_clauses[0]
    else:
        neg_str = "some areas of financial concern"
        
    # Combine recommendations grammatically
    if len(rec_clauses) == 2:
        rec_str = f"{rec_clauses[0]} and {rec_clauses[1]}"
    elif len(rec_clauses) == 1:
        rec_str = rec_clauses[0]
    else:
        rec_str = "addressing these areas"
        
    # Capitalize the first letter of the recommendations sentence
    rec_sentence_start = rec_str.capitalize()
    
    # Synthesize the final financial story
    financial_story = (
        f"Your financial profile shows {pos_str}. However, {neg_str} "
        f"reduced your readiness. {rec_sentence_start} "
        f"could significantly strengthen your financial position."
    )
            
    return {
        "prediction": pred_label,
        "confidence": confidence_percentage,
        "strengthened_profile": strengthened_profile,
        "reduced_readiness": reduced_readiness,
        "financial_story": financial_story,
        # Methodology metadata fields for internal audit / Methodology dashboard
        "model": "LightGBM",
        "explanation_method": "TreeSHAP"
    }
