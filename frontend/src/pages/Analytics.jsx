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

  const [endpoints, setEndpoints] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch analytics data from API
        const response = await fetch('http://localhost:5000/api/analytics');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update stats from overview
        if (data.overview) {
          setStats({
            totalPredictions: data.overview.total_predictions || 0,
            toxicCompounds: data.overview.toxic_compounds || 0,
            safeCompounds: data.overview.safe_compounds || 0,
            averageAccuracy: data.overview.average_accuracy || 0
          });
        }

        // Update endpoints from endpoint_performance
        if (data.endpoint_performance && Array.isArray(data.endpoint_performance)) {
          const formattedEndpoints = data.endpoint_performance.map(ep => ({
            id: ep.endpoint,
            name: ep.endpoint.replace('NR-', 'Nuclear Receptor - ').replace('SR-', 'Stress Response - '),
            accuracy: ep.accuracy,
            predictions: ep.predictions
          }));
          setEndpoints(formattedEndpoints);
        }

        // Update recent activity
        if (data.recent_activity && Array.isArray(data.recent_activity)) {
          setRecentActivity(data.recent_activity);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchAnalyticsData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <p className="mt-2 text-gray-600">
          Monitor prediction performance and usage statistics
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading analytics...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            <p className="ml-3 text-red-800">
              Failed to load analytics: {error}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Content - Only show when not loading and no error */}
      {!isLoading && !error && (
        <>
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
                      Predicted toxicity for {activity.smiles || activity.compound}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.result || 'Completed'} • {new Date(activity.created_at || activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default Analytics;