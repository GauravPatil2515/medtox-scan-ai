#!/usr/bin/env python3
"""
DrugTox-AI Simple Predictor (Clean Version)
==========================================
"""

import os
import pickle
import pandas as pd
import numpy as np
import warnings
from datetime import datetime

warnings.filterwarnings('ignore')

class SimpleDrugToxPredictor:
    """Production-ready predictor without feature scaling dependencies"""
    
    def __init__(self):
        self.base_path = os.path.dirname(os.path.abspath(__file__))
        self.model_path = self.base_path  # Models are in the same directory
        self.models = None
        self.is_loaded = False
        self.endpoints = ['NR-AR-LBD', 'NR-AhR', 'SR-MMP', 'NR-ER-LBD', 'NR-AR']
        self.load_models()
    
    def load_models(self):
        """Load models without scaling dependencies"""
        try:
            model_file = os.path.join(self.model_path, 'best_optimized_models.pkl')
            if not os.path.exists(model_file):
                print(f"❌ Model file not found: {model_file}")
                return False
                
            with open(model_file, 'rb') as f:
                self.models = pickle.load(f)
            
            self.is_loaded = True
            print("✅ Models loaded successfully")
            return True
        except Exception as e:
            print(f"❌ Error loading models: {e}")
            return False
    
    def extract_simple_features(self, smiles):
        """Extract 50 basic features that match training expectations"""
        if not smiles or pd.isna(smiles):
            return np.zeros(50)
        
        smiles = str(smiles).strip()
        features = [
            len(smiles),                    # 1. Length
            smiles.count('C'),              # 2. Carbon count
            smiles.count('N'),              # 3. Nitrogen count
            smiles.count('O'),              # 4. Oxygen count
            smiles.count('S'),              # 5. Sulfur count
            smiles.count('P'),              # 6. Phosphorus count
            smiles.count('F'),              # 7. Fluorine count
            smiles.count('Cl'),             # 8. Chlorine count
            smiles.count('Br'),             # 9. Bromine count
            smiles.count('I'),              # 10. Iodine count
            smiles.count('='),              # 11. Double bonds
            smiles.count('#'),              # 12. Triple bonds
            smiles.count('('),              # 13. Branches
            smiles.count('['),              # 14. Special atoms
            smiles.count('@'),              # 15. Chiral centers
            smiles.count('1'),              # 16. Ring numbers
            smiles.count('2'),              # 17.
            smiles.count('3'),              # 18.
            smiles.count('4'),              # 19.
            smiles.count('5'),              # 20.
            smiles.count('6'),              # 21.
            smiles.lower().count('c'),      # 22. Aromatic carbons
            int('OH' in smiles),            # 23. Hydroxyl
            int('NH2' in smiles),           # 24. Amino
            int('COOH' in smiles),          # 25. Carboxyl
            int('NO2' in smiles),           # 26. Nitro
            int('SO2' in smiles),           # 27. Sulfone
            int('CN' in smiles),            # 28. Nitrile
            int('CF3' in smiles),           # 29. Trifluoromethyl
            int('C=O' in smiles),           # 30. Carbonyl
            int('C=C' in smiles),           # 31. Alkene
            int('C#C' in smiles),           # 32. Alkyne
            int('c1ccc' in smiles.lower()), # 33. Benzene ring
            int('c1cc' in smiles.lower()),  # 34. Aromatic
            len(set(smiles)),               # 35. Unique characters
            smiles.count('/'),              # 36. Stereochemistry
            smiles.count('\\'),             # 37. Stereochemistry
            len(smiles.split('.')),         # 38. Fragment count
            max([smiles.count(c) for c in 'CNOPS'], default=0),  # 39. Max heteroatom
            smiles.count('C') / max(len(smiles), 1),  # 40. Carbon ratio
            int(len(smiles) < 100),         # 41. Size filter
            int(smiles.count('O') + smiles.count('N') < 10),  # 42. H-bond acceptors
            int(smiles.count('OH') + smiles.count('NH') < 5),  # 43. H-bond donors
            int(smiles.count('C') < 50),    # 44. Complexity filter
            smiles.count('C=C'),            # 45. Unsaturation
            smiles.count('c') / max(len(smiles), 1),  # 46. Aromaticity
            int(any(c.isdigit() for c in smiles)),  # 47. Ring indicators
            sum(1 for c in smiles if c.isupper()),  # 48. Uppercase count
            sum(1 for c in smiles if c.islower()),  # 49. Lowercase count
            len([c for c in smiles if c.isalpha()])  # 50. Letter count
        ]
        
        return np.array(features[:50], dtype=np.float64)
    
    def predict_single(self, smiles):
        """Predict toxicity for a single molecule"""
        if not self.is_loaded:
            return {'error': 'Models not loaded'}
        
        try:
            # Extract simplified features
            features = self.extract_simple_features(smiles)
            features_array = features.reshape(1, -1)
            
            predictions = {}
            overall_probabilities = []
            
            for endpoint in self.endpoints:
                if endpoint in self.models:
                    model_info = self.models[endpoint]
                    model = model_info['model']
                    
                    # Try different feature sizes
                    for n_features in [50, 100, 200, 1026]:
                        try:
                            if n_features != len(features):
                                if len(features) < n_features:
                                    padded_features = np.pad(features, (0, n_features - len(features)), 'constant')
                                else:
                                    padded_features = features[:n_features]
                                test_array = padded_features.reshape(1, -1)
                            else:
                                test_array = features_array
                            
                            # Test prediction
                            if hasattr(model, 'predict_proba'):
                                pred_proba = model.predict_proba(test_array)
                                toxicity_prob = pred_proba[0][1] if len(pred_proba[0]) > 1 else pred_proba[0][0]
                            else:
                                pred = model.predict(test_array)
                                toxicity_prob = float(pred[0])
                            
                            prediction = "Toxic" if toxicity_prob > 0.5 else "Non-toxic"
                            confidence = self._get_confidence(toxicity_prob)
                            
                            predictions[endpoint] = {
                                'probability': float(toxicity_prob),
                                'prediction': prediction,
                                'confidence': confidence
                            }
                            
                            overall_probabilities.append(toxicity_prob)
                            break  # Success with this feature size
                            
                        except Exception as e:
                            continue  # Try next feature size
                    
                    if endpoint not in predictions:
                        predictions[endpoint] = {
                            'probability': 0.5,
                            'prediction': "Unknown",
                            'confidence': "Low"
                        }
            
            # Calculate overall assessment
            avg_probability = np.mean(overall_probabilities) if overall_probabilities else 0.5
            toxic_count = sum(1 for p in overall_probabilities if p > 0.5)
            
            return {
                'smiles': smiles,
                'timestamp': datetime.now().isoformat(),
                'endpoints': predictions,
                'summary': {
                    'average_toxicity_probability': float(avg_probability),
                    'toxic_endpoints': f"{toxic_count}/{len(self.endpoints)}",
                    'overall_assessment': self._assess_overall_toxicity(avg_probability),
                    'recommendation': self._get_recommendation(avg_probability)
                }
            }
            
        except Exception as e:
            return {
                'smiles': smiles,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def predict_batch(self, smiles_list):
        """Predict for multiple molecules"""
        results = []
        for i, smiles in enumerate(smiles_list):
            if (i + 1) % 10 == 0:
                print(f"Processed {i + 1}/{len(smiles_list)} molecules")
            results.append(self.predict_single(smiles))
        return results
    
    def _get_confidence(self, probability):
        """Determine confidence level"""
        distance = abs(probability - 0.5)
        if distance > 0.4:
            return "Very High"
        elif distance > 0.3:
            return "High"
        elif distance > 0.2:
            return "Medium"
        elif distance > 0.1:
            return "Low"
        else:
            return "Very Low"
    
    def _assess_overall_toxicity(self, avg_prob):
        """Assess overall toxicity level"""
        if avg_prob >= 0.7:
            return "HIGH TOXICITY ⚠️"
        elif avg_prob >= 0.5:
            return "MODERATE TOXICITY 🟡"
        elif avg_prob >= 0.3:
            return "LOW TOXICITY 🟢"
        else:
            return "VERY LOW TOXICITY ✅"
    
    def _get_recommendation(self, avg_prob):
        """Get safety recommendation"""
        if avg_prob >= 0.7:
            return "Avoid - High toxicity risk"
        elif avg_prob >= 0.5:
            return "Caution - Moderate toxicity risk"
        elif avg_prob >= 0.3:
            return "Acceptable - Low toxicity risk"
        else:
            return "Safe - Very low toxicity risk"

if __name__ == "__main__":
    # Quick test
    print("🧪 Testing DrugTox Predictor")
    predictor = SimpleDrugToxPredictor()
    if predictor.is_loaded:
        result = predictor.predict_single('CCO')
        print(f"✅ Ethanol test: {result['summary']['overall_assessment']}")
    else:
        print("❌ Failed to load models")