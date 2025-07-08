import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Stethoscope, UserCheck, BookOpen, Settings, Heart, Home } from 'lucide-react';
import { useAccessibilityStore } from '../store/accessibilityStore';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const { togglePanel } = useAccessibilityStore();

  const navItems = [
    {
      path: '/',
      label: 'Home',
      icon: Home
    },
    {
      path: '/ask-ai',
      label: 'Ask AI',
      icon: MessageCircle
    },
    {
      path: '/symptom-checker',
      label: 'Symptom Checker',
      icon: Stethoscope
    },
    {
      path: '/ask-doctor',
      label: 'Ask a Doctor',
      icon: UserCheck
    },
    {
      path: '/lessons',
      label: 'Health Lessons',
      icon: BookOpen
    },
    {
      path: '/accessibility',
      label: 'Accessibility',
      icon: Settings
    }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-lg"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center" aria-hidden="true">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              CareWise AI
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}

            {/* Quick Accessibility Toggle */}
            <button
              onClick={togglePanel}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              aria-label="Toggle accessibility panel"
              title="Quick accessibility settings"
            >
              <Settings className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};