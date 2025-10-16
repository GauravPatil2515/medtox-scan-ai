# MediTox AI - Model Files Documentation
# ======================================

## Models Directory Structure

models/
├── models_optimized.pkl          # Main optimized toxicity prediction models
├── README.md                     # This documentation file
└── model_info.json              # Model metadata and performance metrics

## Model Details

### models_optimized.pkl
- **Type**: Optimized ensemble machine learning models
- **Training Data**: Tox21 Challenge Dataset (~12,000 compounds)
- **Endpoints**: 5 nuclear receptor pathways
  - NR-AR: Nuclear Receptor - Androgen Receptor
  - NR-AR-LBD: AR Ligand Binding Domain
  - NR-AhR: Aryl Hydrocarbon Receptor
  - NR-Aromatase: Aromatase Enzyme Activity
  - NR-ER: Nuclear Receptor - Estrogen Receptor
- **Performance**: Average ROC-AUC ~0.79 across endpoints
- **File Size**: ~50MB (compressed pickle format)
- **Dependencies**: scikit-learn, numpy, pandas

## Model Structure

Each model in the pickle file contains:
```python
{
    'endpoint_name': {
        'model': trained_sklearn_model,
        'performance': {
            'roc_auc': float,
            'precision': float,
            'recall': float,
            'f1_score': float
        },
        'best_params': {
            # Optimized hyperparameters
        },
        'feature_names': list,  # If available
        'scaler': preprocessing_scaler,  # If used
        'metadata': {
            'training_date': str,
            'model_type': str,
            'cross_validation': dict
        }
    }
}
```

## Loading Models

### Python Code
```python
import pickle
import os

# Load models
models_path = "models/models_optimized.pkl"
if os.path.exists(models_path):
    with open(models_path, 'rb') as f:
        models = pickle.load(f)
    
    print(f"Loaded {len(models)} toxicity models:")
    for endpoint in models.keys():
        performance = models[endpoint]['performance']
        print(f"  {endpoint}: ROC-AUC = {performance['roc_auc']:.3f}")
else:
    print("Model file not found!")
```

### Using with MediTox AI
```python
from meditox_ai_module import MediToxAI

# Models are automatically loaded from models/models_optimized.pkl
analyzer = MediToxAI()

# Or specify custom path
analyzer = MediToxAI(models_path="custom/path/models.pkl")
```

## Model Performance

Based on cross-validation with scaffold splitting:

| Endpoint | ROC-AUC | Precision | Recall | F1-Score |
|----------|---------|-----------|--------|----------|
| NR-AR | 0.823 | 0.756 | 0.642 | 0.694 |
| NR-AR-LBD | 0.798 | 0.734 | 0.651 | 0.690 |
| NR-AhR | 0.801 | 0.721 | 0.669 | 0.694 |
| NR-Aromatase | 0.785 | 0.708 | 0.633 | 0.668 |
| NR-ER | 0.789 | 0.712 | 0.657 | 0.683 |

**Average Performance**: ROC-AUC = 0.799

## Model Requirements

### System Requirements
- **Memory**: Minimum 2GB RAM for model loading
- **Storage**: 100MB free space
- **Python**: 3.7+ with scikit-learn

### Dependencies
```bash
pip install scikit-learn>=1.0.0
pip install numpy>=1.21.0
pip install pandas>=1.3.0
pip install joblib>=1.1.0
```

## Feature Engineering

Models expect molecular features generated from SMILES structures:
- **Molecular Descriptors**: RDKit-based descriptors
- **Fingerprints**: Morgan fingerprints (radius=2, nbits=2048)
- **Physicochemical Properties**: MW, LogP, TPSA, etc.
- **Preprocessing**: StandardScaler normalization

### Example Feature Generation
```python
from rdkit import Chem
from rdkit.Chem import Descriptors, rdMolDescriptors
import numpy as np

def generate_features(smiles):
    """Generate molecular features from SMILES"""
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return None
    
    # Calculate descriptors
    features = []
    features.append(Descriptors.MolWt(mol))
    features.append(Descriptors.MolLogP(mol))
    features.append(Descriptors.TPSA(mol))
    # ... add more descriptors
    
    # Generate fingerprints
    fp = rdMolDescriptors.GetMorganFingerprintAsBitVect(mol, 2, nBits=2048)
    features.extend(list(fp))
    
    return np.array(features)
```

## Model Updates

### Retraining Models
To retrain models with new data:

1. **Prepare Data**: Ensure data follows Tox21 format
2. **Feature Engineering**: Generate consistent molecular features
3. **Model Training**: Use same hyperparameters or re-optimize
4. **Validation**: Perform cross-validation with scaffold splitting
5. **Serialization**: Save as pickle file

### Version Control
- Model versions tracked in `model_info.json`
- Backward compatibility maintained
- Performance benchmarks stored

## Troubleshooting

### Common Issues

1. **Model Loading Error**
   ```python
   # Check file existence and permissions
   import os
   if not os.path.exists("models/models_optimized.pkl"):
       print("Model file missing!")
   ```

2. **Memory Issues**
   ```python
   # Load models one at a time if memory constrained
   import pickle
   with open("models/models_optimized.pkl", 'rb') as f:
       models = pickle.load(f)
   # Use only required endpoints
   required_models = {k: v for k, v in models.items() if k in ['NR-AR', 'NR-ER']}
   ```

3. **Version Compatibility**
   ```python
   # Check scikit-learn version
   import sklearn
   print(f"scikit-learn version: {sklearn.__version__}")
   # Models trained with sklearn 1.0+
   ```

## Model Licensing

- **License**: MIT License (same as MediTox AI)
- **Usage**: Free for research and commercial use
- **Attribution**: Please cite original Tox21 dataset
- **Modifications**: Allowed with proper documentation

## Contact & Support

For model-specific issues:
- Check model performance metrics
- Verify feature engineering pipeline
- Ensure compatible dependencies
- Review training methodology

---

**Note**: Models are trained for research purposes. Always validate predictions with domain experts for critical applications.

*Last Updated: October 2025*