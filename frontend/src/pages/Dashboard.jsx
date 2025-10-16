import React, { useState, useEffect } from 'react';
import {
  BeakerIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

const Dashboard = () => {
  // State for dynamic data from API
  const [platformStats, setPlatformStats] = useState(null);
  const [recentPredictions, setRecentPredictions] = useState([]);
  const [modelStatus, setModelStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch platform statistics
        const statsResponse = await fetch('http://localhost:5000/api/stats');
        const statsData = await statsResponse.json();
        setPlatformStats(statsData);

        // Fetch recent predictions
        const predictionsResponse = await fetch('http://localhost:5000/api/predictions?recent=true&limit=3');
        const predictionsData = await predictionsResponse.json();
        setRecentPredictions(predictionsData.predictions || []);

        // Fetch model status
        const modelsResponse = await fetch('http://localhost:5000/api/models/status');
        const modelsData = await modelsResponse.json();
        setModelStatus(modelsData.models || []);

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Format stats for display
  const stats = platformStats ? [
    {
      name: 'Total Predictions',
      value: platformStats.total_predictions?.toLocaleString() || '0',
      change: '+12%',
      changeType: 'increase',
      icon: BeakerIcon,
      color: 'primary'
    },
    {
      name: 'Success Rate',
      value: `${platformStats.success_rate || 0}%`,
      change: '+2.1%',
      changeType: 'increase',
      icon: CheckCircleIcon,
      color: 'success'
    },
    {
      name: 'Processing Time',
      value: platformStats.processing_time || '1.4s',
      change: '-0.3s',
      changeType: 'decrease',
      icon: ClockIcon,
      color: 'warning'
    },
    {
      name: 'Active Models',
      value: platformStats.active_models?.toString() || '0',
      change: 'Stable',
      changeType: 'neutral',
      icon: ChartBarIcon,
      color: 'info'
    }
  ] : [];

  const getStatColor = (color) => {
    switch (color) {
      case 'primary':
        return 'bg-primary-500';
      case 'success':
        return 'bg-success-500';
      case 'warning':
        return 'bg-warning-500';
      case 'info':
        return 'bg-info-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return 'bg-success-100 text-success-800';
      case 'medium':
        return 'bg-warning-100 text-warning-800';
      case 'high':
        return 'bg-danger-100 text-danger-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-2">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
            <div>
              <h3 className="font-medium text-red-800">Error Loading Dashboard</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      {!isLoading && !error && (
        <>
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome to MedTox-Scan-AI!</h1>
                <p className="text-primary-100 text-lg">
                  Your molecular toxicity prediction platform is ready. 
                  Monitor predictions, analyze results, and discover insights.
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <BeakerIcon className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 mt-6">
              <button 
                onClick={() => window.location.href = '/app/predictions'}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                <BeakerIcon className="w-4 h-4" />
                <span>New Prediction</span>
              </button>
              <button 
                onClick={() => window.location.href = '/app/analytics'}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                <ChartBarIcon className="w-4 h-4" />
                <span>View Analytics</span>
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white rounded-xl shadow-soft p-6 hover:shadow-luxury transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={clsx('p-3 rounded-lg', getStatColor(stat.color))}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className={clsx('text-sm flex items-center justify-end mt-1', {
                      'text-success-600': stat.changeType === 'increase',
                      'text-danger-600': stat.changeType === 'decrease',
                      'text-gray-600': stat.changeType === 'neutral'
                    })}>
                      {stat.changeType === 'increase' && <ArrowUpIcon className="w-4 h-4 mr-1" />}
                      {stat.changeType === 'decrease' && <ArrowDownIcon className="w-4 h-4 mr-1" />}
                      {stat.change}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-600">{stat.name}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Predictions */}
          <div className="bg-white rounded-xl shadow-soft">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Predictions</h2>
                <button 
                  onClick={() => window.location.href = '/app/predictions'}
                  className="text-primary-600 hover:text-primary-500 text-sm font-medium flex items-center space-x-1"
                >
                  <EyeIcon className="w-4 h-4" />
                  <span>View all</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-hidden">
              {recentPredictions.length === 0 ? (
                <div className="text-center py-12">
                  <BeakerIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No predictions yet</p>
                  <button 
                    onClick={() => window.location.href = '/app/predictions'}
                    className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Make Your First Prediction
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {recentPredictions.map((prediction) => (
                    <div key={prediction.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-lg font-medium text-gray-900">
                              {prediction.molecule_name || prediction.smiles?.substring(0, 20)}
                            </h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                              Completed
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-4 font-mono bg-gray-50 p-2 rounded">
                            SMILES: {prediction.smiles?.substring(0, 50)}{prediction.smiles?.length > 50 ? '...' : ''}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {prediction.endpoints && Object.entries(prediction.endpoints).slice(0, 3).map(([endpoint, data]) => {
                              const probability = typeof data === 'object' ? data.probability : data;
                              const risk = typeof data === 'object' && data.prediction 
                                ? (data.prediction.toLowerCase() === 'toxic' ? 'High' : 'Low')
                                : (probability > 0.5 ? 'High' : 'Low');
                              
                              return (
                                <div key={endpoint} className="bg-gray-50 rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">
                                      {endpoint}
                                    </span>
                                    <span className={clsx('inline-flex items-center px-2 py-1 rounded-full text-xs font-medium', getRiskColor(risk))}>
                                      {risk}
                                    </span>
                                  </div>
                                  <div className="text-lg font-semibold text-gray-900">
                                    {(probability * 100).toFixed(1)}%
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        
                        <div className="ml-6 text-right">
                          <div className="text-sm text-gray-500">
                            {new Date(prediction.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Model Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Models */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Models</h2>
              <div className="space-y-4">
                {modelStatus.length > 0 ? (
                  modelStatus.map((model, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={clsx('w-3 h-3 rounded-full', {
                          'bg-success-500': model.status === 'active',
                          'bg-warning-500': model.status === 'training',
                          'bg-gray-400': model.status !== 'active' && model.status !== 'training'
                        })} />
                        <span className="font-medium text-gray-900">{model.name}</span>
                      </div>
                      <div className="text-sm text-gray-600">{model.accuracy}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Loading models...</p>
                )}
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">System Health</h2>
              <div className="space-y-4">
                {[
                  { metric: 'API Response Time', value: platformStats?.processing_time || '1.4s', status: 'good' },
                  { metric: 'Model Accuracy', value: '91.6%', status: 'good' },
                  { metric: 'Database Connection', value: platformStats?.db_service ? 'Connected' : 'Checking...', status: platformStats?.db_service ? 'good' : 'warning' },
                  { metric: 'Total Predictions', value: platformStats?.total_predictions?.toLocaleString() || '0', status: 'good' },
                  { metric: 'Active Models', value: platformStats?.active_models || '0', status: 'good' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{item.metric}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{item.value}</span>
                      <div className={clsx('w-3 h-3 rounded-full', {
                        'bg-success-500': item.status === 'good',
                        'bg-warning-500': item.status === 'warning',
                        'bg-danger-500': item.status === 'error'
                      })} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;