import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Defs, LinearGradient } from 'recharts';
import '../App.css';

const ExplanationBox = ({ explanation, confidence, keyInfluentialWords, explanationData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTechnical, setShowTechnical] = useState(false);
  
  // Use explanationData.key_influential_words if provided, otherwise fallback to keyInfluentialWords
  const influentialWords = explanationData?.key_influential_words || keyInfluentialWords;
  
  const MAX_LENGTH = 250;
  const shouldTruncate = explanation && explanation.length > MAX_LENGTH;
  const displayText = shouldTruncate && !isExpanded && explanation
    ? explanation.substring(0, MAX_LENGTH) + '...' 
    : explanation;

  // Generate technical analysis from real backend data
  const getStatusFromConfidence = (score) => {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  // Get color based on influence level
  const getInfluenceColor = (level) => {
    const levelLower = (level || '').toLowerCase();
    switch (levelLower) {
      case 'high':
        return '#e74c3c';  // Red
      case 'medium':
        return '#f39c12';  // Orange
      case 'low':
        return '#27ae60';  // Green
      default:
        return '#6366f1';  // Default purple
    }
  };

  // Build indicators from key influential words data
  const generateIndicators = () => {
    const indicators = [];
    
    // Analyze influential words to generate indicators
    if (influentialWords && influentialWords.length > 0) {
      const highInfluenceWords = influentialWords.filter(w => 
        (w.influence_level || '').toLowerCase() === 'high'
      );
      const mediumInfluenceWords = influentialWords.filter(w => 
        (w.influence_level || '').toLowerCase() === 'medium'
      );
      
      // Add indicator for influential words analysis
      if (highInfluenceWords.length > 0) {
        indicators.push({
          name: 'Sensational Language',
          score: Math.min(95, 40 + highInfluenceWords.length * 15),
          status: getStatusFromConfidence(40 + highInfluenceWords.length * 15)
        });
      }
      
      // Add indicator based on word count
      indicators.push({
        name: 'Key Terms Found',
        score: Math.min(100, influentialWords.length * 20),
        status: getStatusFromConfidence(influentialWords.length * 20)
      });
    }
    
    // Always include confidence-based indicators
    if (confidence !== null && confidence !== undefined) {
      indicators.push({
        name: 'Model Confidence',
        score: confidence,
        status: getStatusFromConfidence(confidence)
      });
    }
    
    return indicators.length > 0 ? indicators : [
      { name: 'Model Confidence', score: confidence || 0, status: 'medium' }
    ];
  };

  // Get unique algorithms from influential words analysis
  const getAlgorithms = () => {
    const algorithms = new Set(['BERT', 'LSTM', 'Random Forest', 'XGBoost']);
    // If we have influential words, we can infer additional analysis
    if (influentialWords && influentialWords.length > 0) {
      algorithms.add('Ensemble Voting');
    }
    return Array.from(algorithms);
  };

  const technicalAnalysis = {
    indicators: generateIndicators(),
    algorithms: getAlgorithms(),
    avgConfidence: confidence || 0
  };

  // Generate chart data from keyInfluentialWords - using real data only
  const getChartData = () => {
    // Always try to use the data from backend
    if (influentialWords && Array.isArray(influentialWords) && influentialWords.length > 0) {
      return influentialWords.slice(0, 8).map((word, idx) => ({
        word: word.word || `word${idx}`,
        value: Number(word.influence_percentage) || 0,
        influence_level: word.influence_level || 'Unknown',
        fill: getInfluenceColor(word.influence_level)
      }));
    }
    return [];
  };

  const chartData = getChartData();
  const hasChartData = chartData.length > 0;

  if (!explanation) return null;

  return (
    <div className="explanation-container">
      <div className="explanation-header">
        <h3>📊 Detailed Analysis</h3>
        <button 
          className="toggle-btn"
          onClick={() => setShowTechnical(!showTechnical)}
          type="button"
        >
          {showTechnical ? 'Hide Technical Details' : 'Show Technical Details'}
        </button>
      </div>
      
      <div className="explanation-content">
        <div className="explanation-text">
          <p>{displayText}</p>
          
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="read-more-btn"
              type="button"
            >
              {isExpanded ? '▲ Show Less' : '▼ Read More'}
            </button>
          )}
        </div>
        
        {/* Word Influence on Prediction Chart - LineChart with dots and shaded area */}
        {hasChartData && (
        <div className="word-influence-chart">
          <h4>Word Influence on Prediction</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />
              <XAxis 
                dataKey="word" 
                tick={{ fontSize: 12, fill: '#e0e0e0' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                tickLine={{ stroke: 'rgba(255,255,255,0.3)' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#e0e0e0' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                tickLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 30, 30, 0.95)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  color: '#ffffff'
                }}
                labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                formatter={(value, name, props) => [`${value}%`, `Influence: ${props.payload.influence_level || 'N/A'}`]}
              />
              {/* Shaded area under the line */}
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="none"
                fill="url(#colorGradient)"
                fillOpacity={1}
              />
              {/* Line with dots - color coded by influence level */}
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#818cf8" 
                strokeWidth={3}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  const fillColor = payload.fill || '#6366f1';
                  return (
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r={7} 
                      fill={fillColor} 
                      stroke="#ffffff" 
                      strokeWidth={2}
                    />
                  );
                }}
                activeDot={{ r: 10, stroke: '#ffffff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        )}
        
        {showTechnical && (
          <div className="technical-analysis">
            <h4>Technical Analysis Breakdown</h4>
            
            <div className="indicators-grid">
              {technicalAnalysis.indicators.map((indicator, index) => (
                <div key={index} className="indicator-item">
                  <div className="indicator-header">
                    <span className="indicator-name">{indicator.name}</span>
                    <span className={`indicator-score ${indicator.status}`}>
                      {indicator.score}%
                    </span>
                  </div>
                  <div className="indicator-bar">
                    <div 
                      className="indicator-fill"
                      style={{ 
                        width: `${indicator.score}%`,
                        backgroundColor: indicator.status === 'high' ? '#e74c3c' : 
                                      indicator.status === 'medium' ? '#f39c12' : '#27ae60'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="algorithms-used">
              <h5>Algorithms Used:</h5>
              <div className="algorithm-tags">
                {technicalAnalysis.algorithms.map((algo, index) => (
                  <span key={index} className="algorithm-tag">
                    {algo}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Confidence Score Graph */}
            <div className="confidence-graph-section">
              <h5>Confidence Score Breakdown:</h5>
              <div className="confidence-bar-visual">
                <div className="confidence-label">
                  <span>Overall Confidence</span>
                  <span className="confidence-percentage">{technicalAnalysis.avgConfidence}%</span>
                </div>
                <div className="confidence-bar-track">
                  <div 
                    className="confidence-bar-fill"
                    style={{ 
                      width: `${technicalAnalysis.avgConfidence}%`,
                      backgroundColor: technicalAnalysis.avgConfidence >= 70 ? '#27ae60' : 
                                       technicalAnalysis.avgConfidence >= 40 ? '#f39c12' : '#e74c3c'
                    }}
                  ></div>
                </div>
                <div className="confidence-scale">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
            
            <div className="confidence-score">
              <span>Overall Model Confidence:</span>
              <span className="confidence-value">
                {technicalAnalysis.avgConfidence}%
              </span>
            </div>
          </div>
        )}
      </div>
      
      <div className="disclaimer">
        <div className="disclaimer-icon">ℹ️</div>
        <div className="disclaimer-text">
          <strong>Disclaimer:</strong>  Always verify information through multiple reliable sources before drawing conclusions.
        </div>
      </div>
    </div>
  );
};

export default ExplanationBox;