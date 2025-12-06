import React from 'react';
import '../App.css';

const ResultBox = ({ result, confidence }) => {
  const getResultDetails = () => {
    if (!result) return null;
    
    const resultLower = result.toLowerCase();
    
    if (resultLower.includes('fake')) {
      return {
        icon: '❌',
        title: 'Fake News Detected',
        color: '#e74c3c',
        bgColor: '#fdeded',
        borderColor: '#fadbd8',
        status: 'warning',
        description: 'This content shows strong indicators of misinformation.'
      };
    } else if (resultLower.includes('real')) {
      return {
        icon: '✅',
        title: 'Authentic News',
        color: '#27ae60',
        bgColor: '#eafaf1',
        borderColor: '#d5f5e3',
        status: 'success',
        description: 'This content appears to be from credible sources.'
      };
    } else if (resultLower.includes('error')) {
      return {
        icon: '⚠️',
        title: 'Analysis Error',
        color: '#f39c12',
        bgColor: '#fef9e7',
        borderColor: '#fdebd0',
        status: 'error',
        description: 'Unable to process the request.'
      };
    } else {
      return {
        icon: '🔍',
        title: 'Further Analysis Needed',
        color: '#3498db',
        bgColor: '#ebf5fb',
        borderColor: '#d6eaf8',
        status: 'info',
        description: 'Additional verification is recommended.'
      };
    }
  };

  const details = getResultDetails();

  if (!details) return null;

  return (
    <div className="result-container" style={{
      backgroundColor: details.bgColor,
      borderColor: details.borderColor
    }}>
      <div className="result-header">
        <div className="result-icon" style={{ color: details.color }}>
          {details.icon}
        </div>
        <div className="result-title">
          <h3 style={{ color: details.color }}>{details.title}</h3>
          <p className="result-description">{details.description}</p>
        </div>
      </div>
      
      <div className="result-details">
        <div className="result-item">
          <span className="result-label">Status:</span>
          <span className="result-value" style={{ color: details.color }}>
            {result}
          </span>
        </div>
        
        {confidence !== null && confidence !== undefined && (
          <div className="result-item">
            <span className="result-label">Confidence:</span>
            <div className="confidence-container">
              <div className="confidence-bar">
                <div 
                  className="confidence-fill"
                  style={{
                    width: `${confidence}%`,
                    backgroundColor: details.color
                  }}
                ></div>
              </div>
              <span className="confidence-value">{confidence}%</span>
            </div>
          </div>
        )}
        
        <div className="result-item">
          <span className="result-label">Analysis ID:</span>
          <span className="result-value">
            {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </span>
        </div>
        
        <div className="result-item">
          <span className="result-label">Timestamp:</span>
          <span className="result-value">
            {new Date().toLocaleString()}
          </span>
        </div>
      </div>
      
      <div className="result-footer">
        <div className="recommendation">
          <strong>Recommendation:</strong>
          {details.status === 'success' ? 
            ' You can share this information with reasonable confidence.' :
            details.status === 'warning' ?
            ' Verify from multiple reliable sources before sharing.' :
            ' Exercise caution and cross-verify with trusted news outlets.'}
        </div>
      </div>
    </div>
  );
};

export default ResultBox;