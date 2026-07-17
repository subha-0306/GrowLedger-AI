import os
import sys
from flask import Flask
from flask_cors import CORS
from config import Config

# Add current file's directory to sys.path to ensure local imports resolve
script_dir = os.path.dirname(os.path.abspath(__file__))
if script_dir not in sys.path:
    sys.path.insert(0, script_dir)

from routes.health import health_bp
from routes.predict import predict_bp
from utils.errors import register_error_handlers

def create_app():
    """
    Application factory pattern to configure and initialize the Flask application.
    """
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Configure Flask-CORS to allow cross-origin requests from frontends
    allowed_origins = os.environ.get('CORS_ORIGINS', '*')
    CORS(app, resources={r"/*": {"origins": allowed_origins}})
    
    # Register blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(predict_bp)
    
    # Register centralized error handlers
    register_error_handlers(app)
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
