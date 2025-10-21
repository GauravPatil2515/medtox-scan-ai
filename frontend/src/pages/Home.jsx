import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BeakerIcon, 
  ChartBarIcon, 
  CpuChipIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BeakerIcon,
      title: '5 Toxicity Endpoints',
      description: 'Comprehensive analysis across NR-AR-LBD, NR-AhR, SR-MMP, NR-ER-LBD, and NR-AR pathways'
    },
    {
      icon: CpuChipIcon,
      title: 'AI-Powered Predictions',
      description: 'Advanced machine learning models trained on extensive toxicity datasets'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Reliable Results',
      description: 'High-accuracy predictions with confidence scores and detailed analysis'
    },
    {
      icon: LightBulbIcon,
      title: 'Real-time Analysis',
      description: 'Instant SMILES-based compound analysis with immediate results'
    }
  ];

  const stats = [
    { label: 'Accuracy Rate', value: '95%+' },
    { label: 'Toxicity Endpoints', value: '5' },
    { label: 'Processing Time', value: '<1s' },
    { label: 'Compounds Analyzed', value: '10K+' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 relative overflow-hidden">
      {/* Enhanced Grid Background with Animation */}
      <div className="absolute inset-0 bg-grid-pink-200/[0.08] bg-[size:24px_24px] animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-pink-50/20 via-transparent to-purple-50/20" />
      
      {/* Top Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
            <BeakerIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            DrugTox-AI
          </span>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
          <button
            onClick={() => navigate('/app/dashboard')}
            className="flex items-center space-x-1 sm:space-x-2 text-pink-600 hover:text-pink-700 font-medium transition-colors duration-200 text-sm sm:text-base"
          >
            <ChartBarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <button
            onClick={() => navigate('/app/predictions')}
            className="flex items-center space-x-1 sm:space-x-2 text-pink-600 hover:text-pink-700 font-medium transition-colors duration-200 text-sm sm:text-base"
          >
            <BeakerIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Analysis</span>
          </button>
          <button
            onClick={() => navigate('/app/contact')}
            className="flex items-center space-x-1 sm:space-x-2 text-pink-600 hover:text-pink-700 font-medium transition-colors duration-200 text-sm sm:text-base"
          >
            <ChatBubbleLeftRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Chat</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl pt-8 pb-12 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 mb-6 sm:mb-8 bg-pink-100 border border-pink-200 rounded-full text-pink-700 text-xs sm:text-sm font-medium">
              AI-Powered Drug Toxicity Analysis
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-4 sm:mb-6 px-4">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                MedToXAi
              </span>
            </h1>
            
            <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto mb-12">
              Get instant, accurate drug toxicity analysis powered by advanced AI technology. 
              Upload molecular data or use SMILES strings for quick assessment and personalized 
              toxicity predictions across multiple endpoints.
            </p>
            
            <div className="flex items-center justify-center gap-x-6 mb-16">
              <button
                onClick={() => navigate('/app/predictions')}
                className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-300 hover:brightness-110"
              >
                <span className="flex items-center">
                  Start Analysis
                  <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
              
              <button
                onClick={() => navigate('/app/contact')}
                className="group px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl shadow-lg border border-gray-200 hover:border-pink-300 hover:shadow-2xl hover:shadow-pink-200/30 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-300"
              >
                Chat
              </button>
            </div>

            {/* Chat Section */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl hover:shadow-pink-100/50 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center mr-4">
                    <BeakerIcon className="h-5 w-5 text-pink-600" />
                  </div>
                  <p className="text-gray-700 font-medium">
                    Hello! I'm here to help you with all your drug toxicity analysis needs.
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Type your SMILES string or ask about toxicity analysis..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => navigate('/app/predictions')}
                    className="p-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors duration-200"
                  >
                    <ArrowRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white/80 backdrop-blur-sm py-16 sm:py-20 border-y border-gray-100 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-50/30 via-transparent to-purple-50/30" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div className="transform group-hover:scale-110 transition-all duration-300 group-hover:drop-shadow-lg">
                  <dt className="text-4xl font-bold text-transparent bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                    {stat.value}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                    {stat.label}
                  </dd>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-20 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Advanced Toxicity Analysis
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Leverage cutting-edge AI technology to predict drug toxicity with unprecedented accuracy and speed.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative rounded-2xl bg-white/90 backdrop-blur-sm p-8 shadow-lg ring-1 ring-gray-200 hover:shadow-2xl hover:shadow-pink-500/20 hover:ring-pink-400 hover:bg-white transform hover:scale-105 transition-all duration-500 cursor-pointer hover:glow"
                style={{
                  boxShadow: 'hover:0 0 30px rgba(236, 72, 153, 0.3)'
                }}
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300 mb-6">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-pink-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.15] bg-[size:32px_32px] animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to analyze your compounds?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-pink-100">
              Start predicting drug toxicity instantly with our advanced AI models. 
              Simply input SMILES strings and get comprehensive toxicity analysis.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={() => navigate('/app/predictions')}
                className="group px-8 py-4 bg-white text-pink-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-300"
              >
                <span className="flex items-center">
                  <BeakerIcon className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  Start Analysis
                </span>
              </button>
              
              <button
                onClick={() => navigate('/app/batch')}
                className="group px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-pink-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-300"
              >
                <span className="flex items-center">
                  <AcademicCapIcon className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  Batch Processing
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;