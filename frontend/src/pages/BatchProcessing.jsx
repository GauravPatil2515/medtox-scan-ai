import React, { useState } from 'react';
import {
  DocumentDuplicateIcon,
  CloudArrowUpIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  DocumentArrowDownIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

const BatchProcessing = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [processingStatus, setProcessingStatus] = useState('idle'); // idle, running, paused, completed, error
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [downloadStatus, setDownloadStatus] = useState('idle'); // idle, downloading, completed, error
  const [analyticsStatus, setAnalyticsStatus] = useState('idle'); // idle, loading, completed, error

  const [jobQueue] = useState([
    {
      id: 1,
      filename: 'pharmaceutical_compounds.csv',
      molecules: 1250,
      status: 'completed',
      progress: 100,
      startTime: '2024-01-15 09:30:00',
      endTime: '2024-01-15 09:45:00',
      results: { successful: 1240, failed: 10 }
    },
    {
      id: 2,
      filename: 'natural_products.sdf',
      molecules: 850,
      status: 'running',
      progress: 68,
      startTime: '2024-01-15 10:15:00',
      endTime: null,
      results: null
    },
    {
      id: 3,
      filename: 'synthetic_molecules.csv',
      molecules: 2100,
      status: 'queued',
      progress: 0,
      startTime: null,
      endTime: null,
      results: null
    }
  ]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleStartProcessing = () => {
    if (!uploadedFile) return;
    
    setProcessingStatus('running');
    setProgress(0);
    
    // Simulate processing
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setProcessingStatus('completed');
          setResults({
            totalMolecules: 150,
            successful: 147,
            failed: 3,
            processingTime: '2m 15s',
            averageTime: '0.9s per molecule'
          });
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 500);
  };

  const handleDownloadResults = async () => {
    if (!results) {
      alert('No results available to download. Please complete a batch processing job first.');
      return;
    }

    setDownloadStatus('downloading');
    
    try {
      // Download CSV file with results
      const downloadUrl = 'http://localhost:5000/api/download/results?format=csv&limit=1000';
      
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/csv',
        },
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }

      // Get the blob and create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `toxicity_results_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setDownloadStatus('completed');
      console.log('✅ Results downloaded successfully');
      
      // Reset status after 2 seconds
      setTimeout(() => setDownloadStatus('idle'), 2000);
      
    } catch (error) {
      console.error('❌ Download failed:', error);
      setDownloadStatus('error');
      alert(`Failed to download results: ${error.message}`);
      
      // Reset status after 3 seconds
      setTimeout(() => setDownloadStatus('idle'), 3000);
    }
  };

  const handleViewAnalytics = async () => {
    setAnalyticsStatus('loading');
    
    try {
      // Test if analytics endpoint is available
      const response = await fetch('http://localhost:5000/api/analytics', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Analytics unavailable: ${response.status} ${response.statusText}`);
      }

      // Navigate to analytics view or open in new tab
      window.open('/dashboard', '_blank');
      setAnalyticsStatus('completed');
      console.log('✅ Opening analytics dashboard...');
      
      // Reset status after 2 seconds
      setTimeout(() => setAnalyticsStatus('idle'), 2000);
      
    } catch (error) {
      console.error('❌ Failed to open analytics:', error);
      setAnalyticsStatus('error');
      alert(`Failed to open analytics: ${error.message}. Make sure the backend server is running.`);
      
      // Reset status after 3 seconds
      setTimeout(() => setAnalyticsStatus('idle'), 3000);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-success-600" />;
      case 'running':
        return <ClockIcon className="w-5 h-5 text-warning-600 animate-spin" />;
      case 'paused':
        return <PauseIcon className="w-5 h-5 text-gray-600" />;
      case 'error':
        return <ExclamationCircleIcon className="w-5 h-5 text-danger-600" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success-100 text-success-800';
      case 'running':
        return 'bg-warning-100 text-warning-800';
      case 'paused':
        return 'bg-gray-100 text-gray-800';
      case 'error':
        return 'bg-danger-100 text-danger-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-soft p-6">
        <div className="flex items-center space-x-3 mb-2">
          <DocumentDuplicateIcon className="w-8 h-8 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">Batch Processing</h1>
        </div>
        <p className="text-gray-600">
          Process multiple molecules simultaneously for high-throughput toxicity screening.
          Upload CSV, SDF, or MOL files containing molecular structures.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload and Control Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* File Upload */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Dataset</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              
              {uploadedFile ? (
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => setUploadedFile(null)}
                        className="text-danger-600 hover:text-danger-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">File ready for processing</p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2">Drop your files here or click to browse</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Supports CSV, SDF, MOL files up to 100MB
                  </p>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".csv,.sdf,.mol"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer transition-colors duration-200"
                  >
                    Choose Files
                  </label>
                </div>
              )}
            </div>

            {/* File Format Examples */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">CSV Format</h4>
                <pre className="text-xs text-gray-600 font-mono">
{`smiles,name
CCO,Ethanol
C1=CC=CC=C1,Benzene`}
                </pre>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">SDF Format</h4>
                <p className="text-xs text-gray-600">
                  Standard molecular structure format with 3D coordinates and properties
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">MOL Format</h4>
                <p className="text-xs text-gray-600">
                  Individual molecule files with structure information
                </p>
              </div>
            </div>
          </div>

          {/* Processing Controls */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Processing Controls</h2>
            
            <div className="space-y-4">
              {/* Progress Bar */}
              {processingStatus !== 'idle' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">Progress</span>
                    <span className="text-gray-600">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Control Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleStartProcessing}
                  disabled={!uploadedFile || processingStatus === 'running'}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
                >
                  <PlayIcon className="w-4 h-4" />
                  <span>Start Processing</span>
                </button>
                
                {processingStatus === 'running' && (
                  <button
                    onClick={() => setProcessingStatus('paused')}
                    className="flex items-center space-x-2 px-4 py-2 bg-warning-600 hover:bg-warning-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <PauseIcon className="w-4 h-4" />
                    <span>Pause</span>
                  </button>
                )}
                
                {processingStatus !== 'idle' && (
                  <button
                    onClick={() => {
                      setProcessingStatus('idle');
                      setProgress(0);
                      setResults(null);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-danger-600 hover:bg-danger-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <StopIcon className="w-4 h-4" />
                    <span>Stop</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results Summary */}
          {results && (
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Processing Results</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{results.totalMolecules}</div>
                  <div className="text-sm text-gray-600">Total Molecules</div>
                </div>
                <div className="bg-success-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-success-600">{results.successful}</div>
                  <div className="text-sm text-success-600">Successful</div>
                </div>
                <div className="bg-danger-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-danger-600">{results.failed}</div>
                  <div className="text-sm text-danger-600">Failed</div>
                </div>
                <div className="bg-primary-50 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-primary-600">{results.processingTime}</div>
                  <div className="text-sm text-primary-600">Total Time</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={handleDownloadResults}
                  disabled={downloadStatus === 'downloading'}
                  className={clsx(
                    'flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200',
                    downloadStatus === 'downloading' 
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : downloadStatus === 'completed'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : downloadStatus === 'error'
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-primary-600 hover:bg-primary-700 text-white'
                  )}
                >
                  {downloadStatus === 'downloading' ? (
                    <ClockIcon className="w-4 h-4 animate-spin" />
                  ) : downloadStatus === 'completed' ? (
                    <CheckCircleIcon className="w-4 h-4" />
                  ) : downloadStatus === 'error' ? (
                    <ExclamationCircleIcon className="w-4 h-4" />
                  ) : (
                    <DocumentArrowDownIcon className="w-4 h-4" />
                  )}
                  <span>
                    {downloadStatus === 'downloading' ? 'Downloading...' 
                     : downloadStatus === 'completed' ? 'Downloaded!' 
                     : downloadStatus === 'error' ? 'Failed' 
                     : 'Download Results'}
                  </span>
                </button>
                <button 
                  onClick={handleViewAnalytics}
                  disabled={analyticsStatus === 'loading'}
                  className={clsx(
                    'flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200',
                    analyticsStatus === 'loading' 
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : analyticsStatus === 'completed'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : analyticsStatus === 'error'
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-600 hover:bg-gray-700 text-white'
                  )}
                >
                  {analyticsStatus === 'loading' ? (
                    <ClockIcon className="w-4 h-4 animate-spin" />
                  ) : analyticsStatus === 'completed' ? (
                    <CheckCircleIcon className="w-4 h-4" />
                  ) : analyticsStatus === 'error' ? (
                    <ExclamationCircleIcon className="w-4 h-4" />
                  ) : (
                    <ChartBarIcon className="w-4 h-4" />
                  )}
                  <span>
                    {analyticsStatus === 'loading' ? 'Loading...' 
                     : analyticsStatus === 'completed' ? 'Opened!' 
                     : analyticsStatus === 'error' ? 'Failed' 
                     : 'View Analytics'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Job Status */}
          {processingStatus !== 'idle' && (
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Job</h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Status</span>
                  <span className={clsx(
                    'px-2 py-1 rounded-full text-xs font-medium capitalize',
                    getStatusColor(processingStatus)
                  )}>
                    {processingStatus}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">File</span>
                  <span className="text-sm text-gray-600">{uploadedFile?.name || 'N/A'}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Job Queue */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Queue</h2>
            
            <div className="space-y-3">
              {jobQueue.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 text-sm truncate">
                      {job.filename}
                    </span>
                    {getStatusIcon(job.status)}
                  </div>
                  
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Molecules: {job.molecules.toLocaleString()}</div>
                    <div className={clsx(
                      'inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                      getStatusColor(job.status)
                    )}>
                      {job.status}
                    </div>
                  </div>
                  
                  {job.status === 'running' && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-warning-600 h-1 rounded-full"
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {job.results && (
                    <div className="mt-2 text-xs text-gray-600">
                      Success: {job.results.successful} / Failed: {job.results.failed}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Normal Behavior Guide */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="font-medium text-green-900 mb-3">Normal Batch Processing Flow</h3>
            <div className="text-sm text-green-700 space-y-2">
              <div className="font-medium">📁 Step 1: File Upload</div>
              <div className="ml-4">• Upload CSV/SDF files with SMILES strings</div>
              <div className="ml-4">• System validates file format and content</div>
              
              <div className="font-medium mt-3">⚡ Step 2: Processing</div>
              <div className="ml-4">• Molecules processed through 5 toxicity endpoints</div>
              <div className="ml-4">• Real-time progress updates</div>
              <div className="ml-4">• Automatic retry for failed molecules</div>
              
              <div className="font-medium mt-3">📊 Step 3: Results</div>
              <div className="ml-4">• <strong>Download Results:</strong> Export as CSV/JSON</div>
              <div className="ml-4">• <strong>View Analytics:</strong> Open dashboard with charts</div>
              <div className="ml-4">• Results stored in database permanently</div>
            </div>
          </div>

          {/* Processing Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-medium text-blue-900 mb-3">Processing Tips</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Ensure SMILES strings are valid</li>
              <li>• Large files are processed in chunks</li>
              <li>• Results are saved automatically</li>
              <li>• Processing can be paused/resumed</li>
              <li>• Check queue status regularly</li>
            </ul>
          </div>

          {/* Button Status Guide */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="font-medium text-yellow-900 mb-3">Button Functions</h3>
            <div className="text-sm text-yellow-700 space-y-2">
              <div className="flex items-center space-x-2">
                <DocumentArrowDownIcon className="w-4 h-4" />
                <span><strong>Download Results:</strong></span>
              </div>
              <div className="ml-6">• Downloads processed results as CSV file</div>
              <div className="ml-6">• Includes all 5 toxicity endpoint predictions</div>
              <div className="ml-6">• Shows SMILES, predictions, probabilities</div>
              
              <div className="flex items-center space-x-2 mt-3">
                <ChartBarIcon className="w-4 h-4" />
                <span><strong>View Analytics:</strong></span>
              </div>
              <div className="ml-6">• Opens dashboard with detailed charts</div>
              <div className="ml-6">• Shows endpoint performance statistics</div>
              <div className="ml-6">• Displays recent activity and trends</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchProcessing;