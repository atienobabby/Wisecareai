import React, { useState } from 'react';
import { Droplets, Sun, Wind, Shield, Heart, Book, Volume2, VolumeX, ChevronDown, ChevronUp } from 'lucide-react';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { FONT_SIZES } from '../utils/accessibility';

interface HealthLesson {
  id: string;
  title: string;
  description: string;
  content: string;
  detailedContent: string;
  icon: React.ComponentType<any>;
  color: string;
  tips: string[];
  keyPoints: string[];
  whenToSeekHelp: string[];
}

const healthLessons: HealthLesson[] = [
  {
    id: 'hydration',
    title: 'Why Staying Hydrated Matters',
    description: 'Learn how proper hydration affects your entire body and simple ways to stay hydrated throughout the day.',
    content: 'Water makes up about 60% of your body weight and is essential for every cell, tissue, and organ to function properly.',
    detailedContent: `Proper hydration is one of the most important things you can do for your health. Water helps regulate body temperature, transport nutrients, remove waste, maintain blood pressure, and keep your joints lubricated.

When you're dehydrated, even mildly, you may experience fatigue, headaches, difficulty concentrating, and mood changes. Severe dehydration can be dangerous and requires immediate medical attention.

Your body loses water through breathing, sweating, and waste elimination. You need to replace this water regularly throughout the day, not just when you feel thirsty.`,
    icon: Droplets,
    color: 'blue',
    tips: [
      'Drink 8-10 glasses of water daily (about 2-2.5 liters)',
      'Start your day with a glass of water',
      'Keep a water bottle with you throughout the day',
      'Eat water-rich foods like fruits and vegetables',
      'Set reminders on your phone to drink water',
      'Monitor urine color - pale yellow indicates good hydration',
      'Increase intake during exercise, hot weather, or illness'
    ],
    keyPoints: [
      'Water is essential for all body functions',
      'Mild dehydration affects mood and concentration',
      'Thirst is not always a reliable indicator',
      'Individual needs vary based on activity and climate'
    ],
    whenToSeekHelp: [
      'Severe thirst that doesn\'t improve with drinking',
      'Dark yellow or amber-colored urine',
      'Dizziness or fainting',
      'Rapid heartbeat or breathing',
      'Confusion or irritability'
    ]
  },
  {
    id: 'sunlight',
    title: 'How to Use Sunlight for Better Sleep',
    description: 'Discover how morning sunlight exposure regulates your sleep cycle and improves overall health.',
    content: 'Morning sunlight helps set your internal body clock, leading to better sleep at night and more energy during the day.',
    detailedContent: `Your body has an internal clock called the circadian rhythm that controls when you feel sleepy and when you feel alert. This clock is primarily controlled by light exposure, especially sunlight.

When you expose yourself to bright light in the morning, it signals to your brain that it's time to be awake and alert. This helps suppress melatonin (the sleep hormone) during the day and ensures it's released at the right time in the evening.

Morning sunlight also helps your body produce vitamin D, which is important for bone health, immune function, and mood regulation. Even on cloudy days, outdoor light is much brighter than indoor lighting.`,
    icon: Sun,
    color: 'yellow',
    tips: [
      'Get 10-15 minutes of morning sunlight within 2 hours of waking',
      'Go outside without sunglasses for circadian benefits',
      'Take a morning walk or have breakfast by a window',
      'Even cloudy days provide beneficial light',
      'Combine sunlight exposure with light exercise',
      'Avoid bright screens 1-2 hours before bedtime',
      'Keep your bedroom dark at night'
    ],
    keyPoints: [
      'Morning light sets your internal body clock',
      'Helps improve sleep quality and timing',
      'Boosts vitamin D production',
      'Can improve mood and energy levels'
    ],
    whenToSeekHelp: [
      'Persistent sleep problems despite good light habits',
      'Extreme fatigue during the day',
      'Seasonal depression symptoms',
      'Difficulty staying asleep or waking up'
    ]
  },
  {
    id: 'breathing',
    title: 'Simple Breathing Exercises for Stress',
    description: 'Master easy breathing techniques that can reduce stress, improve focus, and promote relaxation anywhere.',
    content: 'Controlled breathing activates your body\'s relaxation response, helping reduce stress and anxiety naturally.',
    detailedContent: `Breathing exercises are one of the most effective ways to manage stress and anxiety. When you're stressed, your breathing becomes shallow and rapid. By consciously controlling your breath, you can activate your parasympathetic nervous system, which promotes relaxation.

Deep breathing increases oxygen flow to your brain and stimulates the vagus nerve, which helps calm your body's stress response. These techniques can be done anywhere, anytime, and require no special equipment.

Regular practice of breathing exercises can help lower blood pressure, reduce anxiety, improve focus, and promote better sleep. The key is to practice regularly, not just during stressful moments.`,
    icon: Wind,
    color: 'green',
    tips: [
      '4-7-8 breathing: Inhale for 4, hold for 7, exhale for 8 counts',
      'Box breathing: Inhale 4, hold 4, exhale 4, hold 4',
      'Practice for 5-10 minutes daily',
      'Use during stressful situations',
      'Focus on slow, deep belly breathing',
      'Find a quiet, comfortable place to practice',
      'Start with shorter sessions and gradually increase'
    ],
    keyPoints: [
      'Activates the body\'s natural relaxation response',
      'Can be done anywhere without equipment',
      'Helps reduce stress and anxiety immediately',
      'Improves with regular practice'
    ],
    whenToSeekHelp: [
      'Breathing exercises don\'t help with severe anxiety',
      'Persistent shortness of breath',
      'Chest pain during breathing exercises',
      'Panic attacks that don\'t improve'
    ]
  },
  {
    id: 'medication-safety',
    title: 'Safe Medication Practices',
    description: 'Essential guidelines for safely taking, storing, and managing medications to prevent dangerous interactions.',
    content: 'Proper medication management prevents dangerous interactions and ensures treatments work effectively.',
    detailedContent: `Medication safety is crucial for effective treatment and preventing harmful side effects. Many people take multiple medications, which increases the risk of interactions if not managed properly.

Always follow your healthcare provider's instructions exactly. Never adjust doses or stop medications without consulting them first. Keep an updated list of all medications, including over-the-counter drugs and supplements.

Proper storage is important - most medications should be kept in a cool, dry place away from children. Bathroom medicine cabinets are often too humid. Check expiration dates regularly and dispose of expired medications safely.`,
    icon: Shield,
    color: 'red',
    tips: [
      'Always follow prescribed dosages and timing',
      'Keep medications in original containers with labels',
      'Store in cool, dry places away from children',
      'Check expiration dates regularly',
      'Never share prescription medications',
      'Keep an updated medication list',
      'Inform all healthcare providers about all medications',
      'Use a pill organizer for complex regimens'
    ],
    keyPoints: [
      'Following instructions prevents dangerous interactions',
      'Proper storage maintains medication effectiveness',
      'Communication with healthcare providers is essential',
      'Regular review prevents medication errors'
    ],
    whenToSeekHelp: [
      'Unexpected side effects or reactions',
      'Difficulty remembering to take medications',
      'Questions about drug interactions',
      'Problems affording prescribed medications'
    ]
  },
  {
    id: 'mental-wellness',
    title: 'Mental Health Tips for Daily Stress',
    description: 'Simple daily practices to support your mental health and build resilience against everyday stressors.',
    content: 'Mental wellness requires daily attention, just like physical health. Small consistent practices make a big difference.',
    detailedContent: `Mental health is just as important as physical health, and it requires regular care and attention. Daily stress is normal, but chronic stress can lead to serious health problems including anxiety, depression, and physical illness.

Building mental resilience involves developing healthy coping strategies, maintaining social connections, and practicing self-care. It's about creating a toolkit of strategies you can use when stress levels rise.

Remember that seeking help is a sign of strength, not weakness. Mental health professionals can provide valuable support and strategies for managing stress, anxiety, and other mental health concerns.`,
    icon: Heart,
    color: 'purple',
    tips: [
      'Practice gratitude - write down 3 things daily',
      'Maintain social connections with friends and family',
      'Set healthy boundaries and learn to say no',
      'Engage in activities you enjoy regularly',
      'Get adequate sleep (7-9 hours for adults)',
      'Exercise regularly, even light walking helps',
      'Limit news and social media if they increase stress',
      'Practice mindfulness or meditation'
    ],
    keyPoints: [
      'Mental health requires daily attention and care',
      'Small consistent practices build resilience',
      'Social connections are crucial for wellbeing',
      'Professional help is available and effective'
    ],
    whenToSeekHelp: [
      'Persistent feelings of sadness or hopelessness',
      'Anxiety that interferes with daily activities',
      'Thoughts of self-harm or suicide',
      'Significant changes in sleep, appetite, or behavior',
      'Difficulty functioning at work or in relationships'
    ]
  },
  {
    id: 'fever-understanding',
    title: 'Understanding Fever and When to Worry',
    description: 'Learn what fever means, how to manage it safely, and when it requires medical attention.',
    content: 'Fever is your body\'s natural defense against infection. Understanding when it\'s helpful and when it\'s concerning is important.',
    detailedContent: `Fever is not an illness itself, but a symptom that your immune system is fighting an infection. A normal body temperature is around 98.6°F (37°C), but this can vary slightly from person to person and throughout the day.

Low-grade fevers (99-100.4°F) often don't require treatment and may actually help your body fight infection. However, high fevers or fevers that persist can be dangerous and require medical attention.

The key is knowing when to treat a fever and when to seek medical help. Age, underlying health conditions, and other symptoms all play a role in determining the appropriate response.`,
    icon: Shield,
    color: 'orange',
    tips: [
      'Monitor temperature regularly during illness',
      'Stay hydrated with water, clear broths, or electrolyte solutions',
      'Rest and avoid strenuous activities',
      'Dress lightly and use light blankets',
      'Take fever reducers (acetaminophen, ibuprofen) as directed',
      'Use cool compresses on forehead or wrists',
      'Avoid alcohol and caffeine',
      'Keep a fever diary noting temperature and symptoms'
    ],
    keyPoints: [
      'Fever is a natural immune response',
      'Low-grade fevers often don\'t need treatment',
      'Hydration and rest are most important',
      'Age and health conditions affect fever management'
    ],
    whenToSeekHelp: [
      'Fever above 103°F (39.4°C) in adults',
      'Fever lasting more than 3 days',
      'Difficulty breathing or chest pain',
      'Severe headache or stiff neck',
      'Persistent vomiting or signs of dehydration',
      'Confusion or difficulty staying awake'
    ]
  }
];

