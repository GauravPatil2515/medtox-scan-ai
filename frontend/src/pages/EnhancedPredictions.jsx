import React, { useState } from 'react';
import {
  BeakerIcon,
  DocumentTextIcon,
  PlayIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  EyeIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  ClockIcon as HistoryIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import { MolecularSearch, usePredictionHistory, useExport } from '../components/EnhancedMolecularTools';
import MolecularVisualization from '../components/MolecularVisualization';
import { useNotifications, usePredictionNotifications } from '../components/NotificationSystem';
import AIChat from '../components/AIChat';
import ImageAnalysis from '../components/ImageAnalysis';

const EnhancedPredictions = () => {
  const [inputType, setInputType] = useState('smiles');
  const [inputValue, setInputValue] = useState('');
  const [selectedMoleculeName, setSelectedMoleculeName] = useState('');
  const [selectedEndpoints, setSelectedEndpoints] = useState(['NR-AR-LBD']);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showMolecularSearch, setShowMolecularSearch] = useState(true);
  const [showAIChat, setShowAIChat] = useState(false);
  
  // Enhanced hooks
  const { history, addPrediction, clearHistory } = usePredictionHistory();
  const { exportToCSV, exportToJSON } = useExport();
  const { notifyPredictionStart, notifyPredictionSuccess, notifyPredictionError } = usePredictionNotifications();

  const endpoints = [
    {
      id: 'NR-AR-LBD',
      name: 'Androgen Receptor LBD',
      description: 'Androgen receptor ligand binding domain',
      icon: '🔴',
      color: 'danger',
      auc: 0.839
    },
    {
      id: 'NR-AhR',
      name: 'Aryl Hydrocarbon Receptor',
      description: 'Xenobiotic metabolism pathway',
      icon: '🔬',
      color: 'warning',
      auc: 0.834
    },
    {
      id: 'SR-MMP',
      name: 'Mitochondrial Membrane Potential',
      description: 'Mitochondrial toxicity assessment',
      icon: '⚡',
      color: 'info',
      auc: 0.808
    },
    {
      id: 'NR-ER-LBD',
      name: 'Estrogen Receptor LBD',
      description: 'Estrogen receptor ligand binding domain',
      icon: '♀️',
      color: 'primary',
      auc: 0.776
    },
    {
      id: 'NR-AR',
      name: 'Androgen Receptor',
      description: 'Androgen receptor activity',
      icon: '♂️',
      color: 'success',
      auc: 0.752
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsLoading(true);
    setResults(null);
    
    // Notify prediction start
    notifyPredictionStart(inputValue);

    try {
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          smiles: inputValue,
          endpoints: selectedEndpoints
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setResults(data);
      
      // Add to history
      addPrediction({
        molecule: data.molecule || selectedMoleculeName || inputValue,
        smiles: inputValue,
        overall_toxicity: data.overall_toxicity,
        confidence: data.confidence,
        toxic_endpoints: data.toxic_endpoints,
        predictions: data.predictions
      });

      // Notify success
      notifyPredictionSuccess(data);

    } catch (error) {
      console.error('Prediction error:', error);
      notifyPredictionError(error);
      setResults({
        error: error.message,
        molecule: inputValue
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoleculeSelect = (smiles, name = '') => {
    setInputValue(smiles);
    setSelectedMoleculeName(name);
    setResults(null);
  };

  const handleHistoryRerun = (smiles) => {
    setInputValue(smiles);
    setResults(null);
  };

  const handleExportHistory = (format) => {
    if (history.length === 0) return;
    
    if (format === 'csv') {
      exportToCSV(history, `drugtox_history_${new Date().toISOString().split('T')[0]}.csv`);
    } else {
      exportToJSON(history, `drugtox_history_${new Date().toISOString().split('T')[0]}.json`);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-soft p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <BeakerIcon className="w-8 h-8 text-pink-600" />
              <h1 className="text-2xl font-bold text-gray-900">Enhanced Molecular Toxicity Prediction</h1>
            </div>
            <p className="text-gray-600">
              Predict toxicity endpoints using our comprehensive molecular database and AI models.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAIChat(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4" />
              <span>AI Chat</span>
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <HistoryIcon className="h-4 w-4" />
              <span>History ({history.length})</span>
            </button>
            {history.length > 0 && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleExportHistory('csv')}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={() => handleExportHistory('json')}
                  className="flex items-center space-x-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  <span>JSON</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Input Method Selection Tabs */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Input Method</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => setInputType('smiles')}
                className={clsx(
                  'p-4 rounded-lg border-2 transition-all duration-200 text-center',
                  inputType === 'smiles'
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                )}
              >
                <DocumentTextIcon className="w-6 h-6 mb-2 mx-auto" />
                <div className="font-medium">SMILES Input</div>
                <div className="text-xs opacity-70 mt-1">Enter molecular notation</div>
              </button>
              <button
                onClick={() => setInputType('image')}
                className={clsx(
                  'p-4 rounded-lg border-2 transition-all duration-200 text-center',
                  inputType === 'image'
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                )}
              >
                <PhotoIcon className="w-6 h-6 mb-2 mx-auto" />
                <div className="font-medium">Image Analysis</div>
                <div className="text-xs opacity-70 mt-1">Upload image with OCR</div>
              </button>
              <button
                onClick={() => setInputType('database')}
                className={clsx(
                  'p-4 rounded-lg border-2 transition-all duration-200 text-center',
                  inputType === 'database'
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                )}
              >
                <BeakerIcon className="w-6 h-6 mb-2 mx-auto" />
                <div className="font-medium">Database Search</div>
                <div className="text-xs opacity-70 mt-1">Browse 40+ molecules</div>
              </button>
            </div>
          </div>

          {/* Image Analysis Section */}
          {inputType === 'image' && (
            <ImageAnalysis />
          )}

          {/* Molecular Search Database */}
          {inputType === 'database' && showMolecularSearch && (
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Molecular Database Search</h2>
                <button
                  onClick={() => setShowMolecularSearch(false)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Hide Search
                </button>
              </div>
              <MolecularSearch 
                onSelect={handleMoleculeSelect}
                currentSmiles={inputValue}
              />
            </div>
          )}

          {/* SMILES Input & Visualization */}
          {inputType === 'smiles' && (
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">SMILES Input & Molecular Structure</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">SMILES Input</label>
                    {!showMolecularSearch && (
                      <button
                        type="button"
                        onClick={() => setShowMolecularSearch(true)}
                        className="text-sm text-pink-600 hover:text-pink-700"
                      >
                        Show Database Search
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="relative">
                      <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter SMILES notation (e.g., CCO for ethanol)..."
                        className="w-full h-24 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none font-mono text-sm"
                        required
                      />
                      {inputValue && (
                        <div className="absolute top-2 right-2">
                          <div className="flex items-center space-x-1 bg-white px-2 py-1 rounded border text-xs">
                            <EyeIcon className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600">{inputValue.length} chars</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {selectedMoleculeName && (
                      <div className="text-sm text-pink-600 bg-pink-50 px-3 py-2 rounded-lg">
                        Selected: {selectedMoleculeName}
                      </div>
                    )}
                  </div>

                  {/* Quick Examples */}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-gray-500">Quick examples:</span>
                    {[
                      { name: 'Ethanol', smiles: 'CCO' },
                      { name: 'Aspirin', smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O' },
                      { name: 'Caffeine', smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C' }
                    ].map((example) => (
                      <button
                        key={example.smiles}
                        type="button"
                        onClick={() => handleMoleculeSelect(example.smiles, example.name)}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors duration-200"
                      >
                        {example.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Molecular Visualization */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-700">Molecular Structure</label>
                  {inputValue ? (
                    <MolecularVisualization smiles={inputValue} width={280} height={200} />
                  ) : (
                    <div className="w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BeakerIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Enter SMILES to see structure</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Endpoint Selection */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700">Toxicity Endpoints</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {endpoints.map((endpoint) => (
                    <label
                      key={endpoint.id}
                      className={clsx(
                        'relative flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200',
                        selectedEndpoints.includes(endpoint.id)
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={selectedEndpoints.includes(endpoint.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEndpoints([...selectedEndpoints, endpoint.id]);
                          } else {
                            setSelectedEndpoints(selectedEndpoints.filter(id => id !== endpoint.id));
                          }
                        }}
                        className="sr-only"
                      />
                      <div className="flex items-center space-x-3 flex-1">
                        <span className="text-lg">{endpoint.icon}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{endpoint.name}</div>
                          <div className="text-xs text-gray-500">ROC-AUC: {endpoint.auc}</div>
                        </div>
                      </div>
                      {selectedEndpoints.includes(endpoint.id) && (
                        <CheckCircleIcon className="h-5 w-5 text-pink-500" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!inputValue.trim() || selectedEndpoints.length === 0 || isLoading}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <ClockIcon className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <PlayIcon className="w-5 h-5" />
                    <span>Predict Toxicity</span>
                  </>
                )}
              </button>
            </form>
          </div>
          )}

          {/* Results Section */}
          {inputType === 'smiles' && results && (
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Prediction Results</h2>
              
              {results.error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                    <span className="font-medium text-red-800">Prediction Failed</span>
                  </div>
                  <p className="text-red-700 mt-2">{results.error}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Molecule Info */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm font-medium text-gray-700">Molecule</div>
                    <div className="font-mono text-sm text-gray-900 mt-1 break-all">
                      {results.molecule}
                    </div>
                  </div>

                  {/* Overall Summary */}
                  {results.overall_toxicity && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="text-sm font-medium text-blue-900 mb-2">Overall Assessment</div>
                      <div className="text-lg font-bold text-blue-800">{results.overall_toxicity}</div>
                      {results.toxic_endpoints && (
                        <div className="text-sm text-blue-700 mt-1">
                          Toxic endpoints: {results.toxic_endpoints}
                        </div>
                      )}
                      {results.confidence && (
                        <div className="text-sm text-blue-700">
                          Recommendation: {results.confidence}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Endpoint Results */}
                  {Object.entries(results.predictions || {}).map(([endpoint, data]) => {
                    const endpointInfo = endpoints.find(e => e.id === endpoint);
                    return (
                      <div key={endpoint} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{endpointInfo?.icon || '🧪'}</span>
                            <div>
                              <span className="font-medium text-gray-900">{endpointInfo?.name || endpoint}</span>
                              {endpointInfo?.auc && (
                                <div className="text-xs text-gray-500">ROC-AUC: {endpointInfo.auc}</div>
                              )}
                            </div>
                          </div>
                          <span className={clsx(
                            'px-3 py-1 rounded-full text-sm font-medium border',
                            getRiskColor(data.risk)
                          )}>
                            {data.prediction || data.risk}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600">Probability:</span>
                            <div className="font-semibold text-gray-900">
                              {((data.probability || 0) * 100).toFixed(1)}%
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Confidence:</span>
                            <div className="font-semibold text-gray-900">
                              {data.confidence || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* AI Analysis */}
                  {results.ai_analysis && (
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4 mt-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <SparklesIcon className="w-5 h-5 text-purple-600" />
                        <h3 className="font-medium text-purple-900">AI Analysis</h3>
                      </div>
                      <p className="text-sm text-purple-800 leading-relaxed whitespace-pre-wrap">
                        {results.ai_analysis}
                      </p>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mt-4">
                    Generated on {results.timestamp || new Date().toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Prediction History */}
          {showHistory && (
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Predictions</h3>
                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="text-sm text-red-600 hover:text-red-700 flex items-center space-x-1"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
              
              {history.length === 0 ? (
                <p className="text-sm text-gray-500">No predictions yet</p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {history.slice(0, 10).map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {item.molecule}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {item.overall_toxicity}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          onClick={() => handleHistoryRerun(item.smiles)}
                          className="ml-2 p-1 text-pink-600 hover:text-pink-700"
                        >
                          <PlayIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Help Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <InformationCircleIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Enhanced Features</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 40+ molecule database search</li>
                  <li>• Real-time molecular visualization</li>
                  <li>• Prediction history tracking</li>
                  <li>• Export results (CSV/JSON)</li>
                  <li>• AI-powered suggestions</li>
                </ul>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-500 mt-3">
                  Learn more about features →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Modal */}
      <AIChat isOpen={showAIChat} onClose={() => setShowAIChat(false)} />
    </div>
  );
};

export default EnhancedPredictions;