import React from 'react';

const InfluentialWordsGraph = ({ words }) => {
  if (!words || !Array.isArray(words) || words.length === 0) {
    return null;
  }

  // Sort by influence percentage descending
  const sortedWords = [...words].sort((a, b) => 
    (b.influence_percentage || 0) - (a.influence_percentage || 0)
  );

  const getInfluenceColor = (level) => {
    const levelLower = (level || '').toLowerCase();
    switch (levelLower) {
      case 'high':
        return '#e74c3c';
      case 'medium':
        return '#f39c12';
      case 'low':
        return '#27ae60';
      default:
        return '#3498db';
    }
  };

  const getInfluenceBgColor = (level) => {
    const levelLower = (level || '').toLowerCase();
    switch (levelLower) {
      case 'high':
        return '#fdeded';
      case 'medium':
        return '#fef9e7';
      case 'low':
        return '#eafaf1';
      default:
        return '#ebf5fb';
    }
  };

  const maxPercentage = Math.max(...sortedWords.map(w => w.influence_percentage || 0), 100);

  return (
    <div className="influential-words-container">
      <div className="influential-words-header">
        <h3>🔑 Key Influential Words</h3>
        <p className="influential-words-subtitle">
          These words had the strongest influence on the model's prediction
        </p>
      </div>

      <div className="words-graph">
        {sortedWords.map((wordData, index) => (
          <div 
            key={index} 
            className="word-bar-container"
            style={{ backgroundColor: getInfluenceBgColor(wordData.influence_level) }}
          >
            <div className="word-info">
              <span className="word-text">{wordData.word}</span>
              <span 
                className="word-level"
                style={{ 
                  color: getInfluenceColor(wordData.influence_level),
                  borderColor: getInfluenceColor(wordData.influence_level)
                }}
              >
                {wordData.influence_level} Influence
              </span>
            </div>
            
            <div className="word-bar-wrapper">
              <div className="word-bar">
                <div 
                  className="word-bar-fill"
                  style={{ 
                    width: `${(wordData.influence_percentage / maxPercentage) * 100}%`,
                    backgroundColor: getInfluenceColor(wordData.influence_level)
                  }}
                />
              </div>
              <span className="word-percentage">
                {wordData.influence_percentage?.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="influence-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#e74c3c' }}></span>
          <span>High Influence</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#f39c12' }}></span>
          <span>Medium Influence</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#27ae60' }}></span>
          <span>Low Influence</span>
        </div>
      </div>
    </div>
  );
};

export default InfluentialWordsGraph;