export const LessonsPage: React.FC = () => {
  const { settings } = useAccessibilityStore();
  const { speak, stop, isSpeaking } = useTextToSpeech();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [speakingLesson, setSpeakingLesson] = useState<string | null>(null);

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
      yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
      green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
      red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
      purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-200',
      orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getIconColorClasses = (color: string) => {
    const colorMap = {
      blue: 'text-blue-600 dark:text-blue-400',
      yellow: 'text-yellow-600 dark:text-yellow-400',
      green: 'text-green-600 dark:text-green-400',
      red: 'text-red-600 dark:text-red-400',
      purple: 'text-purple-600 dark:text-purple-400',
      orange: 'text-orange-600 dark:text-orange-400'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const handleSpeakLesson = (lesson: HealthLesson) => {
    if (speakingLesson === lesson.id && isSpeaking) {
      stop();
      setSpeakingLesson(null);
    } else {
      const textToSpeak = `${lesson.title}. ${lesson.description}. ${lesson.detailedContent}`;
      speak(textToSpeak);
      setSpeakingLesson(lesson.id);
    }
  };

  const handleLessonToggle = (lessonId: string) => {
    setSelectedLesson(selectedLesson === lessonId ? null : lessonId);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Book className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" aria-hidden="true" />
            <h1 className={`${FONT_SIZES[settings.fontSize]} font-bold text-gray-900 dark:text-white`}>
              Health Education Lessons
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Learn essential health practices with our offline-ready educational content. 
            Each lesson includes practical tips you can use immediately, with voice support for accessibility.
          </p>
        </header>

        {/* Lessons Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" aria-label="Health lesson cards">
          {healthLessons.map((lesson) => {
            const Icon = lesson.icon;
            const isSelected = selectedLesson === lesson.id;
            const isCurrentlySpeaking = speakingLesson === lesson.id && isSpeaking;
            
            return (
              <article
                key={lesson.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-md hover:scale-105 ${
                  isSelected ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center flex-1">
                    <div className={`p-3 rounded-lg ${getColorClasses(lesson.color)} mr-4 flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${getIconColorClasses(lesson.color)}`} aria-hidden="true" />
                    </div>
                    <h2 className={`${FONT_SIZES[settings.fontSize]} font-semibold text-gray-900 dark:text-white`}>
                      {lesson.title}
                    </h2>
                  </div>
                  
                  <button
                    onClick={() => handleSpeakLesson(lesson)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    title={isCurrentlySpeaking ? 'Stop reading' : 'Read lesson aloud'}
                    aria-label={isCurrentlySpeaking ? `Stop reading ${lesson.title}` : `Read ${lesson.title} aloud`}
                  >
                    {isCurrentlySpeaking ? (
                      <VolumeX className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <Volume2 className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                  {lesson.description}
                </p>
                
                <button
                  onClick={() => handleLessonToggle(lesson.id)}
                  className="flex items-center justify-between w-full text-left text-blue-600 dark:text-blue-400 font-medium text-sm hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
                  aria-expanded={isSelected}
                  aria-controls={`lesson-${lesson.id}-content`}
                >
                  <span>{isSelected ? 'Show less' : 'Learn more'}</span>
                  {isSelected ? (
                    <ChevronUp className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </article>
            );
          })}
        </section>

        {/* Detailed Lesson Content */}
        {selectedLesson && (
          <section 
            id={`lesson-${selectedLesson}-content`}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8"
            aria-live="polite"
          >
            {(() => {
              const lesson = healthLessons.find(l => l.id === selectedLesson);
              if (!lesson) return null;
              
              const Icon = lesson.icon;
              
              return (
                <div>
                  <header className="flex items-center mb-6">
                    <div className={`p-4 rounded-lg ${getColorClasses(lesson.color)} mr-4`}>
                      <Icon className={`w-8 h-8 ${getIconColorClasses(lesson.color)}`} aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className={`${FONT_SIZES[settings.fontSize]} font-bold text-gray-900 dark:text-white mb-2`}>
                        {lesson.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {lesson.description}
                      </p>
                    </div>
                  </header>
                  
                  <div className="prose dark:prose-invert max-w-none mb-8">
                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {lesson.detailedContent}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Key Points */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Key Points to Remember
                      </h3>
                      <ul className="space-y-2" role="list">
                        {lesson.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full ${getIconColorClasses(lesson.color)} mt-2 flex-shrink-0`} aria-hidden="true" />
                            <span className="text-gray-700 dark:text-gray-300">
                              {point}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Practical Tips */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Practical Tips
                      </h3>
                      <ul className="space-y-2" role="list">
                        {lesson.tips.map((tip, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full ${getIconColorClasses(lesson.color)} mt-2 flex-shrink-0`} aria-hidden="true" />
                            <span className="text-gray-700 dark:text-gray-300">
                              {tip}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* When to Seek Help */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      When to Seek Professional Help
                    </h3>
                    <div className={`p-4 rounded-lg border ${getColorClasses(lesson.color)}`}>
                      <ul className="space-y-2" role="list">
                        {lesson.whenToSeekHelp.map((item, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <div className="w-2 h-2 rounded-full bg-current mt-2 flex-shrink-0" aria-hidden="true" />
                            <span className="text-sm">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Remember:</strong> This information is for educational purposes only and should not replace professional medical advice. Always consult with healthcare professionals for personalized guidance.
                    </p>
                  </div>
                </div>
              );
            })()}
          </section>
        )}

        {/* Call to Action */}
        <section className="mt-12 text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Need More Personalized Health Guidance?
            </h2>
            <p className="text-blue-800 dark:text-blue-200 mb-4">
              These lessons provide general guidance. For personalized health advice based on your specific situation, try our other tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/ask-ai"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Ask AI Assistant
              </a>
              <a
                href="/symptom-checker"
                className="px-6 py-2 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Check Symptoms
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};