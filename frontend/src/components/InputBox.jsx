import React, { useState } from 'react';
import ResultBox from './ResultBox';
import ExplanationBox from './ExplanationBox';
import { analyzeNews } from '../services/predictionService';
import '../App.css';

const InputBox = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confidence, setConfidence] = useState(null);
  const [confidenceLevel, setConfidenceLevel] = useState(null);
  const [keyInfluentialWords, setKeyInfluentialWords] = useState(null);
  const [analysisId, setAnalysisId] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  
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
    setAnalysisId(null);
    setTimestamp(null);

    try {
      // Call the real ML backend API
      const data = await analyzeNews(text);
      
      setResult(data.prediction);
      setExplanation(data.explanation_note);
      setConfidence(data.confidence_percentage);
      setConfidenceLevel(data.confidence_level);
      setKeyInfluentialWords(data.key_influential_words);
      setAnalysisId(data.analysisId);
      setTimestamp(data.timestamp);
      
    } catch (error) {
      console.error('Error detecting fake news:', error);
      setResult('Error');
      setExplanation(error.message || 'An error occurred while processing your request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setExplanation(null);
    setConfidence(null);
    setConfidenceLevel(null);
    setKeyInfluentialWords(null);
    setAnalysisId(null);
    setTimestamp(null);
  };

  return (
    <div className="input-box-container">
      <div className="input-header">
        <h2>📰 Fake News Detection System</h2>
        <p className="subtitle">
          Enter news article to analyze its authenticity based on its written pattern using robust mechanism
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

      {result && <ResultBox result={result} confidence={confidence} confidenceLevel={confidenceLevel} keyInfluentialWords={keyInfluentialWords} analysisId={analysisId} timestamp={timestamp} />}
      {explanation && <ExplanationBox explanation={explanation} confidence={confidence} keyInfluentialWords={keyInfluentialWords} explanationData={{ key_influential_words: keyInfluentialWords }} />}
    </div>
  );
};

export default InputBox;