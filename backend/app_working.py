#!/usr/bin/env python3
"""
DrugTox-AI Backend - Complete Working Version
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
import traceback
from datetime import datetime
import json

# Add models directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
models_dir = os.path.join(current_dir, 'models')
sys.path.insert(0, models_dir)

print(f"📁 Current directory: {current_dir}")
print(f"📁 Models directory: {models_dir}")
print(f"📁 Models dir exists: {os.path.exists(models_dir)}")

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:3001"], supports_credentials=True)

# Global instances
predictor = None
ai_available = False

def initialize_predictor():
    """Initialize the ML predictor"""
    global predictor
    try:
        print("🔄 Attempting to import SimpleDrugToxPredictor...")
        from simple_predictor import SimpleDrugToxPredictor
        print("✅ Import successful, creating predictor instance...")
        
        predictor = SimpleDrugToxPredictor()
        if predictor.is_loaded:
            print("✅ DrugTox predictor initialized successfully")
            print(f"📊 Available endpoints: {len(predictor.endpoints)}")
            return True
        else:
            print("❌ DrugTox predictor failed to load models")
            return False
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("📂 Available files in models directory:")
        if os.path.exists(models_dir):
            for file in os.listdir(models_dir):
                print(f"   - {file}")
        return False
    except Exception as e:
        print(f"❌ Error initializing predictor: {e}")
        traceback.print_exc()
        return False

def get_ai_response(message):
    """Get AI response with robust error handling"""
    try:
        import groq
        client = groq.Groq(api_key='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')
        
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful chemistry and toxicology expert AI. Provide clear, scientific responses."
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
            temperature=0.7,
            max_tokens=300
        )
        
        return response.choices[0].message.content
    except Exception as e:
        print(f"🔧 AI Error: {e}")
        return f"AI analysis is currently experiencing technical difficulties. Error: {str(e)[:100]}..."

@app.route('/', methods=['GET'])
def home():
    """Home endpoint with status"""
    return jsonify({
        'name': 'DrugTox-AI API',
        'version': '2.1.0',
        'status': 'operational',
        'predictor_available': predictor is not None and predictor.is_loaded,
        'timestamp': datetime.now().isoformat(),
        'endpoints': {
            'health': 'GET /api/health',
            'predict': 'POST /api/predict',
            'chat': 'POST /api/ai/chat',
            'endpoints': 'GET /api/endpoints'
        }
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'predictor_loaded': predictor is not None and predictor.is_loaded,
        'models_count': len(predictor.endpoints) if predictor and predictor.is_loaded else 0,
        'version': '2.1.0'
    })

@app.route('/api/predict', methods=['POST', 'OPTIONS'])
def predict():
    """Predict toxicity for a molecule"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        print(f"📨 Received prediction request")
        
        if not predictor or not predictor.is_loaded:
            print("❌ Predictor not available")
            return jsonify({'success': False, 'error': 'Predictor not initialized'}), 500
        
        data = request.get_json()
        print(f"📝 Request data: {data}")
        
        if not data or 'smiles' not in data:
            return jsonify({'success': False, 'error': 'SMILES string required'}), 400
        
        smiles = data['smiles'].strip()
        if not smiles:
            return jsonify({'success': False, 'error': 'Empty SMILES string'}), 400
        
        print(f"🧪 Processing SMILES: {smiles}")
        
        # Get ML prediction
        result = predictor.predict_single(smiles)
        print(f"🔍 Prediction result: {result.get('success', 'unknown')}")
        
        if 'error' in result:
            return jsonify({'success': False, 'error': result['error']}), 500
        
        # Format response for frontend compatibility
        formatted_result = {
            'success': True,
            'smiles': result['smiles'],
            'timestamp': result['timestamp'],
            'endpoints': result['endpoints'],
            'summary': result['summary']
        }
        
        # Try to get AI analysis
        try:
            print("🤖 Generating AI analysis...")
            summary = result['summary']
            ai_prompt = f"Briefly analyze this toxicity prediction for molecule {smiles}: Overall assessment is {summary.get('overall_assessment', 'unknown')}. Provide 2-3 sentences of scientific insight."
            ai_analysis = get_ai_response(ai_prompt)
            formatted_result['ai_analysis'] = ai_analysis
            print("✅ AI analysis generated")
        except Exception as e:
            print(f"⚠️ AI analysis failed: {e}")
            formatted_result['ai_analysis'] = "AI analysis temporarily unavailable."
        
        print("✅ Sending successful response")
        return jsonify(formatted_result)
        
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        traceback.print_exc()
        return jsonify({'success': False, 'error': f'Prediction failed: {str(e)}'}), 500

@app.route('/api/ai/chat', methods=['POST', 'OPTIONS'])
def ai_chat():
    """Chat with AI assistant"""
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        print(f"💬 Received chat request")
        
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'error': 'Message required'}), 400
        
        message = data['message'].strip()
        if not message:
            return jsonify({'error': 'Empty message'}), 400
        
        print(f"📨 Chat message: {message[:50]}...")
        
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
        'count': len(predictor.endpoints),
        'available': True
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("🚀 Starting DrugTox-AI Backend Server...")
    print("="*60)
    
    if initialize_predictor():
        print("="*60)
        print("✅ ALL SERVICES READY!")
        print("🔗 Backend API: http://localhost:5000")
        print("🌐 Frontend: http://localhost:3000")
        print("💬 AI Chat: POST /api/ai/chat")
        print("🧪 Predictions: POST /api/predict")
        print("❤️ Health: GET /api/health")
        print("="*60)
        
        try:
            app.run(
                host='0.0.0.0', 
                port=5000, 
                debug=True,
                use_reloader=False
            )
        except KeyboardInterrupt:
            print("\n🛑 Server stopped by user")
        except Exception as e:
            print(f"❌ Server error: {e}")
            traceback.print_exc()
    else:
        print("❌ FAILED TO INITIALIZE SERVICES")
        print("🔧 Check that model files exist and dependencies are installed")
        sys.exit(1)