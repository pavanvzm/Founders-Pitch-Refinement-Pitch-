import React, { useState, useEffect } from 'react';
import { ChevronRight, Target, Users, TrendingUp, Lightbulb, AlertCircle, CheckCircle, Star } from 'lucide-react';

const PitchRefiner = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [pitchData, setPitchData] = useState({
    problem: '',
    solution: '',
    targetMarket: '',
    traction: ''
  });
  const [generatedPitch, setGeneratedPitch] = useState('');
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const steps = [
    {
      key: 'problem',
      title: 'The Problem',
      icon: AlertCircle,
      placeholder: 'What specific problem are you solving? Be concrete and relatable.',
      question: 'What pain point does your startup address?'
    },
    {
      key: 'solution',
      title: 'Your Solution',
      icon: Lightbulb,
      placeholder: 'How do you solve this problem uniquely? What makes you different?',
      question: 'How does your product/service solve this problem?'
    },
    {
      key: 'targetMarket',
      title: 'Target Market',
      icon: Users,
      placeholder: 'Who are your customers? Be specific about demographics and size.',
      question: 'Who is your ideal customer?'
    },
    {
      key: 'traction',
      title: 'Traction & Proof',
      icon: TrendingUp,
      placeholder: 'What validates your success? Users, revenue, partnerships, etc.',
      question: 'What traction or validation do you have?'
    }
  ];

  const handleInputChange = (value) => {
    setPitchData(prev => ({
      ...prev,
      [steps[currentStep].key]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generatePitch();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateConfidenceScore = (data) => {
    let score = 0;
    const weights = { problem: 25, solution: 30, targetMarket: 20, traction: 25 };
    
    Object.entries(data).forEach(([key, value]) => {
      const length = value.trim().length;
      if (length > 0) {
        // Score based on content quality indicators
        let fieldScore = Math.min(100, (length / 100) * 100); // Base on length
        
        // Bonus points for specific keywords/patterns
        if (key === 'problem' && (value.includes('struggle') || value.includes('pain') || value.includes('frustrat'))) {
          fieldScore += 10;
        }
        if (key === 'solution' && (value.includes('unique') || value.includes('innovative') || value.includes('patent'))) {
          fieldScore += 10;
        }
        if (key === 'targetMarket' && /\d/.test(value)) { // Contains numbers
          fieldScore += 15;
        }
        if (key === 'traction' && (/\$|revenue|customer|user/i.test(value))) {
          fieldScore += 15;
        }
        
        score += (fieldScore / 100) * weights[key];
      }
    });
    
    return Math.round(score);
  };

  const generateSuggestions = (data, score) => {
    const suggestions = [];
    
    if (data.problem.length < 50) {
      suggestions.push({
        type: 'improvement',
        text: 'Make your problem statement more specific and emotionally resonant.'
      });
    }
    
    if (data.solution.length < 50) {
      suggestions.push({
        type: 'improvement',
        text: 'Elaborate on what makes your solution unique or different from competitors.'
      });
    }
    
    if (!(/\d/.test(data.targetMarket))) {
      suggestions.push({
        type: 'improvement',
        text: 'Include specific market size or customer demographics with numbers.'
      });
    }
    
    if (!(/\$|revenue|customer|user|growth/i.test(data.traction))) {
      suggestions.push({
        type: 'improvement',
        text: 'Add concrete metrics like revenue, user count, or growth percentage.'
      });
    }

    if (score >= 80) {
      suggestions.push({
        type: 'success',
        text: 'Excellent pitch foundation! Practice delivery and timing for maximum impact.'
      });
    } else if (score >= 60) {
      suggestions.push({
        type: 'good',
        text: 'Good foundation! Focus on making your value proposition more compelling.'
      });
    } else {
      suggestions.push({
        type: 'improvement',
        text: 'Consider adding more specific details and quantifiable metrics to strengthen your pitch.'
      });
    }
    
    return suggestions;
  };

  const generatePitch = () => {
    const { problem, solution, targetMarket, traction } = pitchData;
    
    const pitch = `${problem.trim()} ${solution.trim()} We're targeting ${targetMarket.trim()}, and we've already achieved ${traction.trim()}. This positions us to capture significant market share in this growing space.`;
    
    // Clean up and optimize the pitch
    const optimizedPitch = pitch
      .replace(/\s+/g, ' ')
      .replace(/([.!?])\s*([A-Z])/g, '$1 $2')
      .trim();
    
    const score = calculateConfidenceScore(pitchData);
    const newSuggestions = generateSuggestions(pitchData, score);
    
    setGeneratedPitch(optimizedPitch);
    setConfidenceScore(score);
    setSuggestions(newSuggestions);
    setShowResults(true);
  };

  const resetApp = () => {
    setCurrentStep(0);
    setPitchData({
      problem: '',
      solution: '',
      targetMarket: '',
      traction: ''
    });
    setGeneratedPitch('');
    setConfidenceScore(0);
    setSuggestions([]);
    setShowResults(false);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your 30-Second Pitch</h1>
          <p className="text-gray-600">Refined and ready for investors</p>
        </div>

        {/* Generated Pitch */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Star className="mr-2 text-blue-600" size={24} />
            Your Optimized Pitch
          </h2>
          <p className="text-lg leading-relaxed text-gray-800 italic">
            "{generatedPitch}"
          </p>
          <div className="mt-4 text-sm text-gray-600">
            Word count: {generatedPitch.split(' ').length} words • 
            Estimated speaking time: {Math.ceil(generatedPitch.split(' ').length / 2.5)} seconds
          </div>
        </div>

        {/* Confidence Score */}
        <div className={`rounded-lg p-6 mb-8 ${getScoreBg(confidenceScore)}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Confidence Score</h3>
              <p className="text-gray-600">Based on clarity, specificity, and completeness</p>
            </div>
            <div className={`text-4xl font-bold ${getScoreColor(confidenceScore)}`}>
              {confidenceScore}%
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="bg-white border rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Improvement Suggestions</h3>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start space-x-3">
                {suggestion.type === 'success' ? (
                  <CheckCircle className="text-green-500 mt-1" size={20} />
                ) : suggestion.type === 'good' ? (
                  <Target className="text-yellow-500 mt-1" size={20} />
                ) : (
                  <AlertCircle className="text-blue-500 mt-1" size={20} />
                )}
                <p className="text-gray-700">{suggestion.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-4">
          <button
            onClick={resetApp}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Create New Pitch
          </button>
          <button
            onClick={() => {
              const element = document.createElement('textarea');
              element.value = generatedPitch;
              document.body.appendChild(element);
              element.select();
              document.execCommand('copy');
              document.body.removeChild(element);
              alert('Pitch copied to clipboard!');
            }}
            className="bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Copy Pitch
          </button>
        </div>
      </div>
    );
  }

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;
  const isLastStep = currentStep === steps.length - 1;
  const canProceed = pitchData[currentStepData.key].trim().length > 0;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">30-Second Pitch Refiner</h1>
        <p className="text-gray-600">Craft a compelling investor pitch in four simple steps</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</span>
          <span className="text-sm text-gray-500">{Math.round(((currentStep + 1) / steps.length) * 100)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Current Step */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <Icon className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{currentStepData.title}</h2>
            <p className="text-gray-600">{currentStepData.question}</p>
          </div>
        </div>

        <div className="mb-6">
          <textarea
            value={pitchData[currentStepData.key]}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={currentStepData.placeholder}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={4}
          />
          <div className="mt-2 text-sm text-gray-500">
            {pitchData[currentStepData.key].length} characters
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-6 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          
          <button
            onClick={nextStep}
            disabled={!canProceed}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center transition-colors"
          >
            {isLastStep ? 'Generate Pitch' : 'Next'}
            <ChevronRight className="ml-1" size={16} />
          </button>
        </div>
      </div>

      {/* Step Overview */}
      <div className="mt-8 grid grid-cols-4 gap-4">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isCompleted = pitchData[step.key].trim().length > 0;
          const isCurrent = index === currentStep;
          
          return (
            <div
              key={step.key}
              className={`p-4 rounded-lg border text-center cursor-pointer transition-colors ${
                isCurrent 
                  ? 'border-blue-500 bg-blue-50' 
                  : isCompleted 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
              }`}
              onClick={() => setCurrentStep(index)}
            >
              <StepIcon 
                className={`mx-auto mb-2 ${
                  isCurrent 
                    ? 'text-blue-600' 
                    : isCompleted 
                      ? 'text-green-600' 
                      : 'text-gray-400'
                }`} 
                size={20} 
              />
              <div className={`text-sm font-medium ${
                isCurrent 
                  ? 'text-blue-900' 
                  : isCompleted 
                    ? 'text-green-900' 
                    : 'text-gray-500'
              }`}>
                {step.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PitchRefiner;