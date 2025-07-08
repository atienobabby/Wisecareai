import React, { useState } from 'react';
import { Send, CheckCircle, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { FONT_SIZES } from '../utils/accessibility';

interface DoctorQuestion {
  name: string;
  question: string;
  contactMethod: 'email' | 'phone' | '';
  contactValue: string;
}

export const AskDoctorPage: React.FC = () => {
  const { settings } = useAccessibilityStore();
  const [formData, setFormData] = useState<DoctorQuestion>({
    name: '',
    question: '',
    contactMethod: '',
    contactValue: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.question.trim()) {
      alert('Please fill in your name and question.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Store locally for demonstration
    const submission = {
      ...formData,
      timestamp: new Date().toISOString(),
      id: `question-${Date.now()}`
    };
    
    try {
      const existingQuestions = JSON.parse(localStorage.getItem('doctorQuestions') || '[]');
      existingQuestions.push(submission);
      localStorage.setItem('doctorQuestions', JSON.stringify(existingQuestions));
      console.log('Doctor question submitted:', submission);
    } catch (error) {
      console.error('Error storing question:', error);
    }
    
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      question: '',
      contactMethod: '',
      contactValue: ''
    });
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
            <h1 className={`${FONT_SIZES[settings.fontSize]} font-bold text-gray-900 dark:text-white mb-4`}>
              Question Received Successfully
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Thank you, {formData.name}. Your question has been received and will be reviewed by a healthcare provider. 
              You can expect a response within 24-48 hours.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Important:</strong> This service is for non-urgent questions only. 
                If you have a medical emergency, please call emergency services immediately.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Ask Another Question
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`${FONT_SIZES[settings.fontSize]} font-bold text-gray-900 dark:text-white mb-4`}>
            Ask a Doctor
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            Submit your health questions to qualified healthcare providers. 
            Get professional medical advice from licensed doctors.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label 
                htmlFor="name"
                className={`block ${FONT_SIZES[settings.fontSize]} font-medium text-gray-700 dark:text-gray-300 mb-2`}
              >
                Your Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full ${FONT_SIZES[settings.fontSize]} pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Enter your full name"
                  required
                  aria-describedby="name-help"
                />
              </div>
              <p id="name-help" className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Your name will be used to personalize the response
              </p>
            </div>

            {/* Question Field */}
            <div>
              <label 
                htmlFor="question"
                className={`block ${FONT_SIZES[settings.fontSize]} font-medium text-gray-700 dark:text-gray-300 mb-2`}
              >
                Your Health Question *
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                  className={`w-full ${FONT_SIZES[settings.fontSize]} pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  rows={5}
                  placeholder="Please describe your health concern in detail. Include symptoms, duration, and any relevant medical history..."
                  required
                  maxLength={1000}
                  aria-describedby="question-help"
                />
              </div>
              <div className="flex justify-between mt-1">
                <p id="question-help" className="text-xs text-gray-500 dark:text-gray-400">
                  Be as specific as possible for the most accurate advice
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formData.question.length}/1000
                </span>
              </div>
            </div>

            {/* Contact Method */}
            <div>
              <label className={`block ${FONT_SIZES[settings.fontSize]} font-medium text-gray-700 dark:text-gray-300 mb-3`}>
                Preferred Contact Method (Optional)
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="contactMethod"
                    value="email"
                    checked={formData.contactMethod === 'email'}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactMethod: e.target.value as 'email' }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">Email</span>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="contactMethod"
                    value="phone"
                    checked={formData.contactMethod === 'phone'}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactMethod: e.target.value as 'phone' }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">Phone</span>
                </label>
              </div>

              {formData.contactMethod && (
                <div className="mt-3">
                  <input
                    type={formData.contactMethod === 'email' ? 'email' : 'tel'}
                    value={formData.contactValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactValue: e.target.value }))}
                    className={`w-full ${FONT_SIZES[settings.fontSize]} px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder={formData.contactMethod === 'email' ? 'your.email@example.com' : '+1 (555) 123-4567'}
                  />
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Medical Disclaimer:</strong> This service is for non-urgent medical questions only. 
                If you are experiencing a medical emergency, please call emergency services immediately. 
                The advice provided is for informational purposes and should not replace in-person medical consultation.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !formData.name.trim() || !formData.question.trim()}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Submitting Question...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Question</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};