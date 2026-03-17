import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ResultBox from './ResultBox';
import ExplanationBox from './ExplanationBox';
import InfluentialWordsGraph from './InfluentialWordsGraph';
import '../App.css';

const InputBox = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confidence, setConfidence] = useState(null);
  const [confidenceLevel, setConfidenceLevel] = useState(null);
  const [keyInfluentialWords, setKeyInfluentialWords] = useState(null);
  
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
    setConfidenceLevel(null);
    setKeyInfluentialWords(null);

    try {
      // Simulate API call with mock data (matching new JSON structure)
      const mockData = await simulateAPICall(text);
      
      setResult(mockData.prediction);
      setExplanation(mockData.explanation_note);
      setConfidence(mockData.confidence_percentage);
      setConfidenceLevel(mockData.confidence_level);
      setKeyInfluentialWords(mockData.key_influential_words);
      
    } catch (error) {
      console.error('Error detecting fake news:', error);
      setResult('Error');
      setExplanation('An error occurred while processing your request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Mock API simulation - returns new JSON structure matching backend
  const simulateAPICall = async (inputText) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple mock detection logic
    const keywords = {
      fake: ['breaking', 'shocking', 'exposed', 'secret', 'urgent', 'must read', 'you won\'t believe', 'government', 'announces', 'tax'],
      real: ['according to', 'sources say', 'research shows', 'study finds', 'official statement', 'confirmed', 'verified']
    };
    
    const textLower = inputText.toLowerCase();
    let fakeCount = 0;
    let realCount = 0;
    let detectedFakeWords = [];
    let detectedRealWords = [];
    
    keywords.fake.forEach(word => {
      if (textLower.includes(word)) {
        fakeCount++;
        detectedFakeWords.push(word);
      }
    });
    
    keywords.real.forEach(word => {
      if (textLower.includes(word)) {
        realCount++;
        detectedRealWords.push(word);
      }
    });
    
    const total = fakeCount + realCount;
    const fakeProbability = total > 0 ? (fakeCount / total) * 100 : 50;
    
    // Generate mock influential words based on detected keywords
    const generateInfluentialWords = (fakeWords, realWords, isFake) => {
      const words = [];
      const baseWords = isFake ? fakeWords : realWords;
      
      // Add detected keywords with high influence
      baseWords.forEach((word, idx) => {
        words.push({
          word: word,
          influence_percentage: 25 - (idx * 3),
          influence_level: idx < 2 ? 'High' : 'Medium'
        });
      });
      
      // Always add some default words to ensure chart displays
      if (words.length === 0) {
        words.push({
          word: isFake ? 'claim' : 'source',
          influence_percentage: 15,
          influence_level: 'Medium'
        });
        words.push({
          word: isFake ? 'report' : 'official',
          influence_percentage: 10,
          influence_level: 'Low'
        });
      } else {
        // Add some additional context words
        words.push({
          word: 'news',
          influence_percentage: 8,
          influence_level: 'Low'
        });
        words.push({
          word: 'report',
          influence_percentage: 5,
          influence_level: 'Low'
        });
      }
      
      return words.slice(0, 5);
    };
    
    if (fakeProbability > 70) {
      return {
        prediction: 'Fake',
        confidence_percentage: Math.round(fakeProbability * 0.8 + Math.random() * 20),
        confidence_level: 'Medium confidence. Some indicators suggest potential misinformation.',
        key_influential_words: generateInfluentialWords(detectedFakeWords, detectedRealWords, true),
        explanation_note: 'Highlighted words influenced the model\'s decision more strongly than other words in the article.'
      };
    } else if (fakeProbability < 30) {
      return {
        prediction: 'Real',
        confidence_percentage: Math.round((100 - fakeProbability) * 0.8 + Math.random() * 20),
        confidence_level: 'High confidence. Content shows characteristics of credible journalism.',
        key_influential_words: generateInfluentialWords(detectedFakeWords, detectedRealWords, false),
        explanation_note: 'Highlighted words influenced the model\'s decision more strongly than other words in the article.'
      };
    } else {
      return {
        prediction: 'Unverified',
        confidence_percentage: Math.round(50 + Math.random() * 20),
        confidence_level: 'Low confidence prediction. Input may belong to a different domain or be ambiguous.',
        key_influential_words: generateInfluentialWords(detectedFakeWords, detectedRealWords, fakeProbability > 50),
        explanation_note: 'Highlighted words influenced the model\'s decision more strongly than other words in the article.'
      };
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setExplanation(null);
    setConfidence(null);
    setConfidenceLevel(null);
    setKeyInfluentialWords(null);
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

      {result && <ResultBox result={result} confidence={confidence} confidenceLevel={confidenceLevel} keyInfluentialWords={keyInfluentialWords} />}
      {explanation && <ExplanationBox explanation={explanation} confidence={confidence} keyInfluentialWords={keyInfluentialWords} explanationData={{ key_influential_words: keyInfluentialWords }} />}
      {keyInfluentialWords && <InfluentialWordsGraph words={keyInfluentialWords} />}
    </div>
  );
};

export default InputBox;