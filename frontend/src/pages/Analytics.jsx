import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  BeakerIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Analytics = () => {
  const [stats, setStats] = useState({
    totalPredictions: 0,
    toxicCompounds: 0,
    safeCompounds: 0,
    averageAccuracy: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Load analytics data from localStorage or API
    const savedStats = localStorage.getItem('drugtox_analytics');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }

    const savedActivity = localStorage.getItem('drugtox_activity');
    if (savedActivity) {
      setRecentActivity(JSON.parse(savedActivity));
    }
  }, []);

  const endpoints = [
    { id: 'NR-AR-LBD', name: 'Androgen Receptor', accuracy: 83.9, predictions: 45 },
    { id: 'NR-AhR', name: 'Aryl Hydrocarbon Receptor', accuracy: 83.4, predictions: 38 },
    { id: 'SR-MMP', name: 'Mitochondrial Membrane', accuracy: 80.8, predictions: 42 },
    { id: 'NR-ER-LBD', name: 'Estrogen Receptor', accuracy: 77.6, predictions: 35 },
    { id: 'NR-AR', name: 'Androgen Receptor (Alt)', accuracy: 75.2, predictions: 33 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <p className="mt-2 text-gray-600">
          Monitor prediction performance and usage statistics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BeakerIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Predictions
                </dt>
                <dd className="text-2xl font-bold text-gray-900">
                  {stats.totalPredictions.toLocaleString()}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Toxic Compounds
                </dt>
                <dd className="text-2xl font-bold text-gray-900">
                  {stats.toxicCompounds}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Safe Compounds
                </dt>
                <dd className="text-2xl font-bold text-gray-900">
                  {stats.safeCompounds}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArrowTrendingUpIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Avg. Accuracy
                </dt>
                <dd className="text-2xl font-bold text-gray-900">
                  {stats.averageAccuracy.toFixed(1)}%
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Endpoint Performance */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Endpoint Performance</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {endpoints.map((endpoint) => (
              <div key={endpoint.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {endpoint.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {endpoint.accuracy}% accuracy
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${endpoint.accuracy}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {endpoint.predictions} predictions
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start making predictions to see activity here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.slice(0, 10).map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <BeakerIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Predicted toxicity for {activity.compound}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.result} • {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;