#!/usr/bin/env python3
"""
DrugTox-AI Clean Backend API
===========================
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
import traceback
from datetime import datetime
import uuid
import json

# Add modules to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'models'))
sys.path.append(os.path.join(os.path.dirname(__file__), 'config'))

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# Global instances
predictor = None
db_service = None
groq_client = None

def initialize_services():
    """Initialize all services (ML predictor, database, AI)"""
    global predictor, db_service, groq_client
    
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
    
    # Initialize Supabase database service (disabled for stability)
    print("⚠️ Database service disabled for stable operation")
    db_service = None
    
    # Initialize Groq AI client
    try:
        from config.groq import groq_config
        groq_client = groq_config
        print("✅ Groq AI client initialized successfully")
    except Exception as e:
        print(f"⚠️ Groq AI client initialization failed: {e}")
        groq_client = None
    
    return True

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'predictor_loaded': predictor is not None and predictor.is_loaded
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

@app.route('/api/predict', methods=['POST'])
def predict_single():
    """Predict toxicity for a single molecule with AI analysis"""
    try:
        if not predictor or not predictor.is_loaded:
            return jsonify({'error': 'Predictor not initialized'}), 500
        
        data = request.get_json()
        if not data or 'smiles' not in data:
            return jsonify({'error': 'SMILES string required'}), 400
        
        smiles = data['smiles'].strip()
        if not smiles:
            return jsonify({'error': 'Empty SMILES string'}), 400
        
        # Get prediction
        result = predictor.predict_single(smiles)
        
        if 'error' in result:
            return jsonify({'error': result['error']}), 500
        
        # Format response for frontend compatibility
        formatted_result = {
            'molecule': result['smiles'],
            'smiles': result['smiles'],
            'timestamp': result['timestamp'],
            'predictions': {},
            'overall_toxicity': result['summary']['overall_assessment'],
            'confidence': result['summary']['recommendation'],
            'toxic_endpoints': result['summary']['toxic_endpoints'],
            'average_probability': result['summary']['average_toxicity_probability']
        }
        
        # Format predictions to match frontend structure
        for endpoint, data in result['endpoints'].items():
            formatted_result['predictions'][endpoint] = {
                'probability': data['probability'],
                'prediction': data['prediction'],
                'confidence': data['confidence'],
                'risk': data['prediction']
            }
        
        # Generate AI analysis if Groq is available
        ai_analysis = None
        if groq_client:
            try:
                ai_analysis = groq_client.analyze_molecule(smiles, result['endpoints'])
                formatted_result['ai_analysis'] = ai_analysis
            except Exception as e:
                print(f"⚠️ AI analysis failed: {e}")
                formatted_result['ai_analysis'] = "AI analysis temporarily unavailable."
        
        # Save to database if available
        if db_service:
            try:
                from models.database import PredictionRecord
                prediction_record = PredictionRecord(
                    id=str(uuid.uuid4()),
                    smiles=smiles,
                    molecule_name=data.get('molecule_name'),
                    endpoints=result['endpoints'],
                    ai_analysis=ai_analysis,
                    user_id=data.get('user_id'),
                    created_at=datetime.now(),
                    metadata={'source': 'api', 'version': '1.0'}
                )
                # Note: Using synchronous call for now, should be async in production
                # await db_service.save_prediction(prediction_record)
            except Exception as e:
                print(f"⚠️ Database save failed: {e}")
        
        return jsonify(formatted_result)
        
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        traceback.print_exc()
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

@app.route('/api/predict/batch', methods=['POST'])
def predict_batch():
    """Predict toxicity for multiple molecules"""
    try:
        if not predictor or not predictor.is_loaded:
            return jsonify({'error': 'Predictor not initialized'}), 500
        
        data = request.get_json()
        if not data or 'smiles_list' not in data:
            return jsonify({'error': 'SMILES list required'}), 400
        
        smiles_list = data['smiles_list']
        if not isinstance(smiles_list, list):
            return jsonify({'error': 'SMILES list must be an array'}), 400
        
        if len(smiles_list) > 100:
            return jsonify({'error': 'Maximum 100 molecules per batch'}), 400
        
        # Get predictions
        results = predictor.predict_batch(smiles_list)
        
        # Format results
        formatted_results = []
        for result in results:
            if 'error' not in result:
                formatted_results.append({
                    'smiles': result['smiles'],
                    'timestamp': result['timestamp'],
                    'predictions': result['endpoints'],
                    'overall_toxicity': result['summary']['overall_assessment'],
                    'confidence': result['summary']['recommendation'],
                    'toxic_endpoints': result['summary']['toxic_endpoints'],
                    'average_probability': result['summary']['average_toxicity_probability']
                })
            else:
                formatted_results.append({
                    'smiles': result.get('smiles', 'unknown'),
                    'error': result['error']
                })
        
        return jsonify({
            'results': formatted_results,
            'total_processed': len(formatted_results),
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"❌ Batch prediction error: {e}")
        traceback.print_exc()
        return jsonify({'error': f'Batch prediction failed: {str(e)}'}), 500

@app.route('/api/ai/analyze', methods=['POST'])
def ai_analyze_molecule():
    """Get AI analysis for a molecule and its toxicity results"""
    try:
        if not groq_client:
            return jsonify({'error': 'AI service not available'}), 503
        
        data = request.get_json()
        if not data or 'smiles' not in data or 'toxicity_results' not in data:
            return jsonify({'error': 'SMILES and toxicity results required'}), 400
        
        smiles = data['smiles'].strip()
        toxicity_results = data['toxicity_results']
        
        analysis = groq_client.analyze_molecule(smiles, toxicity_results)
        
        return jsonify({
            'smiles': smiles,
            'analysis': analysis,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"❌ AI analysis error: {e}")
        return jsonify({'error': f'AI analysis failed: {str(e)}'}), 500

@app.route('/api/ai/explain/<endpoint_id>', methods=['GET'])
def ai_explain_endpoint(endpoint_id):
    """Get AI explanation of a toxicity endpoint"""
    try:
        if not groq_client:
            return jsonify({'error': 'AI service not available'}), 503
        
        explanation = groq_client.explain_endpoint(endpoint_id)
        
        return jsonify({
            'endpoint_id': endpoint_id,
            'explanation': explanation,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"❌ AI explanation error: {e}")
        return jsonify({'error': f'AI explanation failed: {str(e)}'}), 500

@app.route('/api/ai/suggest-modifications', methods=['POST'])
def ai_suggest_modifications():
    """Get AI suggestions for molecular modifications to reduce toxicity"""
    try:
        if not groq_client:
            return jsonify({'error': 'AI service not available'}), 503
        
        data = request.get_json()
        if not data or 'smiles' not in data or 'toxic_endpoints' not in data:
            return jsonify({'error': 'SMILES and toxic endpoints required'}), 400
        
        smiles = data['smiles'].strip()
        toxic_endpoints = data['toxic_endpoints']
        
        suggestions = groq_client.suggest_modifications(smiles, toxic_endpoints)
        
        return jsonify({
            'smiles': smiles,
            'toxic_endpoints': toxic_endpoints,
            'suggestions': suggestions,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"❌ AI suggestions error: {e}")
        return jsonify({'error': f'AI suggestions failed: {str(e)}'}), 500

@app.route('/api/ai/chat', methods=['POST'])
def ai_chat():
    """General AI chat endpoint for ChemBio questions"""
    try:
        if not groq_client:
            return jsonify({'error': 'AI service not available'}), 503
        
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'error': 'Message required'}), 400
        
        user_message = data['message'].strip()
        if not user_message:
            return jsonify({'error': 'Empty message'}), 400
        
        # Create a specialized chemistry/biology AI assistant
        messages = [
            {
                "role": "system",
                "content": """You are an expert ChemBio AI assistant with deep knowledge in chemistry, biology, toxicology, and pharmaceutical sciences.

