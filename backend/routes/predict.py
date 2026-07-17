from flask import Blueprint, request, jsonify
from utils.validation import validate_predict_payload
from utils.errors import APIError
from ml.pipeline import PredictionPipeline

predict_bp = Blueprint('predict', __name__)

# Initialize pipeline lazily to avoid loading during blueprint definition
pipeline = None

def get_pipeline():
    global pipeline
    if pipeline is None:
        try:
            pipeline = PredictionPipeline()
        except Exception as e:
            raise APIError(
                message=f"Failed to initialize predictive pipeline: {str(e)}",
                status_code=500,
                code="PIPELINE_INIT_ERROR"
            )
    return pipeline

@predict_bp.route('/predict', methods=['POST'])
@predict_bp.route('/api/predict', methods=['POST'])
def predict_endpoint():
    """
    Accepts user financial inputs, validates them, calls the ML prediction and counterfactual coaching pipeline,
    and returns the complete response payload.
    """
    data = request.get_json(silent=True)
    if data is None:
        raise APIError("Invalid JSON in request body.", status_code=400, code="MALFORMED_JSON")
        
    try:
        cleaned_data = validate_predict_payload(data)
    except ValueError as e:
        raise APIError(str(e), status_code=400, code="VALIDATION_ERROR")
        
    # Get pre-loaded pipeline instance
    ml_pipeline = get_pipeline()
    
    try:
        prediction_payload = ml_pipeline.predict(cleaned_data)
    except Exception as e:
        raise APIError(
            message=f"Error executing prediction pipeline: {str(e)}",
            status_code=500,
            code="PIPELINE_EXECUTION_ERROR"
        )
        
    return jsonify({
        "success": True,
        "data": prediction_payload
    }), 200
