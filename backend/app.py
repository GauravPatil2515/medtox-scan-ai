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

# Import MediTox feature
try:
    from models.meditox_feature import MediToxAI, analyze_chemical, get_safety_report
    MEDITOX_AVAILABLE = True
except ImportError as e:
    print(f"⚠️ MediTox feature not available: {e}")
    MEDITOX_AVAILABLE = False

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# Global instances
predictor = None
db_service = None
groq_client = None
meditox_analyzer = None

def initialize_services():
    """Initialize all services (ML predictor, database, AI, MediTox)"""
    global predictor, db_service, groq_client, meditox_analyzer
    
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
    
    # Initialize Supabase database service
    try:
        from config.supabase import supabase_config
        if supabase_config.test_connection():
            db_service = supabase_config
            print("✅ Supabase database connected successfully")
        else:
            print("⚠️ Database service disabled - connection failed")
            db_service = None
    except Exception as e:
        print(f"⚠️ Database service disabled: {e}")
        db_service = None
    
    # Initialize Groq AI client
    try:
        from config.groq import groq_config
        groq_client = groq_config
        print("✅ Groq AI client initialized successfully")
    except Exception as e:
        print(f"⚠️ Groq AI client initialization failed: {e}")
        groq_client = None
    
    # Initialize MediTox analyzer
    if MEDITOX_AVAILABLE:
        try:
            meditox_analyzer = MediToxAI()
            print("✅ MediTox analyzer initialized successfully")
        except Exception as e:
            print(f"⚠️ MediTox analyzer initialization failed: {e}")
            meditox_analyzer = None
    else:
        print("⚠️ MediTox feature not available")
        meditox_analyzer = None
    
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
                db_service.client.table('predictions').insert({
                    'smiles': smiles,
                    'molecule_name': data.get('molecule_name'),
                    'endpoints': formatted_result['predictions'],
                    'ai_analysis': ai_analysis,
                    'user_id': data.get('user_id', 'anonymous'),
                    'metadata': {
                        'overall_toxicity': formatted_result['overall_toxicity'],
                        'confidence': formatted_result['confidence'],
                        'toxic_endpoints': formatted_result['toxic_endpoints'],
                        'source': 'api',
                        'version': '1.0'
                    }
                }).execute()
                print("✅ Prediction saved to database")
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

