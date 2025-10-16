# MediTox AI - Medicine Toxicity Analysis# DrugTox-AI Simple



A complete medicine toxicity analysis tool that can analyze medicine images or chemical names to predict toxicity across nuclear receptor pathways.Molecular toxicity prediction using machine learning.



## Quick Start## Quick Start



1. **Install dependencies:**1. Install dependencies:

   ```bash

   pip install -r requirements.txt   ```bash

   ```   pip install -r requirements.txt

   ```

2. **Run demo:**

   ```bash2. Run demo:

   python run_meditox_demo.py

   ```   ```bash

   python demo.py

3. **Use in your project:**   ```

   ```python

   from meditox_feature import analyze_chemical3. Make predictions:

   result = analyze_chemical("paracetamol")

   print(f"Safety Score: {result['analysis']['paracetamol']['safety_score']}%")   ```bash

   ```   python predict.py

   ```

## Features

## Models

- 🏥 Analyze medicine images with OCR

- 💊 Analyze chemicals by name- `models/models_optimized.pkl`: Optimized models (5 endpoints) - NR-AR-LBD, NR-AhR, SR-MMP, NR-ER-LBD, NR-AR

- 🧬 5 toxicity endpoints (Nuclear Receptors)

- 📊 Percentage-based results## Scripts

- ⚡ Works with minimal dependencies

- `predict.py`: Full toxicity predictions (requires RDKit)

## Integration- `demo.py`: Simple demo without dependencies

- `test_molecules.py`: Test custom molecules

```python- `test_new.py`: Test new molecules

from meditox_feature import MediToxAI

## Performance

# Initialize

analyzer = MediToxAI()- Average ROC-AUC: ~0.79 across endpoints

- Best: NR-AR-LBD (0.839 ROC-AUC)

# Analyze chemical- Models: Random Forest, XGBoost, Logistic Regression

result = analyzer.analyze_medicine("ibuprofen")

## Requirements

# Analyze image

result = analyzer.analyze_medicine("medicine_photo.jpg")- Python 3.7+

- RDKit (for full predictions)

# Generate report- scikit-learn, pandas, numpy
report = analyzer.generate_report(result, format='text')
```

## Files

- `meditox_feature.py` - Main module
- `run_meditox_demo.py` - Demo script  
- `models/models_optimized.pkl` - ML models
- `requirements.txt` - Dependencies

Ready to integrate into any Python project!