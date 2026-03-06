from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback
from pipeline import predict_news

app = Flask(__name__)
CORS(app)  

@app.route("/", methods=["GET"])
def health_check():
    return jsonify({
        "status": "OK",
        "message": "Fake News Detection API is running"
    })

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Validate request
        if not data or "text" not in data:
            return jsonify({
                "success": False,
                "error": "Invalid request. 'text' field is required."
            }), 400

        text = data["text"].strip()

        if len(text) == 0:
            return jsonify({
                "success": False,
                "error": "Input text cannot be empty."
            }), 400

        result = predict_news(text)

        return jsonify(result)

    except Exception as e:
        print("ERROR in /predict:")
        traceback.print_exc()

        return jsonify({
            "success": False,
            "error": "Internal server error",
            "details": str(e)
        }), 500

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
    