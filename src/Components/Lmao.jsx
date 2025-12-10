import React, { useState } from 'react';
const GEMINI_API_KEY = import.meta.env.GEMINI_API_KEY;

const Lmao = () => {
  const [topic, setTopic] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [priorKnowledge, setPriorKnowledge] = useState('beginner');
  const [depth, setDepth] = useState('overview');
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);

  const generateRoadmap = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const prompt = `
        Create a personalized learning roadmap with the following parameters:
        
        Topic: ${topic}
        Time Limit: ${timeLimit}
        Prior Knowledge Level: ${priorKnowledge}
        Desired Depth: ${depth}
        
        Please format your response as follows:
        
        # LEARNING ROADMAP: ${topic.toUpperCase()}
        
        ## TECHNOLOGIES AND TOPICS
        (List all technologies and topics to learn with estimated time allocation for each)
        
        ## STEP-BY-STEP GUIDE
        (Provide a detailed timeline and sequence of learning activities to complete within the ${timeLimit} timeframe)
        
        ## ADDITIONAL RESOURCES AND RECOMMENDATIONS
        (Include any relevant information, tips, or resources that would be helpful)
      `;
      
      
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048
          }
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Error generating roadmap');
      }
      
      const roadmapText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!roadmapText) {
        throw new Error('No roadmap was generated');
      }
      
      setRoadmap(roadmapText);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to generate roadmap');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 4) {
      generateRoadmap();
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const isStepComplete = () => {
    switch (step) {
      case 1:
        return topic.trim() !== '';
      case 2:
        return timeLimit.trim() !== '';
      case 3:
        return true; 
      case 4:
        return true; 
      default:
        return false;
    }
  };

  
  const processMarkdownLine = (line, index) => {
  
    if (line.startsWith('# ')) {
      return <h1 key={index} className="text-3xl font-bold mt-8 mb-6 text-gray-900">{line.substring(2)}</h1>;
    } else if (line.startsWith('## ')) {
      return <h2 key={index} className="text-2xl font-semibold mt-6 mb-4 text-gray-800 border-b border-gray-200 pb-2">{line.substring(3)}</h2>;
    } else if (line.startsWith('### ')) {
      return <h3 key={index} className="text-xl font-semibold mt-5 mb-3 text-indigo-600">{line.substring(4)}</h3>;
    } else if (line.trim() === '') {
      return <br key={index} />;
    } else if (line.trim().startsWith('* ')) {
    
      const content = line.trim().substring(2);
      return (
        <div key={index} className="flex mb-2">
          <div className="mr-2 text-indigo-500">•</div>
          <div className="text-gray-700">{processInlineFormatting(content)}</div>
        </div>
      );
    } else {
     
      return <p key={index} className="mb-3 text-gray-600 leading-relaxed">{processInlineFormatting(line)}</p>;
    }
  };

  const processInlineFormatting = (text) => {
  
    const parts = [];
    let currentIndex = 0;
    let boldRegex = /\*\*(.*?)\*\*/g;
    let match;

   
    while ((match = boldRegex.exec(text)) !== null) {
      
      if (match.index > currentIndex) {
        parts.push({
          text: text.substring(currentIndex, match.index),
          bold: false
        });
      }
      
      
      parts.push({
        text: match[1],
        bold: true
      });
      
      currentIndex = match.index + match[0].length;
    }
  
    if (currentIndex < text.length) {
      parts.push({
        text: text.substring(currentIndex),
        bold: false
      });
    }
  
    if (parts.length === 0) {
      return text;
    }
  
    return parts.map((part, i) => 
      part.bold ? 
        <span key={i} className="font-semibold text-gray-900">{part.text}</span> : 
        <span key={i}>{part.text}</span>
    );
  };

  const renderStep = () => {
    const inputClasses = "mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border";
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
    const cardClasses = "bg-white p-6 rounded-lg shadow-sm border border-gray-200";

    switch (step) {
      case 1:
        return (
          <div className={cardClasses}>
            <h2 className="text-lg font-medium mb-4 text-gray-900">Choose Your Topic</h2>
            <div className="mb-4">
              <label className={labelClasses}>
                What topic do you want to learn?
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className={inputClasses}
                placeholder="e.g., React, Machine Learning, Cyber Security"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className={cardClasses}>
            <h2 className="text-lg font-medium mb-4 text-gray-900">Set Your Timeline</h2>
            <div className="mb-4">
              <label className={labelClasses}>
                What is your time limit?
              </label>
              <input
                type="text"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                className={inputClasses}
                placeholder="e.g., 2 weeks, 3 months, 1 year"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className={cardClasses}>
            <h2 className="text-lg font-medium mb-4 text-gray-900">Experience Level</h2>
            <div className="mb-4">
              <label className={labelClasses}>
                How much prior knowledge do you have?
              </label>
              <select
                value={priorKnowledge}
                onChange={(e) => setPriorKnowledge(e.target.value)}
                className={inputClasses}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        );
      case 4:
        return (
          <div className={cardClasses}>
            <h2 className="text-lg font-medium mb-4 text-gray-900">Learning Depth</h2>
            <div className="mb-4">
              <label className={labelClasses}>
                How much depth do you want to cover?
              </label>
              <select
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                className={inputClasses}
              >
                <option value="overview">Overview (High Level)</option>
                <option value="moderate">Moderate (Standard)</option>
                <option value="in-depth">In-depth (Comprehensive)</option>
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className={`mx-auto w-full ${roadmap ? 'max-w-4xl' : 'max-w-md'}`}>
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
            Learning Roadmap Generator
          </h1>
          <p className="text-sm text-gray-500">
            Create a personalized learning path tailored to your goals.
          </p>
        </div>
        
       
        {!roadmap && (
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-0.5 bg-gray-200 -z-10"></div>
              {[1, 2, 3, 4].map((num) => (
                <div 
                  key={num} 
                  className={`flex flex-col items-center bg-gray-50 px-2 ${step >= num ? 'text-indigo-600' : 'text-gray-400'}`}
                >
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 text-sm font-medium transition-colors duration-200 ${
                      step >= num 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-white border-2 border-gray-300 text-gray-500'
                    }`}
                  >
                    {num}
                  </div>
                  <span className="text-xs font-medium text-gray-500 hidden sm:block">{
                    num === 1 ? "Topic" :
                    num === 2 ? "Timeline" :
                    num === 3 ? "Level" :
                    "Depth"
                  }</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!roadmap && renderStep()}
  
        {!roadmap && (
          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <button
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Back
              </button>
            ) : (
              <div></div> 
            )}
            
            <button
              onClick={nextStep}
              disabled={!isStepComplete() || (step === 4 && loading)}
              className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                isStepComplete() 
                  ? 'bg-indigo-600 hover:bg-indigo-700' 
                  : 'bg-indigo-400 cursor-not-allowed'
              }`}
            >
              {step === 4 
                ? (loading ? 'Generating...' : 'Generate Roadmap') 
                : 'Next'}
            </button>
          </div>
        )}
        
 
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
    
        {roadmap && (
          <div className="mt-8 animate-fade-in">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-indigo-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">
                  Your Personalized Roadmap
                </h2>
              </div>
              <div className="p-8">
                <div className="prose prose-indigo max-w-none">
                  {roadmap.split('\n').map((line, index) => processMarkdownLine(line, index))}
                </div>
                <div className="mt-10 pt-6 border-t border-gray-100 flex justify-center">
                  <button
                    onClick={() => {
                      setRoadmap(null);
                      setStep(1);
                    }}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    Create New Roadmap
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lmao;
