import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../App.css';

const ResultBox = ({ result, confidence, confidenceLevel, keyInfluentialWords, analysisId, timestamp }) => {
  const getResultDetails = () => {
    if (!result) return null;
    
    const resultLower = result.toLowerCase();
    
    if (resultLower.includes('fake')) {
      return {
        icon: '',
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

  // Generate chart data from keyInfluentialWords - Real data from backend
  const getChartData = () => {
    // Always try to use the data from backend
    if (keyInfluentialWords && Array.isArray(keyInfluentialWords) && keyInfluentialWords.length > 0) {
      return keyInfluentialWords.slice(0, 8).map((word, idx) => ({
        word: word.word || `word${idx}`,
        value: Number(word.influence_percentage) || 0
      }));
    }
    return [];
  };

  const chartData = getChartData();
  const hasChartData = chartData.length > 0;

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
        
        {confidenceLevel && (
          <div className="result-item confidence-level-item">
            <span className="result-label">Reliability:</span>
            <span className="confidence-level-text">{confidenceLevel}</span>
          </div>
        )}
        
        <div className="result-item">
          <span className="result-label">Analysis ID:</span>
          <span className="result-value">
            {analysisId ? analysisId.toUpperCase() : 'N/A'}
          </span>
        </div>
        
        <div className="result-item">
          <span className="result-label">Timestamp:</span>
          <span className="result-value">
            {timestamp ? new Date(timestamp).toLocaleString() : new Date().toLocaleString()}
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
      
      {/* Word Influence Chart - Using Real Data from Backend */}
      {hasChartData && (
        <div className="result-chart-section">
          <h4>Word Influence on Prediction</h4>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValueResult" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={details.color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={details.color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="word" 
                tick={{ fontSize: 11, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                formatter={(value) => [`${value}%`, 'Influence']}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={details.color} 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorValueResult)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ResultBox;