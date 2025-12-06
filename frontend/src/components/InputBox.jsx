import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ResultBox from './ResultBox';
import ExplanationBox from './ExplanationBox';
import '../App.css';

const InputBox = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confidence, setConfidence] = useState(null);
  
  // Remove unused user variable or use it
  // Option 1: Remove it (if not using it)
  // Option 2: Keep it for future use with comment
  const { user } = useAuth(); // Will be used for API authentication

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      alert('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setResult(null);
    setExplanation(null);
    setConfidence(null);

    try {
      // Simulate API call with mock data
      const mockData = await simulateAPICall(text);
      
      setResult(mockData.result);
      setExplanation(mockData.explanation);
      setConfidence(mockData.confidence);
      
    } catch (error) {
      console.error('Error detecting fake news:', error);
      setResult('Error');
      setExplanation('An error occurred while processing your request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Mock API simulation
  const simulateAPICall = async (inputText) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple mock detection logic
    const keywords = {
      fake: ['breaking', 'shocking', 'exposed', 'secret', 'urgent', 'must read', 'you won\'t believe'],
      real: ['according to', 'sources say', 'research shows', 'study finds', 'official statement']
    };
    
    const textLower = inputText.toLowerCase();
    let fakeCount = 0;
    let realCount = 0;
    
    keywords.fake.forEach(word => {
      if (textLower.includes(word)) fakeCount++;
    });
    
    keywords.real.forEach(word => {
      if (textLower.includes(word)) realCount++;
    });
    
    const total = fakeCount + realCount;
    const fakeProbability = total > 0 ? (fakeCount / total) * 100 : 50;
    
    if (fakeProbability > 70) {
      return {
        result: 'Fake News',
        explanation: 'The text contains several sensationalist keywords commonly found in misleading content. It shows characteristics of clickbait or exaggerated claims.',
        confidence: Math.round(fakeProbability)
      };
    } else if (fakeProbability < 30) {
      return {
        result: 'Real News',
        explanation: 'The text appears to be from credible sources with factual reporting language. It lacks common sensationalist markers.',
        confidence: Math.round(100 - fakeProbability)
      };
    } else {
      return {
        result: 'Unverified',
        explanation: 'The content shows mixed signals. Some elements suggest credibility while others raise concerns. Further verification from multiple sources is recommended.',
        confidence: Math.round(100 - Math.abs(50 - fakeProbability) * 2)
      };
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setExplanation(null);
    setConfidence(null);
  };

  return (
    <div className="input-box-container">
      <div className="input-header">
        <h2>📰 Fake News Detection System</h2>
        <p className="subtitle">
          Enter news article or statement to analyze its authenticity using AI-powered ensemble methods
        </p>
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <div className="text-area-container">
          <label htmlFor="news-text" className="input-label">
            News Text:
          </label>
          <textarea
            id="news-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste news article or statement here..."
            rows={10}
            className="news-textarea"
            disabled={loading}
          />
          <div className="char-count">
            {text.length} characters
          </div>
        </div>

        <div className="button-group">
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="analyze-btn"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              '🔍 Analyze News'
            )}
          </button>
          
          <button
            type="button"
            onClick={handleClear}
            className="clear-btn"
            disabled={loading}
          >
            🗑️ Clear
          </button>
        </div>
      </form>

      {result && <ResultBox result={result} confidence={confidence} />}
      {explanation && <ExplanationBox explanation={explanation} />}
    </div>
  );
};

export default InputBox;