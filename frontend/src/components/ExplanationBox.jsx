import React, { useState } from 'react';
import '../App.css';

const ExplanationBox = ({ explanation, confidence, keyInfluentialWords }) => {

  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="explanation-container">

      <div className="explanation-header">
        <h3>📊 Detailed Analysis</h3>
        <button className="toggle-btn" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {showDetails && (
        <div className="key-words-section">
        <div className="key-words-header">
          {/* <p>{explanation}</p> */}
        <h4>🔑 {explanation}</h4>
        
        </div>

        <div className="words-list">
          {keyInfluentialWords.map((word, index) => (
            <div key={index} className="word-card">

              <div className="word-top">
                <span className="word-name">{word.word}</span>
                <span className="word-percent">{word.influencePercentage}%</span>
              </div>

              <div className="word-bar-container">
                <div
                  className="word-bar-fill"
                  style={{ width: `${Math.max(word.influencePercentage, 2)}%` }}
                ></div>
              </div>

            </div>
          ))}
        </div>

        <div className="confidence-footer">
          Confidence: <span>{confidence}%</span>
        </div>
      </div>

 
      )}

    </div>
  );
};

export default ExplanationBox;