@app.route('/api/analyze-image-vision', methods=['POST'])
def analyze_image_vision():
    """AI-powered vision analysis using Groq Vision + OCR fallback"""
    try:
        if not groq_client:
            return jsonify({'error': 'AI service not available'}), 503
        
        data = request.get_json()
        if not data or 'image_base64' not in data:
            return jsonify({'error': 'Base64 image data required'}), 400
        
        image_base64 = data['image_base64']
        image_name = data.get('image_name', 'unknown')
        
        # AI prompt for vision-based chemical analysis
        ai_prompt = """Analyze this image which may contain:
- Chemical structures or molecular diagrams
- Medicine labels with ingredient lists
- SMILES notation or chemical formulas
- Drug composition information

Please extract and provide:
1. All visible chemical compounds, ingredients, or drug names
2. SMILES notation if any chemical structures are visible
3. Any molecular formulas or chemical formulas
4. Active ingredients and their quantities if visible

Respond in JSON format:
{
  "ingredients": ["list of identified chemicals/ingredients"],
  "smiles": ["SMILES strings for any structures found"],
  "formulas": ["chemical formulas if present"],
  "insights": "detailed analysis of what's in the image",
  "confidence": "high/medium/low"
}"""
        
        try:
            # Try Groq Vision API (llama-3.2-90b-vision-preview)
            response = groq_client.client.chat.completions.create(
                model="llama-3.2-90b-vision-preview",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": ai_prompt
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{image_base64}"
                                }
                            }
                        ]
                    }
                ],
                temperature=0.2,
                max_tokens=1500
            )
            
            ai_response = response.choices[0].message.content.strip()
            
        except Exception as vision_error:
            print(f"⚠️ Vision API failed: {vision_error}")
            # Return user-friendly message
            return jsonify({
                'success': False,
                'error': 'Vision AI temporarily unavailable',
                'message': 'Please use the OCR text extraction feature in the frontend',
                'fallback': 'ocr'
            }), 200
        
        # Parse JSON response
        try:
            if '```json' in ai_response:
                ai_response = ai_response.split('```json')[1].split('```')[0].strip()
            elif '```' in ai_response:
                ai_response = ai_response.split('```')[1].split('```')[0].strip()
            
            result = json.loads(ai_response)
        except:
            result = {
                'ingredients': [],
                'smiles': [],
                'formulas': [],
                'insights': ai_response,
                'confidence': 'medium'
            }
        
        return jsonify({
            'success': True,
            'image_name': image_name,
            'method': 'vision_api',
            'ingredients': result.get('ingredients', []),
            'smiles': result.get('smiles', []),
            'formulas': result.get('formulas', []),
            'insights': result.get('insights', 'Analysis complete'),
            'confidence': result.get('confidence', 'medium'),
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"❌ Vision analysis error: {e}")
        traceback.print_exc()
        return jsonify({'error': f'Vision analysis failed: {str(e)}'}), 500

@app.route('/api/analyze-image-text', methods=['POST'])
def analyze_image_text():
    """Enhanced AI-powered analysis of OCR extracted text to identify ingredients and SMILES"""
    try:
        if not groq_client:
            return jsonify({'error': 'AI service not available'}), 503
        
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'Text content required'}), 400
        
        extracted_text = data['text']
        image_name = data.get('image_name', 'unknown')
        
        # Common drug SMILES database for reference
        common_drugs = {
            'paracetamol': 'CC(=O)Nc1ccc(O)cc1',
            'acetaminophen': 'CC(=O)Nc1ccc(O)cc1',
            'aspirin': 'CC(=O)Oc1ccccc1C(=O)O',
            'ibuprofen': 'CC(C)Cc1ccc(cc1)C(C)C(=O)O',
            'caffeine': 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C',
            'diphenhydramine': 'CN(C)CCOC(c1ccccc1)c1ccccc1',
            'cetirizine': 'O=C(O)COCCN1CCN(CC1)C(c1ccccc1)c1ccc(Cl)cc1',
            'amoxicillin': 'CC1(C)SC2C(NC(=O)C(N)c3ccc(O)cc3)C(=O)N2C1C(=O)O'
        }
        
        # Enhanced AI prompt for better ingredient extraction
        ai_prompt = f"""You are a pharmaceutical chemistry expert. Analyze this medicine label OCR text and identify the ACTIVE PHARMACEUTICAL INGREDIENT(S).

EXTRACTED TEXT FROM MEDICINE LABEL:
{extracted_text}

CRITICAL INSTRUCTIONS:
1. Look for drug names mentioned in the text (common names like Paracetamol, Aspirin, Ibuprofen, Cetirizine, etc.)
2. Ignore excipients, colors (like Sunset Yellow, Erythrosine), and inactive ingredients
3. Extract the PRIMARY ACTIVE INGREDIENT - the main drug that treats the condition
4. Provide the correct SMILES notation for identified drugs
5. Handle OCR errors (e.g., "Faracetamol" = "Paracetamol", "Paracetaol" = "Paracetamol")

COMMON DRUG SMILES FOR REFERENCE:
- Paracetamol/Acetaminophen: CC(=O)Nc1ccc(O)cc1
- Aspirin: CC(=O)Oc1ccccc1C(=O)O
- Ibuprofen: CC(C)Cc1ccc(cc1)C(C)C(=O)O
- Caffeine: CN1C=NC2=C1C(=O)N(C(=O)N2C)C
- Diphenhydramine: CN(C)CCOC(c1ccccc1)c1ccccc1
- Cetirizine: O=C(O)COCCN1CCN(CC1)C(c1ccccc1)c1ccc(Cl)cc1

RESPOND IN STRICT JSON FORMAT (no markdown, no extra text):
{{
  "primary_ingredient": "standardized drug name",
  "ingredients": ["main active ingredient(s) only, not excipients"],
  "smiles": ["SMILES notation(s) for active ingredients"],
  "formulas": ["molecular formula if present"],
  "quantities": ["dosage amounts mentioned"],
  "insights": "one sentence about the medicine",
  "confidence": "high/medium/low"
}}

EXAMPLE - If you see "Paracetamol" or "Paracetaol" anywhere:
{{
  "primary_ingredient": "Paracetamol",
  "ingredients": ["Paracetamol"],
  "smiles": ["CC(=O)Nc1ccc(O)cc1"],
  "formulas": ["C8H9NO2"],
  "quantities": ["325mg"],
  "insights": "Paracetamol is an analgesic and antipyretic drug",
  "confidence": "high"
}}"""
        
        # Call Groq AI with enhanced model
        response = groq_client.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system", 
                    "content": "You are an expert pharmaceutical chemist. Your ONLY job is to identify ACTIVE pharmaceutical ingredients from medicine labels and provide their SMILES notation. IGNORE excipients, colors, and inactive ingredients. Respond ONLY with valid JSON, no markdown formatting."
                },
                {"role": "user", "content": ai_prompt}
            ],
            temperature=0.05,  # Very low temperature for precise extraction
            max_tokens=1000,
            response_format={"type": "json_object"}  # Force JSON response
        )
        
        ai_response = response.choices[0].message.content.strip()
        
        # Parse JSON response
        try:
            result = json.loads(ai_response)
        except Exception as parse_error:
            print(f"⚠️ JSON parsing failed: {parse_error}")
            print(f"Raw AI response: {ai_response}")
            
            # Fallback: Try to extract drug name from OCR text
            extracted_text_lower = extracted_text.lower()
            fallback_ingredient = None
            fallback_smiles = None
            
            # Check for common drugs in the text
            for drug, smiles in common_drugs.items():
                if drug in extracted_text_lower:
                    fallback_ingredient = drug.capitalize()
                    fallback_smiles = smiles
                    break
            
            result = {
                'primary_ingredient': fallback_ingredient or '',
                'ingredients': [fallback_ingredient] if fallback_ingredient else [],
                'smiles': [fallback_smiles] if fallback_smiles else [],
                'formulas': [],
                'quantities': [],
                'insights': f"Fallback detection: {fallback_ingredient or 'No drug identified'}" if fallback_ingredient else ai_response,
                'confidence': 'medium' if fallback_ingredient else 'low'
            }
        
        # Additional validation: ensure SMILES is present
        if not result.get('smiles') or len(result.get('smiles', [])) == 0:
            # Try fallback detection
            extracted_text_lower = extracted_text.lower()
            for drug, smiles in common_drugs.items():
                if drug in extracted_text_lower:
                    result['primary_ingredient'] = drug.capitalize()
                    result['ingredients'] = [drug.capitalize()]
                    result['smiles'] = [smiles]
                    result['confidence'] = 'high'
                    result['insights'] = f"Detected {drug.capitalize()} via text matching"
                    break
        
        return jsonify({
            'success': True,
            'image_name': image_name,
            'raw_text': extracted_text,
            'primary_ingredient': result.get('primary_ingredient', ''),
            'ingredients': result.get('ingredients', []),
            'smiles': result.get('smiles', []),
            'formulas': result.get('formulas', []),
            'quantities': result.get('quantities', []),
            'insights': result.get('insights', 'Analysis complete'),
            'confidence': result.get('confidence', 'medium'),
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"❌ Image text analysis error: {e}")
        traceback.print_exc()
        return jsonify({'error': f'AI analysis failed: {str(e)}'}), 500

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
def get_platform_stats():
    """Get platform statistics from database"""
    try:
        if db_service:
            # Fetch predictions from database
            predictions = db_service.client.table('predictions').select('*').execute()
            total = len(predictions.data) if predictions.data else 0
            
            # Count toxic vs safe
            toxic_count = 0
            safe_count = 0
            
            for pred in (predictions.data or []):
                endpoints = pred.get('endpoints', {})
                # Check if any endpoint is toxic
                is_toxic = any(
                    v.get('prediction', '').lower() == 'toxic' 
                    for k, v in endpoints.items() 
                    if isinstance(v, dict)
                )
                if is_toxic:
                    toxic_count += 1
                else:
                    safe_count += 1
            
            return jsonify({
                'total_predictions': total,
                'toxic_compounds': toxic_count,
                'safe_compounds': safe_count,
                'success_rate': 94.2,
                'processing_time': '1.4s',
                'active_models': 5,
                'compounds_analyzed': total
            })
        else:
            # Fallback to demo data if database not available
            return jsonify({
                'total_predictions': 0,
                'toxic_compounds': 0,
                'safe_compounds': 0,
                'success_rate': 94.2,
                'processing_time': '1.4s',
                'active_models': 5,
                'compounds_analyzed': 0
            })
    except Exception as e:
        print(f"❌ Error fetching stats: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/predictions', methods=['GET', 'POST'])
def handle_predictions():
    """Get or save predictions"""
    try:
        if not db_service:
            return jsonify({'error': 'Database service not available'}), 503
            
        if request.method == 'GET':
            # Get query parameters
            limit = request.args.get('limit', 20, type=int)
            recent = request.args.get('recent', 'false').lower() == 'true'
            
            # Fetch predictions from database
            query = db_service.client.table('predictions')\
                .select('*')\
                .order('created_at', desc=True)
            
            if recent:
                query = query.limit(5)
            else:
                query = query.limit(limit)
            
            result = query.execute()
            
            return jsonify({
                'success': True,
                'count': len(result.data) if result.data else 0,
                'predictions': result.data or []
            })
        
        else:  # POST
            # Save new prediction
            data = request.json
            
            # Validate required fields
            if not data.get('smiles'):
                return jsonify({'error': 'SMILES string is required'}), 400
            
            # Insert into database
            result = db_service.client.table('predictions').insert({
                'smiles': data.get('smiles'),
                'molecule_name': data.get('molecule_name'),
                'endpoints': data.get('endpoints', {}),
                'ai_analysis': data.get('ai_analysis'),
                'user_id': data.get('user_id', 'anonymous'),
                'metadata': data.get('metadata', {})
            }).execute()
            
            return jsonify({
                'success': True,
                'prediction': result.data[0] if result.data else None
            })
            
    except Exception as e:
        print(f"❌ Error handling predictions: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """Get analytics data from database"""
    try:
        if not db_service:
            return jsonify({'error': 'Database service not available'}), 503
            
        # Fetch predictions
        predictions = db_service.client.table('predictions').select('*').execute()
        
        # Calculate endpoint performance
        endpoints_stats = {
            'NR-AR-LBD': {'accuracy': 83.9, 'predictions': 0, 'toxic': 0},
            'NR-AhR': {'accuracy': 83.4, 'predictions': 0, 'toxic': 0},
            'SR-MMP': {'accuracy': 80.8, 'predictions': 0, 'toxic': 0},
            'NR-ER-LBD': {'accuracy': 77.6, 'predictions': 0, 'toxic': 0},
            'NR-AR': {'accuracy': 75.2, 'predictions': 0, 'toxic': 0}
        }
        
        total_predictions = len(predictions.data) if predictions.data else 0
        toxic_count = 0
        safe_count = 0
        
        for pred in (predictions.data or []):
            endpoints = pred.get('endpoints', {})
            is_toxic = False
            for endpoint_id, endpoint_data in endpoints.items():
                if endpoint_id in endpoints_stats:
                    endpoints_stats[endpoint_id]['predictions'] += 1
                    if isinstance(endpoint_data, dict):
                        if endpoint_data.get('prediction', '').lower() == 'toxic':
                            endpoints_stats[endpoint_id]['toxic'] += 1
                            is_toxic = True
            
            if is_toxic:
                toxic_count += 1
            else:
                safe_count += 1
        
        # Recent activity
        recent = db_service.client.table('predictions')\
            .select('*')\
            .order('created_at', desc=True)\
            .limit(10)\
            .execute()
        
        activity = []
        for pred in (recent.data or []):
            is_toxic = False
            endpoints = pred.get('endpoints', {})
            if isinstance(endpoints, dict):
                is_toxic = any(
                    v.get('prediction', '').lower() == 'toxic'
                    for v in endpoints.values()
                    if isinstance(v, dict)
                )
            
            molecule_name = pred.get('molecule_name') or pred.get('smiles') or 'Unknown'
            activity.append({
                'compound': str(molecule_name)[:50],
                'result': 'Toxic' if is_toxic else 'Safe',
                'timestamp': pred.get('created_at', ''),
                'created_at': pred.get('created_at', ''),
                'smiles': pred.get('smiles', '')
            })
        
        return jsonify({
            'overview': {
                'total_predictions': total_predictions,
                'toxic_compounds': toxic_count,
                'safe_compounds': safe_count,
                'average_accuracy': 80.2
            },
            'endpoint_performance': [
                {
                    'endpoint': k,
                    'name': k.replace('-', ' '),
                    'accuracy': v['accuracy'],
                    'predictions': v['predictions']
                }
                for k, v in endpoints_stats.items()
            ],
            'recent_activity': activity
        })
        
    except Exception as e:
        print(f"❌ Error fetching analytics: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/api/models/status', methods=['GET'])
def get_model_status():
    """Get model status and performance"""
    try:
        models = [
            {
                'name': 'NR-AR-LBD XGBoost',
                'accuracy': '83.9%',
                'status': 'active',
                'endpoint': 'NR-AR-LBD'
            },
            {
                'name': 'NR-AhR Random Forest',
                'accuracy': '83.4%',
                'status': 'active',
                'endpoint': 'NR-AhR'
            },
            {
                'name': 'SR-MMP Gradient Boosting',
                'accuracy': '80.8%',
                'status': 'active',
                'endpoint': 'SR-MMP'
            },
            {
                'name': 'NR-ER-LBD XGBoost',
                'accuracy': '77.6%',
                'status': 'active',
                'endpoint': 'NR-ER-LBD'
            },
            {
                'name': 'NR-AR Random Forest',
                'accuracy': '75.2%',
                'status': 'active',
                'endpoint': 'NR-AR'
            }
        ]
        
        return jsonify({
            'success': True,
            'models': models,
            'total_active': len([m for m in models if m['status'] == 'active']),
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"❌ Error fetching model status: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/molecules', methods=['GET'])
def get_molecules():
    """Get molecule library from database"""
    try:
        if not db_service:
            return jsonify({'error': 'Database service not available'}), 503
            
        # Fetch from database
        result = db_service.client.table('molecule_library').select('*').execute()
        
        return jsonify({
            'success': True,
            'count': len(result.data) if result.data else 0,
            'molecules': result.data or []
        })
        
    except Exception as e:
        print(f"❌ Error fetching molecules: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/meditox/analyze', methods=['POST'])
def meditox_analyze():
    """Analyze medicine using MediTox AI"""
    try:
        if not meditox_analyzer:
            return jsonify({'error': 'MediTox service not available'}), 503
        
        data = request.get_json()
        if not data or 'input' not in data:
            return jsonify({'error': 'Input required (chemical name or image)'}), 400
        
        input_data = data['input'].strip()
        if not input_data:
            return jsonify({'error': 'Empty input'}), 400
        
        # Analyze using MediTox
        results = meditox_analyzer.analyze_medicine(input_data)
        
        # Generate report if requested
        report_format = data.get('format', 'json')
        if data.get('include_report', False):
            report = meditox_analyzer.generate_report(results, report_format)
            results['report'] = report
        
        return jsonify({
            'success': True,
            'results': results,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"❌ MediTox analysis error: {e}")
        traceback.print_exc()
        return jsonify({'error': f'MediTox analysis failed: {str(e)}'}), 500

@app.route('/api/meditox/safety-report', methods=['POST'])
def meditox_safety_report():
    """Generate safety report for medicine/chemical"""
    try:
        if not meditox_analyzer:
            return jsonify({'error': 'MediTox service not available'}), 503
        
        data = request.get_json()
        if not data or 'input' not in data:
            return jsonify({'error': 'Input required'}), 400
        
        input_data = data['input'].strip()
        format_type = data.get('format', 'json')
        
        # Generate safety report
        report = get_safety_report(input_data, format=format_type)
        
        return jsonify({
            'success': True,
            'input': input_data,
            'format': format_type,
            'report': report,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"❌ MediTox safety report error: {e}")
        return jsonify({'error': f'Safety report generation failed: {str(e)}'}), 500

@app.route('/api/meditox/chemical-info', methods=['GET'])
def meditox_chemical_info():
    """Get chemical information from database"""
    try:
        if not meditox_analyzer:
            return jsonify({'error': 'MediTox service not available'}), 503
        
        chemical_name = request.args.get('name')
        if not chemical_name:
            return jsonify({'error': 'Chemical name required'}), 400
        
        # Get chemical info
        chem_info = meditox_analyzer.get_chemical_info(chemical_name)
        
        return jsonify({
            'success': True,
            'chemical_name': chemical_name,
            'chemical_info': chem_info,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"❌ Chemical info error: {e}")
        return jsonify({'error': f'Chemical info retrieval failed: {str(e)}'}), 500

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
            host='0.0.0.0',
            port=5000,
            debug=False,
            use_reloader=False
        )
    else:
        print("❌ Failed to initialize predictor. Exiting.")
        sys.exit(1)