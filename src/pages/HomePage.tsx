import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Stethoscope, UserCheck, BookOpen, Settings, Heart, Shield, Mic } from 'lucide-react';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { FONT_SIZES } from '../utils/accessibility';

export const HomePage: React.FC = () => {
  const { settings } = useAccessibilityStore();

  const features = [
    {
      icon: MessageCircle,
      title: 'Ask AI',
      description: 'Get instant health guidance from our AI assistant',
      path: '/ask-ai',
      color: 'blue'
    },
    {
      icon: Stethoscope,
      title: 'Symptom Checker',
      description: 'Describe your symptoms and get helpful suggestions',
      path: '/symptom-checker',
      color: 'green'
    },
    {
      icon: UserCheck,
      title: 'Ask a Doctor',
      description: 'Submit questions to healthcare professionals',
      path: '/ask-doctor',
      color: 'purple'
    },
    {
      icon: BookOpen,
      title: 'Health Lessons',
      description: 'Learn essential health practices and tips',
      path: '/lessons',
      color: 'orange'
    },
    {
      icon: Settings,
      title: 'Accessibility Settings',
      description: 'Customize your app experience',
      path: '/accessibility',
      color: 'gray'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30',
      green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30',
      purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30',
      orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/30',
      gray: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mr-4">
              <Heart className="w-8 h-8 text-white" aria-hidden="true" />
            </div>
            <h1 className={`${FONT_SIZES[settings.fontSize]} font-bold text-gray-900 dark:text-white`}>
              Welcome to CareWise AI
            </h1>
          </div>
          
          <p className={`${FONT_SIZES[settings.fontSize]} text-blue-600 dark:text-blue-400 font-semibold mb-4`}>
            Your Accessible Health Companion
          </p>
          
          <div className="max-w-3xl mx-auto space-y-3">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Get personalized health guidance that works completely offline. Our privacy-first platform 
              features voice interaction, disability-friendly design, and AI-powered assistance to help 
              you make informed health decisions.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Whether you need symptom checking, health education, or want to consult with professionals, 
              CareWise AI provides accessible healthcare tools designed for everyone.
            </p>
          </div>

          {/* Key Features Highlights */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Shield className="w-4 h-4 text-green-600" aria-hidden="true" />
              <span>100% Offline Capable</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Mic className="w-4 h-4 text-blue-600" aria-hidden="true" />
              <span>Voice Interaction</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Settings className="w-4 h-4 text-purple-600" aria-hidden="true" />
              <span>Accessibility First</span>
            </div>
          </div>
        </header>

        {/* Feature Cards */}
        <section aria-labelledby="features-heading">
          <h2 id="features-heading" className="sr-only">Available Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.path}
                  to={feature.path}
                  className={`block p-6 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${getColorClasses(feature.color)}`}
                  aria-describedby={`feature-${feature.title.replace(/\s+/g, '-').toLowerCase()}-desc`}
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm mr-4">
                      <Icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <h3 className={`${FONT_SIZES[settings.fontSize]} font-semibold`}>
                      {feature.title}
                    </h3>
                  </div>
                  <p 
                    id={`feature-${feature.title.replace(/\s+/g, '-').toLowerCase()}-desc`}
                    className="text-sm leading-relaxed"
                  >
                    {feature.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Quick Start Guide */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8" aria-labelledby="quick-start-heading">
          <h2 id="quick-start-heading" className={`${FONT_SIZES[settings.fontSize]} font-bold text-gray-900 dark:text-white mb-6 text-center`}>
            Quick Start Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg" aria-hidden="true">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Choose Your Tool</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Select from AI chat, symptom checker, doctor consultation, or health lessons
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 dark:text-green-400 font-bold text-lg" aria-hidden="true">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Get Personalized Help</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Receive tailored health guidance based on your specific needs and symptoms
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 dark:text-purple-400 font-bold text-lg" aria-hidden="true">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Take Action</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Follow recommendations, save information, or consult healthcare professionals
              </p>
            </div>
          </div>
        </section>

        {/* Emergency Notice */}
        <section className="mt-12 p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl" role="alert" aria-labelledby="emergency-heading">
          <h2 id="emergency-heading" className="font-bold text-red-800 dark:text-red-200 mb-2 flex items-center">
            <Shield className="w-5 h-5 mr-2" aria-hidden="true" />
            Medical Emergency Notice
          </h2>
          <p className="text-sm text-red-700 dark:text-red-300">
            <strong>If you are experiencing a medical emergency, call emergency services immediately.</strong> 
            This app provides general health information and should not replace professional medical care for urgent situations.
          </p>
        </section>
      </div>
    </main>
  );
};