EXPERTISE AREAS:
- Molecular structures, SMILES notation, and chemical properties
- Drug mechanisms of action and pharmacology (ADME, PK/PD)
- Toxicology and safety assessment (endpoints, testing methods)
- Computational chemistry and QSAR modeling
- Protein structure/function and enzyme kinetics
- Drug discovery and development processes
- Regulatory science and risk assessment

RESPONSE STYLE:
- Provide detailed, scientifically accurate explanations
- Use clear structure with headers, bullet points, and emojis
- Include specific examples and technical details when appropriate
- Explain complex concepts in accessible language
- Always mention when to consult healthcare professionals for medical advice

TOXICITY ENDPOINTS (key focus areas):
- NR-AR-LBD: Nuclear Receptor Androgen Receptor Ligand Binding Domain
- NR-AhR: Nuclear Receptor Aryl Hydrocarbon Receptor
- SR-MMP: Stress Response Mitochondrial Membrane Potential  
- NR-ER-LBD: Nuclear Receptor Estrogen Receptor Ligand Binding Domain
- NR-AR: Nuclear Receptor Androgen Receptor

Format responses with clear sections, technical accuracy, and educational value."""
            },
            {
                "role": "user",
                "content": user_message
            }
        ]
        
        response = groq_client.chat_completion(messages, temperature=0.7, max_tokens=1200)
        
        return jsonify({
            'message': user_message,
            'response': response,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"❌ AI chat error: {e}")
        return jsonify({'error': f'AI chat failed: {str(e)}'}), 500

@app.route('/api/database/predictions', methods=['GET'])
def get_user_predictions():
    """Get user's prediction history from database"""
    try:
        if not db_service:
            return jsonify({'error': 'Database service not available'}), 503
        
        user_id = request.args.get('user_id', 'anonymous')
        limit = int(request.args.get('limit', 50))
        
        # Note: This should be async in production
        predictions = []  # await db_service.get_user_predictions(user_id, limit)
        
        return jsonify({
            'predictions': [pred.to_dict() for pred in predictions],
            'count': len(predictions),
            'user_id': user_id
        })
        
    except Exception as e:
        print(f"❌ Database query error: {e}")
        return jsonify({'error': f'Database query failed: {str(e)}'}), 500

