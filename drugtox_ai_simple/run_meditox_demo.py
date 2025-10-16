#!/usr/bin/env python3
"""
MediTox AI Demo Script
Shows how to use the MediTox feature in your project
"""

from meditox_feature import MediToxAI, analyze_chemical, get_safety_report
import json

def demo_chemical_analysis():
    """Demo: Analyze a chemical by name"""
    print("🧪 DEMO: Chemical Analysis")
    print("="*40)
    
    chemical = "paracetamol"
    results = analyze_chemical(chemical)
    
    print(f"Chemical: {chemical}")
    safety_score = results['analysis'][chemical]['safety_score']
    print(f"Safety Score: {safety_score}%")
    
    predictions = results['analysis'][chemical]['toxicity_predictions']
    print("\nToxicity Predictions:")
    for endpoint, data in predictions.items():
        print(f"  {endpoint}: {data['percentage']}% ({data['risk_level']})")

def demo_image_analysis():
    """Demo: Analyze medicine image (if available)"""
    print("\n💊 DEMO: Image Analysis")
    print("="*40)
    
    # Check for sample images
    import os
    image_files = [f for f in os.listdir('.') if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    
    if image_files:
        image_path = image_files[0]
        analyzer = MediToxAI()
        results = analyzer.analyze_medicine(image_path)
        print(f"Analyzed image: {image_path}")
        print(f"Chemicals found: {results['chemicals_found']}")
    else:
        print("No image files found - using mock analysis")
        analyzer = MediToxAI()
        # Mock image analysis
        mock_results = {
            'input_type': 'image',
            'image_path': 'demo_image.jpg',
            'chemicals_found': 1,
            'analysis': {
                'paracetamol': {
                    'chemical_info': {'name': 'Paracetamol', 'use': 'Pain relief'},
                    'toxicity_predictions': analyzer.predict_toxicity('CC(=O)NC1=CC=C(C=C1)O'),
                    'safety_score': 75.0
                }
            }
        }
        print("Mock image analysis completed")
        print(f"Safety Score: {mock_results['analysis']['paracetamol']['safety_score']}%")

def demo_integration():
    """Demo: How to integrate in your project"""
    print("\n🔗 DEMO: Project Integration")
    print("="*40)
    
    # Example 1: Quick analysis
    report = get_safety_report("ibuprofen", format='text')
    print("Quick Safety Report:")
    print(report[:200] + "...")
    
    # Example 2: Custom analyzer
    analyzer = MediToxAI()
    results = analyzer.analyze_medicine("aspirin")
    
    print(f"\nCustom Analysis:")
    print(f"Chemical analyzed: aspirin")
    print(f"Safety score: {results['analysis']['aspirin']['safety_score']}%")

if __name__ == "__main__":
    print("🏥 MediTox AI Feature Demo")
    print("="*50)
    
    demo_chemical_analysis()
    demo_image_analysis()
    demo_integration()
    
    print("\n✅ Demo completed!")
    print("Ready to integrate MediTox AI into your project!")