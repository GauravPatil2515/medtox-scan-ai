import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { createWorker } from 'tesseract.js';
import {
  PhotoIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
  BeakerIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const ImageAnalysis = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [extractedSmiles, setExtractedSmiles] = useState(''); // Store actual SMILES separately
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('upload'); // upload, ocr, predict, result

  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setExtractedText('');
      setPredictionResult(null);
      setError(null);
      setStep('ocr');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp']
    },
    multiple: false
  });

  // OCR Processing with AI Analysis (Dual approach: Vision API + OCR)
  const performOCR = async () => {
    if (!image || !imagePreview) {
      setError('Please upload an image first');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setExtractedText('');
    setOcrProgress(0);

    let worker = null;

    try {
      setOcrProgress(10);
      
      console.log('Starting AI Vision + OCR analysis...');
      
      // Method 1: Try Groq Vision API first (best accuracy for chemical structures)
      let visionResult = null;
      try {
        setOcrProgress(15);
        
        // Convert image to base64
        const base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(image);
        });
        
        setOcrProgress(25);
        
        // Call Groq Vision API
        console.log('Calling Groq Vision API for direct image analysis...');
        const visionResponse = await fetch('http://localhost:5000/api/analyze-image-vision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            image_base64: base64Image,
            image_name: image.name 
          })
        });
        
        if (visionResponse.ok) {
          visionResult = await visionResponse.json();
          console.log('✅ Vision API successful:', visionResult);
          setOcrProgress(60);
        } else {
          console.log('⚠️ Vision API not available, falling back to OCR');
        }
      } catch (visionError) {
        console.log('Vision API failed, using OCR fallback:', visionError);
      }
      
      // Method 2: Traditional OCR with Tesseract (always run as backup/supplement)
      let ocrText = '';
      if (!visionResult || visionResult.confidence === 'low') {
        setOcrProgress(visionResult ? 65 : 30);
        
        console.log('Running OCR extraction...');
        
        // Convert blob URL to image element
        const img = new Image();
        img.src = imagePreview;
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        
        setOcrProgress(visionResult ? 70 : 40);
        
        // Create Tesseract worker (v6 API - correct usage)
        console.log('Creating Tesseract worker...');
        worker = await createWorker('eng');
        
        setOcrProgress(visionResult ? 75 : 50);
        
        // Perform OCR - use the blob URL directly or file
        console.log('Recognizing text from image...');
        try {
          const { data: { text } } = await worker.recognize(image);
          ocrText = text.trim();
          console.log('OCR Complete, text extracted:', ocrText.substring(0, 100));
        } catch (recognizeError) {
          console.log('Recognition error, trying with preview URL:', recognizeError);
          // Fallback to preview URL if file doesn't work
          const { data: { text } } = await worker.recognize(imagePreview);
          ocrText = text.trim();
        }
        
        await worker.terminate();
        worker = null;
        
        setOcrProgress(visionResult ? 85 : 75);
      }
      
      // Method 3: AI Analysis of OCR text (if we have OCR text and no vision result)
      let textAnalysisResult = null;
      if (ocrText && !visionResult) {
        console.log('Analyzing OCR text with AI...');
        const textAnalysisResponse = await fetch('http://localhost:5000/api/analyze-image-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            text: ocrText,
            image_name: image.name 
          })
        });

        if (textAnalysisResponse.ok) {
          textAnalysisResult = await textAnalysisResponse.json();
          console.log('✅ Text analysis successful:', textAnalysisResult);
        }
        setOcrProgress(85);
      }
      
      // Combine results from all methods
      const finalResult = visionResult || textAnalysisResult || {
        ingredients: [],
        smiles: [],
        formulas: [],
        insights: ocrText || 'No text detected',
        confidence: 'low'
      };
      
      const ingredients = finalResult.ingredients || [];
      const smilesStrings = finalResult.smiles || [];
      const formulas = finalResult.formulas || [];
      const primaryIngredient = finalResult.primary_ingredient || '';
      const quantities = finalResult.quantities || [];
      
      // Store the first valid SMILES if found
      if (smilesStrings.length > 0) {
        setExtractedSmiles(smilesStrings[0]);
      }
      
      // Build comprehensive result display
      const resultText = `
🔬 AI-Powered Analysis Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Analysis Method: ${visionResult ? '🎯 Groq Vision API (Best)' : '📝 OCR + AI Analysis'}
✨ Confidence: ${finalResult.confidence?.toUpperCase()}

${primaryIngredient ? `💊 PRIMARY INGREDIENT: ${primaryIngredient}\n\n` : ''}${ocrText ? `📝 Raw Text (excerpt):\n${ocrText.substring(0, 200)}...\n\n` : ''}
🧪 Identified Ingredients:
${ingredients.length > 0 ? ingredients.map((ing, i) => `${i + 1}. ${ing}`).join('\n') : 'No specific ingredients identified'}

${quantities && quantities.length > 0 ? `📏 Quantities:\n${quantities.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n\n` : ''}🔬 SMILES Representations:
${smilesStrings.length > 0 ? smilesStrings.map((s, i) => `${i + 1}. ${s}`).join('\n') : 'No SMILES strings extracted'}

${formulas && formulas.length > 0 ? `⚗️ Chemical Formulas:\n${formulas.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\n` : ''}
💡 AI Insights:
${finalResult.insights || 'Analysis complete'}

${smilesStrings.length > 0 ? '\n✅ Ready for toxicity prediction!' : '⚠️ No SMILES found - you can manually enter one below'}
      `.trim();

      setExtractedText(resultText);
      setOcrProgress(100);
      setStep('predict');
      setIsProcessing(false);

    } catch (err) {
      console.error('Analysis Error:', err);
      setError(`Analysis failed: ${err.message || 'Unknown error'}`);
      setIsProcessing(false);
      setOcrProgress(0);
      
      // Cleanup worker if it exists
      if (worker) {
        try {
          await worker.terminate();
        } catch (cleanupErr) {
          console.error('Error cleaning up worker:', cleanupErr);
        }
      }
    }
  };

  // Predict Toxicity
  const predictToxicity = async () => {
    // Use extractedSmiles if available, otherwise try to extract from text
    let smilesString = extractedSmiles || extractedText;
    
    if (!smilesString) {
      setError('No SMILES string available. Please enter one manually.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // If using extractedText and no extractedSmiles, try to extract SMILES
      if (!extractedSmiles && extractedText) {
        const smilesMatch = extractedText.match(/🔬 SMILES Representations:\s*\n\s*\d+\.\s*(.+?)(?:\n|$)/);
        if (smilesMatch && smilesMatch[1]) {
          smilesString = smilesMatch[1].trim();
        }
      }

      console.log('Sending SMILES for prediction:', smilesString);

      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          smiles: smilesString,
          molecule_name: 'Image Analysis'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Prediction failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setPredictionResult(data);
      setStep('result');
      setIsProcessing(false);
    } catch (err) {
      console.error('Prediction Error:', err);
      setError(`Prediction failed: ${err.message}`);
      setIsProcessing(false);
    }
  };

  // Reset to start over
  const reset = () => {
    setImage(null);
    setImagePreview(null);
    setExtractedText('');
    setPredictionResult(null);
    setError(null);
    setStep('upload');
    setOcrProgress(0);
  };

  // Calculate overall toxicity
  const getOverallToxicity = () => {
    if (!predictionResult || !predictionResult.predictions) return null;
    
    const predictions = Object.values(predictionResult.predictions);
    const toxicCount = predictions.filter(p => p.prediction === 'Toxic').length;
    const totalCount = predictions.length;
    
    return {
      percentage: ((toxicCount / totalCount) * 100).toFixed(1),
      toxicCount,
      totalCount,
      isToxic: toxicCount > totalCount / 2
    };
  };

  const overallToxicity = predictionResult ? getOverallToxicity() : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <PhotoIcon className="mx-auto h-12 w-12 text-purple-600" />
        <h2 className="mt-2 text-2xl font-bold text-gray-900">AI Vision + OCR Analysis</h2>
        <p className="mt-1 text-gray-600">
          Upload an image - Powered by Groq Vision API & Advanced OCR
        </p>
        <p className="mt-1 text-sm text-purple-600 font-medium">
          🎯 Best-in-class chemical structure recognition
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4">
        <div className={`flex items-center ${step === 'upload' ? 'text-purple-600' : 'text-gray-400'}`}>
          <ArrowUpTrayIcon className="h-6 w-6" />
          <span className="ml-2 font-medium">Upload</span>
        </div>
        <div className="h-px w-16 bg-gray-300"></div>
        <div className={`flex items-center ${step === 'ocr' || step === 'predict' || step === 'result' ? 'text-purple-600' : 'text-gray-400'}`}>
          <PhotoIcon className="h-6 w-6" />
          <span className="ml-2 font-medium">Extract</span>
        </div>
        <div className="h-px w-16 bg-gray-300"></div>
        <div className={`flex items-center ${step === 'predict' || step === 'result' ? 'text-purple-600' : 'text-gray-400'}`}>
          <BeakerIcon className="h-6 w-6" />
          <span className="ml-2 font-medium">Predict</span>
        </div>
        <div className="h-px w-16 bg-gray-300"></div>
        <div className={`flex items-center ${step === 'result' ? 'text-purple-600' : 'text-gray-400'}`}>
          <CheckCircleIcon className="h-6 w-6" />
          <span className="ml-2 font-medium">Results</span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            <p className="ml-3 text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Upload Area */}
      {step === 'upload' && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-300 hover:border-purple-400 bg-white'
          }`}
        >
          <input {...getInputProps()} />
          <PhotoIcon className="mx-auto h-16 w-16 text-gray-400" />
          <p className="mt-4 text-lg font-medium text-gray-900">
            {isDragActive ? 'Drop the image here' : 'Drag & drop an image, or click to select'}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Supports: PNG, JPG, JPEG, GIF, BMP
          </p>
        </div>
      )}

      {/* Image Preview & OCR */}
      {(step === 'ocr' || step === 'predict' || step === 'result') && imagePreview && (
        <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Uploaded Image</h3>
            <button
              onClick={reset}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Preview */}
            <div>
              <img
                src={imagePreview}
                alt="Uploaded"
                className="w-full h-64 object-contain bg-gray-50 rounded-lg"
              />
            </div>

            {/* Extracted Text */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Extracted SMILES</h4>
              {step === 'ocr' && !extractedText && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 h-32 flex items-center justify-center">
                    {isProcessing ? (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-600">Processing: {ocrProgress}%</p>
                      </div>
                    ) : (
                      <p className="text-gray-500">Click "Extract Text" to begin OCR</p>
                    )}
                  </div>
                  <button
                    onClick={performOCR}
                    disabled={isProcessing}
                    className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                        Analyzing... {ocrProgress}%
                      </>
                    ) : (
                      <>
                        <PhotoIcon className="h-5 w-5 mr-2" />
                        AI Vision Analysis + OCR
                      </>
                    )}
                  </button>
                </div>
              )}

              {extractedText && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Analysis Report
                    </label>
                    <textarea
                      value={extractedText}
                      readOnly
                      className="w-full h-32 p-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                      placeholder="Analysis report will appear here..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMILES String for Prediction
                      {!extractedSmiles && <span className="text-orange-600 ml-2">⚠️ No SMILES found - enter manually</span>}
                    </label>
                    <input
                      type="text"
                      value={extractedSmiles}
                      onChange={(e) => setExtractedSmiles(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                      placeholder="Enter SMILES notation (e.g., CCO for ethanol)"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={performOCR}
                      disabled={isProcessing}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Re-extract
                    </button>
                    {step === 'predict' && (
                      <button
                        onClick={predictToxicity}
                        disabled={isProcessing || !extractedSmiles}
                        className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 flex items-center justify-center"
                      >
                        {isProcessing ? (
                          <>
                            <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                            Predicting...
                          </>
                        ) : (
                          <>
                            <BeakerIcon className="h-5 w-5 mr-2" />
                            Predict Toxicity
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Prediction Results */}
      {step === 'result' && predictionResult && (
        <div className="space-y-6">
          {/* Overall Result */}
          <div className={`rounded-xl shadow-soft border-2 p-6 ${
            overallToxicity.isToxic
              ? 'bg-red-50 border-red-300'
              : 'bg-green-50 border-green-300'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Overall Assessment</h3>
                <p className="mt-1 text-gray-600">
                  {overallToxicity.toxicCount} of {overallToxicity.totalCount} endpoints predict toxicity
                </p>
              </div>
              <div className="text-right">
                <div className={`text-4xl font-bold ${
                  overallToxicity.isToxic ? 'text-red-600' : 'text-green-600'
                }`}>
                  {overallToxicity.percentage}%
                </div>
                <div className={`text-sm font-medium ${
                  overallToxicity.isToxic ? 'text-red-600' : 'text-green-600'
                }`}>
                  {overallToxicity.isToxic ? 'TOXIC' : 'SAFE'}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Endpoint Analysis</h3>
            <div className="space-y-3">
              {Object.entries(predictionResult.predictions).map(([endpoint, data]) => (
                <div
                  key={endpoint}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{endpoint}</div>
                    <div className="text-sm text-gray-600">
                      Probability: {(data.probability * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                    data.prediction === 'Toxic'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {data.prediction}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={reset}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
            >
              Analyze Another Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageAnalysis;
