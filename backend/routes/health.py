from flask import Blueprint, jsonify

health_bp = Blueprint('health', __name__)

@health_bp.route('/health', methods=['GET'])
@health_bp.route('/api/health', methods=['GET'])
def health_check():
    """
    Returns server status, service identification, and API metadata.
    """
    return jsonify({
        "success": True,
        "status": "healthy",
        "service": "GrowLedger Backend",
        "version": "1.0.0"
    }), 200
