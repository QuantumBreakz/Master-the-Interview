import os
import joblib
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from app import AIDetectionReasoningEngine, CodeAnalyzer, ModelResult, LineAnalysis 

app = Flask(__name__)
CORS(app)

# Initialize analyzer
analyzer = None

def get_analyzer():
    global analyzer
    if analyzer is None:
        try:
            analyzer = CodeAnalyzer()
            print("✅ Models loaded successfully")
        except Exception as e:
            print(f"❌ Error loading models: {str(e)}")
    return analyzer

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "models_loaded": analyzer is not None})

@app.route('/analyze', methods=['POST'])
def analyze_code():
    try:
        data = request.json
        code = data.get('code', '')
        
        if not code:
            return jsonify({"error": "No code provided"}), 400
            
        analyzer_instance = get_analyzer()
        if not analyzer_instance:
             return jsonify({"error": "Models not initialized"}), 500

        # Run analysis
        results, final_pred, final_conf = analyzer_instance.analyze_code(code)
        
        # Get line-by-line analysis (using gradient_boost as default)
        line_analyses = analyzer_instance.analyze_lines(code, 'gradient_boost', final_pred)
        
        # Get characteristics
        characteristics = AIDetectionReasoningEngine.analyze_code_characteristics(code, line_analyses)
        
        # Format response
        response = {
            "prediction": final_pred,
            "confidence": float(final_conf),
            "is_ai": final_pred == "ai",
            "summary": {
                "ai_probability": float(final_conf) if final_pred == "ai" else 1 - float(final_conf),
                "human_probability": float(final_conf) if final_pred == "human" else 1 - float(final_conf)
            },
            "detailed_results": [
                {
                    "model": r.name,
                    "prediction": r.prediction,
                    "confidence": float(r.confidence)
                } for r in results
            ],
            "analysis": {
                "ai_characteristics": characteristics.get('ai_characteristics', []),
                "human_characteristics": characteristics.get('human_characteristics', []),
                "metrics": characteristics.get('metrics', {})
            }
        }
        
        return jsonify(response)

    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Initialize models on startup
    get_analyzer()
    port = int(os.environ.get('PORT', 5001))
    print(f"🚀 AI Analysis API running on port {port}")
    app.run(host='0.0.0.0', port=port)