@app.route('/api/database/molecules', methods=['GET'])
def get_molecule_library():
    """Get molecules from the library"""
    try:
        if not db_service:
            return jsonify({'error': 'Database service not available'}), 503
        
        category = request.args.get('category')
        limit = int(request.args.get('limit', 100))
        
        # Note: This should be async in production
        molecules = []  # await db_service.get_molecule_library(category, limit)
        
        return jsonify({
            'molecules': [mol.to_dict() for mol in molecules],
            'count': len(molecules),
            'category': category
        })
        
    except Exception as e:
        print(f"❌ Database query error: {e}")
        return jsonify({'error': f'Database query failed: {str(e)}'}), 500

@app.route('/api/stats', methods=['GET'])
def get_model_stats():
    """Get model performance statistics"""
    if not predictor or not predictor.is_loaded:
        return jsonify({'error': 'Predictor not loaded'}), 500
    
    return jsonify({
        'model_info': {
            'endpoints': len(predictor.endpoints),
            'endpoint_names': predictor.endpoints,
            'algorithm': 'Ensemble (Random Forest + Gradient Boosting)',
            'features': '50 optimized molecular descriptors',
            'performance': {
                'NR-AR-LBD': 0.839,
                'NR-AhR': 0.834,
                'SR-MMP': 0.808,
                'NR-ER-LBD': 0.776,
                'NR-AR': 0.710,
                'average_roc_auc': 0.794
            }
        },
        'status': 'Active',
        'last_updated': datetime.now().isoformat()
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("\n🧪 DrugTox-AI Clean Backend API")
    print("=" * 50)
    
    # Initialize predictor
    if initialize_services():
        print(f"📊 Available endpoints: {len(predictor.endpoints)}")
        print(f"🔬 Model status: ✅ Loaded")
        print("🌐 Starting server on http://localhost:5000")
        print("=" * 50)
        
        app.run(
            host='127.0.0.1',
            port=5000,
            debug=True
        )
    else:
        print("❌ Failed to initialize predictor. Exiting.")
        sys.exit(1)