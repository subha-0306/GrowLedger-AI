# Lightweight rule-based heuristic projection engine.
# Estimates future credit readiness tier transitions without model retraining.

def estimate_projection(current_tier, user_features, target_recommendation):
    """
    Estimates how resolving the target recommendation's feature affects
    the user's credit tier.
    
    Args:
        current_tier (str): The current credit readiness category (Building, Emerging, Ready).
        user_features (dict): The raw user inputs.
        target_recommendation (dict): The selected credit advice.
        
    Returns:
        dict: Projected output containing current_tier, projected_tier, and confidence.
    """
    tier_order = ["Building", "Emerging", "Ready"]
    current_idx = tier_order.index(current_tier) if current_tier in tier_order else 0
    
    if current_idx == 2:
        # Already at the highest tier
        projected_tier = "Ready"
        confidence = 95.0
    else:
        projected_idx = current_idx + 1
        projected_tier = tier_order[projected_idx]
        
        # Calculate a dynamic confidence score based on other supportive features
        base_confidence = 75.0
        
        # Flawless payment record bonus
        missed = int(user_features.get("missed_payments", 0))
        if missed == 0:
            base_confidence += 10.0
        else:
            base_confidence -= min(missed * 5.0, 15.0)
            
        # Digital transaction volume bonus
        digital_trust = float(user_features.get("digital_trust_score", 0.5))
        if digital_trust > 0.7:
            base_confidence += 5.0
            
        # Emergency buffer safety check
        buffer = float(user_features.get("financial_buffer", 1.0))
        if buffer > 1.5:
            base_confidence += 5.0
            
        # Apply strict floors and caps to keep estimates realistic
        confidence = max(min(base_confidence, 90.0), 60.0)
        
    conf = round(confidence, 2)
    if conf >= 90.0:
        impact_level = "Very High"
    elif conf >= 80.0:
        impact_level = "High"
    elif conf >= 70.0:
        impact_level = "Moderate"
    else:
        impact_level = "Low"
        
    return {
        "current_tier": current_tier,
        "projected_tier": projected_tier,
        "confidence": conf,
        "impact_level": impact_level
    }
