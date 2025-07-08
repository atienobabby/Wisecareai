import React from 'react';
import { FONT_SIZES } from '../utils/accessibility';

interface SymptomData {
  bodyArea: string;
  description: string;
  painLevel: number;
  duration: string;
  additionalSymptoms: string[];
}

interface SymptomFormProps {
  data: SymptomData;
  onChange: (data: SymptomData) => void;
  fontSize: 'small' | 'medium' | 'large' | 'xl';
}

const commonSymptoms = [
  'Swelling',
  'Redness',
  'Numbness',
  'Tingling',
  'Stiffness',
  'Burning sensation',
  'Itching',
  'Weakness',
  'Fever',
  'Nausea'
];

const durationOptions = [
  'Less than 1 hour',
  '1-6 hours',
  '6-24 hours',
  '1-3 days',
  '3-7 days',
  '1-2 weeks',
  '2-4 weeks',
  'More than 1 month'
];

export const SymptomForm: React.FC<SymptomFormProps> = ({ data, onChange, fontSize }) => {
  const handleSymptomToggle = (symptom: string) => {
    const newSymptoms = data.additionalSymptoms.includes(symptom)
      ? data.additionalSymptoms.filter(s => s !== symptom)
      : [...data.additionalSymptoms, symptom];
    
    onChange({ ...data, additionalSymptoms: newSymptoms });
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <label className={`block ${FONT_SIZES[fontSize]} font-medium text-gray-700 dark:text-gray-300 mb-2`}>
          Describe your symptoms *
        </label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="Please describe what you're experiencing in detail..."
          className={`w-full ${FONT_SIZES[fontSize]} px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          rows={4}
          maxLength={500}
        />
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
          {data.description.length}/500 characters
        </div>
      </div>

      {/* Pain Level */}
      <div>
        <label className={`block ${FONT_SIZES[fontSize]} font-medium text-gray-700 dark:text-gray-300 mb-2`}>
          Pain/Discomfort Level: {data.painLevel}/10
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={data.painLevel}
          onChange={(e) => onChange({ ...data, painLevel: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>Mild (1)</span>
          <span>Moderate (5)</span>
          <span>Severe (10)</span>
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className={`block ${FONT_SIZES[fontSize]} font-medium text-gray-700 dark:text-gray-300 mb-2`}>
          How long have you had these symptoms?
        </label>
        <select
          value={data.duration}
          onChange={(e) => onChange({ ...data, duration: e.target.value })}
          className={`w-full ${FONT_SIZES[fontSize]} px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        >
          <option value="">Select duration...</option>
          {durationOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Additional Symptoms */}
      <div>
        <label className={`block ${FONT_SIZES[fontSize]} font-medium text-gray-700 dark:text-gray-300 mb-3`}>
          Additional symptoms (select all that apply)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {commonSymptoms.map((symptom) => (
            <label
              key={symptom}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={data.additionalSymptoms.includes(symptom)}
                onChange={() => handleSymptomToggle(symptom)}
                className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {symptom}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};