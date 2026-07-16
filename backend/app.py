from flask import Flask, jsonify
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "GrowLedger Backend"
    }), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
