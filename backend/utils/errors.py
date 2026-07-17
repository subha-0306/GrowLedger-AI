from flask import jsonify

class APIError(Exception):
    """
    Custom exception class representing operational API errors.
    """
    def __init__(self, message, status_code=400, code="BAD_REQUEST", details=None):
        super().__init__()
        self.message = message
        self.status_code = status_code
        self.code = code
        self.details = details

    def to_dict(self):
        rv = dict(self.details or ())
        rv['message'] = self.message
        rv['code'] = self.code
        return rv

def register_error_handlers(app):
    """
    Registers standard and custom HTTP exception handlers on the Flask app.
    """
    @app.errorhandler(APIError)
    def handle_api_error(error):
        response = jsonify({
            "success": False,
            "error": error.to_dict()
        })
        response.status_code = error.status_code
        return response

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            "success": False,
            "error": {
                "code": "BAD_REQUEST",
                "message": "Malformed request or validation error."
            }
        }), 400

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "success": False,
            "error": {
                "code": "NOT_FOUND",
                "message": "Resource not found."
            }
        }), 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({
            "success": False,
            "error": {
                "code": "METHOD_NOT_ALLOWED",
                "message": "The method is not allowed for the requested URL."
            }
        }), 405

    @app.errorhandler(500)
    def internal_server_error(error):
        app.logger.error(f"Server Error: {error}")
        return jsonify({
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected server error occurred."
            }
        }), 500
