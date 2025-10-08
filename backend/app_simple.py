#!/usr/bin/env python3
"""
DrugTox-AI Clean Backend API with Groq AI Integration
=====================================================
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
import traceback
from datetime import datetime
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add models directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'models'))

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:3001"], supports_credentials=True)

# Global instances
predictor = None
groq_client = None

def initialize_services():
    """Initialize ML predictor and AI services"""
    global predictor, groq_client
    
    # Initialize ML predictor
    try:
        from models.simple_predictor import SimpleDrugToxPredictor
        predictor = SimpleDrugToxPredictor()
        if predictor.is_loaded:
            print("✅ DrugTox predictor initialized successfully")
        else:
            print("❌ DrugTox predictor failed to load")
            return False
    except Exception as e:
        print(f"❌ Error initializing predictor: {e}")
        return False
    
    # Initialize Groq AI client
    try:
        from groq import Groq
        api_key = os.getenv('GROQ_API_KEY', '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')
        groq_client = Groq(api_key=api_key)
        print("✅ Groq AI client initialized successfully")
    except Exception as e:
        print(f"⚠️ Groq AI client initialization failed: {e}")
        groq_client = None
    
    return True

def analyze_molecule_with_ai(smiles, toxicity_results):
    """Generate AI analysis for molecule"""
    if not groq_client:
        return "AI analysis not available"
    
    try:
        # Prepare context for AI analysis
        results_summary = []
        for endpoint, data in toxicity_results.items():
            results_summary.append(f"- {endpoint}: {data.get('prediction', 'Unknown')} "
                                 f"(Probability: {data.get('probability', 0):.2f})")
        
        messages = [
            {
                "role": "system",
                "content": "You are an expert chemoinformatics AI specializing in toxicology and drug safety. "
                          "Provide concise, scientific analysis of molecular toxicity predictions."
            },
            {
                "role": "user",
                "content": f"""
                Analyze this molecular toxicity prediction:
                
                Molecule SMILES: {smiles}
                
                Results:
                {chr(10).join(results_summary)}
                
                Provide a brief analysis covering:
                1. Overall safety assessment
                2. Key concerns (if any)
                3. Confidence in predictions
                
                Keep it under 200 words and scientific but accessible.
                """
            }
        ]
        
        response = groq_client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=messages,
            temperature=0.3,
            max_tokens=300
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        print(f"AI analysis error: {e}")
        return f"AI analysis temporarily unavailable: {str(e)}"

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'predictor_loaded': predictor is not None and predictor.is_loaded,
        'ai_available': groq_client is not None
    })

@app.route('/api/endpoints', methods=['GET'])
def get_endpoints():
    """Get available toxicity endpoints"""
    if not predictor or not predictor.is_loaded:
        return jsonify({'error': 'Predictor not loaded'}), 500
    
    return jsonify({
        'endpoints': predictor.endpoints,
        'count': len(predictor.endpoints),
        'description': 'Available toxicity prediction endpoints'
    })

@app.route('/api/predict', methods=['POST', 'OPTIONS'])
def predict_single():
    """Predict toxicity for a single molecule with AI analysis"""
    if request.method == 'OPTIONS':
        return '', 200
        
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
        
        # Format response for frontend compatibility
        formatted_result = {
            'success': True,
            'molecule': result['smiles'],
            'smiles': result['smiles'],
            'timestamp': result['timestamp'],
            'endpoints': {},
            'summary': result['summary']
        }
        
        # Format predictions to match frontend structure  
        for endpoint, pred_data in result['endpoints'].items():
            formatted_result['endpoints'][endpoint] = {
                'probability': pred_data['probability'],
                'prediction': pred_data['prediction'],
                'confidence': pred_data['confidence']
            }
        
        # Generate AI analysis
        ai_analysis = analyze_molecule_with_ai(smiles, result['endpoints'])
        formatted_result['ai_analysis'] = ai_analysis
        
        return jsonify(formatted_result)
        
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        traceback.print_exc()
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

@app.route('/api/ai/explain/<endpoint_id>', methods=['GET'])
def ai_explain_endpoint(endpoint_id):
    """Get AI explanation of a toxicity endpoint"""
    try:
        if not groq_client:
            return jsonify({'error': 'AI service not available'}), 503
        
        messages = [
            {
                "role": "system", 
                "content": "You are an expert in toxicology. Explain toxicity endpoints clearly and concisely."
            },
            {
                "role": "user",
                "content": f"""
                Explain the toxicity endpoint "{endpoint_id}" in 100-150 words. Include:
                1. What biological system it affects
                2. Why it's important for drug safety
                3. What happens when activated
                
                Make it scientific but understandable.
                """
            }
        ]
        
        response = groq_client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=messages,
            temperature=0.2,
            max_tokens=200
        )
        
        return jsonify({
            'endpoint_id': endpoint_id,
            'explanation': response.choices[0].message.content,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"❌ AI explanation error: {e}")
        return jsonify({'error': f'AI explanation failed: {str(e)}'}), 500

@app.route('/api/ai/chat', methods=['POST', 'OPTIONS'])
def ai_chat():
    """Chat with AI about chemistry and toxicology"""
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        if not groq_client:
            return jsonify({
                'error': 'AI service not available',
                'response': 'Sorry, the AI service is currently unavailable. Please try again later.'
            }), 200  # Return 200 to avoid frontend errors
        
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({
                'error': 'Message required',
                'response': 'Please provide a message to continue our conversation.'
            }), 200
        
        user_message = data['message'].strip()
        if not user_message:
            return jsonify({
                'error': 'Empty message',
                'response': 'Please ask me a question about chemistry, biology, or toxicology!'
            }), 200
        
        print(f"🤖 AI Chat request: {user_message}")
        
        messages = [
            {
                "role": "system",
                "content": "You are ChemBio Assistant, an expert AI in chemistry, biology, and toxicology. "
                          "Provide helpful, accurate, and educational responses about molecular science, "
                          "drug discovery, toxicology, and related topics. Keep responses concise and informative."
            },
            {
                "role": "user",
                "content": user_message
            }
        ]
        
        response = groq_client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=messages,
            temperature=0.7,
            max_tokens=400
        )
        
        ai_response = response.choices[0].message.content
        print(f"✅ AI Chat response generated successfully")
        
        return jsonify({
            'response': ai_response,
            'timestamp': datetime.now().isoformat(),
            'success': True
        })
        
    except Exception as e:
        print(f"❌ AI chat error: {e}")
        import traceback
        traceback.print_exc()
        
        return jsonify({
            'response': f'I apologize, but I encountered an error while processing your request. Please try asking your question again or try a different question.',
            'error': str(e),
            'timestamp': datetime.now().isoformat(),
            'success': False
        }), 200  # Return 200 to avoid frontend errors

@app.route('/api/stats', methods=['GET'])
def get_model_stats():
    """Get model performance statistics"""
    if not predictor or not predictor.is_loaded:
        return jsonify({'error': 'Predictor not loaded'}), 500
    
    # Mock statistics - replace with real data in production
    stats = {
        'model_accuracy': {
            'NR-AR-LBD': 0.839,
            'NR-AhR': 0.834,
            'SR-MMP': 0.808,
            'NR-ER-LBD': 0.757,
            'NR-AR': 0.729
        },
        'total_predictions': 0,  # Would come from database
        'average_accuracy': 0.793,
        'model_version': '1.0.0',
        'last_updated': datetime.now().isoformat()
    }
    
    return jsonify(stats)

@app.route('/', methods=['GET'])
def home():
    """Home page with API information"""
    api_info = {
        'name': 'DrugTox-AI API',
        'version': '2.0.0',
        'description': 'Advanced molecular toxicity prediction with AI analysis',
        'endpoints': {
            'health': '/api/health',
            'predict': '/api/predict',
            'endpoints': '/api/endpoints',
            'ai_chat': '/api/ai/chat',
            'ai_explain': '/api/ai/explain/<endpoint_id>',
            'stats': '/api/stats'
        },
        'features': [
            'Machine Learning toxicity prediction',
            'AI-powered molecular analysis',
            'Interactive chemistry chatbot',
            'Real-time predictions'
        ],
        'status': 'operational',
        'ai_enabled': groq_client is not None
    }
    
    return jsonify(api_info)

if __name__ == '__main__':
    print("🚀 Starting DrugTox-AI Backend Server...")
    print("="*50)
    
    if initialize_services():
        print("✅ All services initialized successfully!")
        print(f"🌟 AI Analysis: {'Enabled' if groq_client else 'Disabled'}")
        print("="*50)
        print("🔗 API endpoints available at http://localhost:5000")
        print("📖 Documentation: http://localhost:5000")
        print("💬 AI Chat: POST /api/ai/chat")
        print("🧪 Predictions: POST /api/predict")
        print("="*50)
        
        app.run(
            host='0.0.0.0', 
            port=5000, 
            debug=True,
            use_reloader=False  # Prevent double initialization
        )
    else:
        print("❌ Failed to initialize services")
        sys.exit(1)