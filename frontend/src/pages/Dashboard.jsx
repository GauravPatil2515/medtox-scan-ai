import React from 'react';
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
  // Sample data - in real app this would come from API
  const stats = [
    {
      name: 'Total Predictions',
      value: '2,847',
      change: '+12%',
      changeType: 'increase',
      icon: BeakerIcon,
      color: 'primary'
    },
    {
      name: 'Success Rate',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'increase',
      icon: CheckCircleIcon,
      color: 'success'
    },
    {
      name: 'Processing Time',
      value: '1.4s',
      change: '-0.3s',
      changeType: 'decrease',
      icon: ClockIcon,
      color: 'warning'
    },
    {
      name: 'Active Models',
      value: '5',
      change: 'Stable',
      changeType: 'neutral',
      icon: ChartBarIcon,
      color: 'info'
    }
  ];

  const recentPredictions = [
    {
      id: 1,
      molecule: 'Caffeine (C8H10N4O2)',
      smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C',
      predictions: {
        hepatotoxicity: { value: 0.12, risk: 'Low' },
        carcinogenicity: { value: 0.08, risk: 'Low' },
        mutagenicity: { value: 0.15, risk: 'Low' }
      },
      timestamp: '2 minutes ago',
      status: 'completed'
    },
    {
      id: 2,
      molecule: 'Aspirin (C9H8O4)',
      smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
      predictions: {
        hepatotoxicity: { value: 0.34, risk: 'Medium' },
        carcinogenicity: { value: 0.11, risk: 'Low' },
        mutagenicity: { value: 0.09, risk: 'Low' }
      },
      timestamp: '5 minutes ago',
      status: 'completed'
    },
    {
      id: 3,
      molecule: 'Benzene (C6H6)',
      smiles: 'C1=CC=CC=C1',
      predictions: {
        hepatotoxicity: { value: 0.78, risk: 'High' },
        carcinogenicity: { value: 0.85, risk: 'High' },
        mutagenicity: { value: 0.82, risk: 'High' }
      },
      timestamp: '12 minutes ago',
      status: 'completed'
    }
  ];

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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Gaurav!</h1>
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
          <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2">
            <BeakerIcon className="w-4 h-4" />
            <span>New Prediction</span>
          </button>
          <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2">
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
            <button className="text-primary-600 hover:text-primary-500 text-sm font-medium flex items-center space-x-1">
              <EyeIcon className="w-4 h-4" />
              <span>View all</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-hidden">
          <div className="divide-y divide-gray-200">
            {recentPredictions.map((prediction) => (
              <div key={prediction.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-medium text-gray-900">{prediction.molecule}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                        Completed
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-4 font-mono bg-gray-50 p-2 rounded">
                      SMILES: {prediction.smiles}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(prediction.predictions).map(([endpoint, data]) => (
                        <div key={endpoint} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {endpoint}
                            </span>
                            <span className={clsx('inline-flex items-center px-2 py-1 rounded-full text-xs font-medium', getRiskColor(data.risk))}>
                              {data.risk}
                            </span>
                          </div>
                          <div className="text-lg font-semibold text-gray-900">
                            {(data.value * 100).toFixed(1)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="ml-6 text-right">
                    <div className="text-sm text-gray-500">{prediction.timestamp}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Model Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Models */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Models</h2>
          <div className="space-y-4">
            {[
              { name: 'Hepatotoxicity XGBoost', accuracy: '94.2%', status: 'active' },
              { name: 'Carcinogenicity RF', accuracy: '91.8%', status: 'active' },
              { name: 'Mutagenicity SVM', accuracy: '89.5%', status: 'active' },
              { name: 'Cardiotoxicity DNN', accuracy: '87.3%', status: 'training' },
              { name: 'Nephrotoxicity XGBoost', accuracy: '92.1%', status: 'active' }
            ].map((model, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={clsx('w-3 h-3 rounded-full', {
                    'bg-success-500': model.status === 'active',
                    'bg-warning-500': model.status === 'training'
                  })} />
                  <span className="font-medium text-gray-900">{model.name}</span>
                </div>
                <div className="text-sm text-gray-600">{model.accuracy}</div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Health</h2>
          <div className="space-y-4">
            {[
              { metric: 'API Response Time', value: '142ms', status: 'good' },
              { metric: 'Model Accuracy', value: '91.6%', status: 'good' },
              { metric: 'Database Connection', value: 'Stable', status: 'good' },
              { metric: 'Memory Usage', value: '68%', status: 'warning' },
              { metric: 'CPU Usage', value: '34%', status: 'good' }
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
    </div>
  );
};

export default Dashboard;