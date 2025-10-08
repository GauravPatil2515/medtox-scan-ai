#!/usr/bin/env python3
"""
DrugTox-AI Backend - Simplified and Stable Version
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
import traceback
from datetime import datetime

# Add models directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'models'))

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:3001"], supports_credentials=True)

# Global instances
predictor = None
ai_available = False

def initialize_predictor():
    """Initialize the ML predictor"""
    global predictor
    try:
        from models.simple_predictor import SimpleDrugToxPredictor
        predictor = SimpleDrugToxPredictor()
        if predictor.is_loaded:
            print("✅ DrugTox predictor initialized successfully")
            return True
        else:
            print("❌ DrugTox predictor failed to load")
            return False
    except Exception as e:
        print(f"❌ Error initializing predictor: {e}")
        traceback.print_exc()
        return False

def get_ai_response(message):
    """Get AI response with error handling"""
    try:
        from groq import Groq
        client = Groq(api_key='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')
        
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {
                    "role": "system",
                    "content": "You are a chemistry and toxicology expert. Provide helpful, accurate responses."
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
            temperature=0.7,
            max_tokens=300,
            timeout=30
        )
        
        return response.choices[0].message.content
    except Exception as e:
        print(f"AI Error: {e}")
        return f"I apologize, but I'm experiencing technical difficulties. The error was: {str(e)}"

@app.route('/', methods=['GET'])
def home():
    """Home endpoint"""
    return jsonify({
        'name': 'DrugTox-AI API',
        'version': '2.0.0',
        'status': 'running',
        'predictor_available': predictor is not None and predictor.is_loaded,
        'ai_available': True,
        'endpoints': {
            'health': '/api/health',
            'predict': '/api/predict',
            'chat': '/api/ai/chat'
        }
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'predictor_loaded': predictor is not None and predictor.is_loaded,
        'version': '2.0.0'
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    """Predict toxicity for a molecule"""
    try:
        if not predictor or not predictor.is_loaded:
            return jsonify({'error': 'Predictor not initialized'}), 500
        
        data = request.get_json()
        if not data or 'smiles' not in data:
            return jsonify({'error': 'SMILES string required'}), 400
        
        smiles = data['smiles'].strip()
        if not smiles:
            return jsonify({'error': 'Empty SMILES string'}), 400
        
        # Get ML prediction
        result = predictor.predict_single(smiles)
        
        if 'error' in result:
            return jsonify({'error': result['error']}), 500
        
        # Format response
        formatted_result = {
            'success': True,
            'smiles': result['smiles'],
            'timestamp': result['timestamp'],
            'endpoints': result['endpoints'],
            'summary': result['summary']
        }
        
        # Try to get AI analysis
        try:
            ai_prompt = f"Analyze this molecular toxicity prediction for {smiles}. Results: {result['summary']['overall_assessment']}. Provide a brief scientific analysis in 2-3 sentences."
            ai_analysis = get_ai_response(ai_prompt)
            formatted_result['ai_analysis'] = ai_analysis
        except Exception as e:
            print(f"AI analysis failed: {e}")
            formatted_result['ai_analysis'] = "AI analysis currently unavailable."
        
        return jsonify(formatted_result)
        
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        traceback.print_exc()
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

@app.route('/api/ai/chat', methods=['POST'])
def ai_chat():
    """Chat with AI assistant"""
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'error': 'Message required'}), 400
        
        message = data['message'].strip()
        if not message:
            return jsonify({'error': 'Empty message'}), 400
        
        response_text = get_ai_response(message)
        
        return jsonify({
            'response': response_text,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"❌ Chat error: {e}")
        return jsonify({'error': f'Chat failed: {str(e)}'}), 500

@app.route('/api/endpoints', methods=['GET'])
def get_endpoints():
    """Get available endpoints"""
    if not predictor or not predictor.is_loaded:
        return jsonify({'error': 'Predictor not loaded'}), 500
    
    return jsonify({
        'endpoints': predictor.endpoints,
        'count': len(predictor.endpoints)
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("🚀 Starting DrugTox-AI Backend Server...")
    print("="*50)
    
    if initialize_predictor():
        print("✅ All services initialized successfully!")
        print("="*50)
        print("🔗 API available at: http://localhost:5000")
        print("🌐 Frontend: http://localhost:3000")
        print("💬 AI Chat: POST /api/ai/chat")
        print("🧪 Predictions: POST /api/predict")
        print("❤️ Health: GET /api/health")
        print("="*50)
        
        try:
            app.run(
                host='0.0.0.0', 
                port=5000, 
                debug=False,  # Disable debug mode for stability
                use_reloader=False
            )
        except KeyboardInterrupt:
            print("\n🛑 Server stopped by user")
        except Exception as e:
            print(f"❌ Server error: {e}")
    else:
        print("❌ Failed to initialize services")
        sys.exit(1)