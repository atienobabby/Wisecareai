
import React, { useState } from 'react';
import { Download, Copy, AlertCircle, Activity, Loader, Volume2, VolumeX } from 'lucide-react';
import { BodyDiagram } from '../components/BodyDiagram';
import { SymptomForm } from '../components/SymptomForm';
import { useAccessibilityStore } from '../store/accessibilityStore';
import { getSymptomAdvice } from '../services/symptomChecker'; 
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { FONT_SIZES } from '../utils/accessibility';

interface SymptomData {
    bodyArea: string;
    description: string;
    painLevel: number;
    duration: string;
    additionalSymptoms: string[];
}

export const SymptomCheckerPage: React.FC = () => {
    const { settings } = useAccessibilityStore();
    const { speak, stop, isSpeaking } = useTextToSpeech();
    const [selectedArea, setSelectedArea] = useState<string>('');
    const [symptomData, setSymptomData] = useState<SymptomData>({
        bodyArea: '',
        description: '',
        painLevel: 1,
        duration: '',
        additionalSymptoms: []
    });
    const [localSuggestions, setLocalSuggestions] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [showDisclaimer, setShowDisclaimer] = useState(true);
    const [copySuccess, setCopySuccess] = useState(false);

    const bodyAreas = [
        { id: 'head', label: 'Head', x: 50, y: 15 },
        { id: 'neck', label: 'Neck', x: 50, y: 25 },
        { id: 'chest', label: 'Chest', x: 50, y: 35 },
        { id: 'left-arm', label: 'Left Arm', x: 25, y: 40 },
        { id: 'right-arm', x: 75, y: 40, label: 'Right Arm' },
        { id: 'abdomen', label: 'Abdomen', x: 50, y: 50 },
        { id: 'back', label: 'Back', x: 50, y: 45 },
        { id: 'left-leg', label: 'Left Leg', x: 40, y: 70 },
        { id: 'right-leg', label: 'Right Leg', x: 60, y: 70 },
        { id: 'left-foot', label: 'Left Foot', x: 40, y: 90 },
        { id: 'right-foot', label: 'Right Foot', x: 60, y: 90 }
    ];

    const handleAreaSelect = (area: string) => {
        setSelectedArea(area);

        setSymptomData(prev => {
            let newDescription = prev.description.trim();
            const areaLabel = bodyAreas.find(a => a.id === area)?.label || area;

            if (newDescription.includes(areaLabel)) {
                newDescription = newDescription.split(', ').filter(part => part !== areaLabel).join(', ');
            } else {
                newDescription = newDescription ? `${newDescription}, ${areaLabel}` : areaLabel;
            }

            return {
                ...prev,
                bodyArea: area,
                description: newDescription.trim()
            };
        });
    };

    const handleSubmit = async () => {
        if (!symptomData.description.trim()) {
            alert('Please describe your symptoms before checking.');
            return;
        }

        setIsLoading(true);
        setLocalSuggestions(''); 

        try {
            
            const localAdvice = await getSymptomAdvice(symptomData.description);
            const fullResponse = localAdvice.answer; 
            setLocalSuggestions(fullResponse);

            if (fullResponse) {
                speak(fullResponse);
            }

        } catch (error) {
            console.error('Error in local symptom analysis:', error);
            const errorMessage = "I'm sorry, I'm having trouble analyzing your symptoms right now. Please consult with a healthcare professional for proper medical evaluation and diagnosis.";
            setLocalSuggestions(errorMessage);
            speak(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSpeakResponse = () => {
        if (isSpeaking) {
            stop();
        } else if (localSuggestions) { 
            speak(localSuggestions);
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(localSuggestions); 
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (error) {
            console.error('Failed to copy text:', error);
        }
    };

    const handleDownload = () => {
        const content = `CareWise AI Symptom Analysis
Generated on: ${new Date().toLocaleDateString()}

SYMPTOM INFORMATION:
Body Area: ${symptomData.bodyArea || 'Not specified'}
Description: ${symptomData.description}
Pain/Discomfort Level: ${symptomData.painLevel}/10
Duration: ${symptomData.duration || 'Not specified'}
Additional Symptoms: ${symptomData.additionalSymptoms.join(', ') || 'None'}

ANALYSIS:
${localSuggestions}

IMPORTANT DISCLAIMER:
This information is provided for informational purposes only and should not replace professional medical advice. Always consult with healthcare professionals for medical concerns, especially if symptoms are severe, persistent, or worsening.

For medical emergencies, contact emergency services immediately.`;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `symptom-analysis-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleSubmit();
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16" onKeyDown={handleKeyDown}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <header className="mb-8">
                    <h1 className={`${FONT_SIZES[settings.fontSize]} font-bold text-gray-900 dark:text-white mb-2`}>
                        Symptom Checker
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Describe how you feel and get helpful suggestions - works completely offline
                    </p>
                </header>

                {/* Medical Disclaimer */}
                {showDisclaimer && (
                    <section className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg" role="alert">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                            <div className="flex-1">
                                <h2 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
                                    Important Medical Disclaimer
                                </h2>
                                <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                                    This symptom checker provides general health information for educational purposes only.
                                    It is not a substitute for professional medical advice, diagnosis, or treatment.
                                    Always seek the advice of qualified healthcare providers with any questions about medical conditions.
                                </p>
                                <button
                                    onClick={() => setShowDisclaimer(false)}
                                    className="text-xs text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 underline focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 rounded"
                                >
                                    I understand, dismiss this notice
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Input and Additional Details Section */}
                    <div className="space-y-6">

                        {/* Optional Body Diagram - This can remain here or move below the textarea */}
                        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Select Affected Area (Optional)
                            </h2>
                            <BodyDiagram
                                selectedArea={selectedArea}
                                onAreaSelect={handleAreaSelect}
                            />
                        </section>

                        {/* Combined Quick Symptom Input & Additional Details */}
                        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Describe Your Symptoms & Additional Details
                            </h2>
                            <div className="space-y-4">
                                {/* Textarea for main description */}
                                <div>
                                    <label htmlFor="symptom-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        How are you feeling? *
                                    </label>
                                    <textarea
                                        id="symptom-input"
                                        value={symptomData.description}
                                        onChange={(e) => setSymptomData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Example: I've been drinking water but I'm still feeling dizzy and have a headache..."
                                        className={`w-full ${FONT_SIZES[settings.fontSize]} px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                        rows={4}
                                        maxLength={500}
                                        required
                                        aria-describedby="symptom-help"
                                    />
                                    <div className="flex justify-between mt-1">
                                        <p id="symptom-help" className="text-xs text-gray-500 dark:text-gray-400">
                                            Be as specific as possible about what you're experiencing
                                        </p>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {symptomData.description.length}/500
                                        </span>
                                    </div>
                                </div>

                                {/* SymptomForm for additional details */}
                                <SymptomForm
                                    data={symptomData}
                                    onChange={setSymptomData}
                                    fontSize={settings.fontSize}
                                />

                                {/* Check Symptoms Button */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading || !symptomData.description.trim()}
                                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed"
                                    aria-describedby="submit-help"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <Loader className="animate-spin h-4 w-4" aria-hidden="true" />
                                            <span>Analyzing Symptoms...</span>
                                        </div>
                                    ) : (
                                        'Check Symptoms'
                                    )}
                                </button>
                                <p id="submit-help" className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                    Press Ctrl+Enter to submit quickly
                                </p>
                            </div>
                        </section>

                    </div>

                    {/* Right Column - Results Section */}
                    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Health Suggestions
                            </h2>

                            {localSuggestions && ( // Changed from aiResponse to localSuggestions
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleSpeakResponse}
                                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                                        title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                                        aria-label={isSpeaking ? 'Stop reading suggestions aloud' : 'Read suggestions aloud'}
                                    >
                                        {isSpeaking ? (
                                            <VolumeX className="w-4 h-4" aria-hidden="true" />
                                        ) : (
                                            <Volume2 className="w-4 h-4" aria-hidden="true" />
                                        )}
                                    </button>
                                    <button
                                        onClick={handleCopy}
                                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                                        title={copySuccess ? 'Copied!' : 'Copy to clipboard'}
                                        aria-label={copySuccess ? 'Copied to clipboard' : 'Copy suggestions to clipboard'}
                                    >
                                        <Copy className={`w-4 h-4 ${copySuccess ? 'text-green-600' : ''}`} aria-hidden="true" />
                                    </button>
                                    <button
                                        onClick={handleDownload}
                                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                                        title="Download analysis"
                                        aria-label="Download symptom analysis as text file"
                                    >
                                        <Download className="w-4 h-4" aria-hidden="true" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Loader className="w-8 h-8 text-blue-600 animate-spin mb-4" aria-hidden="true" />
                                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                                    Analyzing Your Symptoms
                                </h3>
                                <p className="text-gray-500 dark:text-gray-500 max-w-sm">
                                    Please wait while we analyze your symptoms and provide helpful suggestions...
                                </p>
                            </div>
                        ) : localSuggestions ? ( // Changed from aiResponse to localSuggestions
                            <div className="space-y-4">
                                <div className="prose dark:prose-invert max-w-none">
                                    <div className={`${FONT_SIZES[settings.fontSize]} text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap`}>
                                        {localSuggestions} {/* Changed from aiResponse to localSuggestions */}
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg" role="alert">
                                    <p className="text-sm text-red-800 dark:text-red-200">
                                        <strong>Remember:</strong> These suggestions are for informational purposes only.
                                        If you're experiencing serious symptoms, seek immediate medical attention.
                                        For persistent or concerning symptoms, consult with a healthcare professional.
                                    </p>
                                </div>

                                {copySuccess && (
                                    <div className="text-center">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200">
                                            Suggestions copied to clipboard!
                                        </span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Activity className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" aria-hidden="true" />
                                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                                    Ready to Help
                                </h3>
                                <p className="text-gray-500 dark:text-gray-500 max-w-sm">
                                    Describe your symptoms above to get personalized health suggestions and next steps.
                                </p>
                                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                    <p className="text-xs text-blue-800 dark:text-blue-200">
                                        💡 <strong>Tip:</strong> Be specific about what you're feeling, when it started, and any other symptoms you've noticed.
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
};