import React from 'react';
import '../App.css';

const formatTimestamp = (raw) => {
  if (!raw) return '—';
  try {
    return new Date(raw).toLocaleString('en-IN', {
      year:   'numeric',
      month:  'short',
      day:    'numeric',
      hour:   '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });
  } catch {
    return raw;
  }
};

const ResultBox = ({ result, confidence, confidenceLevel, analysisId, timestamp }) => {

  const isFake = result.toLowerCase().includes("fake");

  return (
    <div className="result-card">

      {/* HEADER */}
      <div className="result-header">
        <h2 className={isFake ? "fake-title" : "real-title"}>
          {isFake ? "🚨 Fake News Detected" : "✅ Authentic News"}
        </h2>
        <p className="result-subtext">
          {isFake 
            ? "This content seems not to be authentic based on the written pattern of the article"
            : "This content appears to be authentic based on the written pattern of the article"
          }
        </p>
      </div>

      {/* MAIN INFO GRID */}
      <div className="result-grid">

        <div className="result-item">
          <span className="label">Status</span>
          <span className={`value ${isFake ? "fake-text" : "real-text"}`}>
            {result}
          </span>
        </div>

        <div className="result-item">
          <span className="label">Reliability</span>
          <span className="value">{confidenceLevel}</span>
        </div>

        <div className="result-item full-width">
          <span className="label">Confidence</span>

          <div className="confidence-bar-wrapper">
            <div
              className="confidence-bar-fill"
              style={{ width: `${confidence}%` }}
            ></div>
          </div>

          <span className="confidence-value">{confidence}%</span>
        </div>

        <div className="result-item">
          <span className="label">Analysis ID</span>
          <span className="value small">{analysisId}</span>
        </div>

        <div className="result-item">
          <span className="label">Timestamp</span>
          <span className="value small">{formatTimestamp(timestamp)}</span>
        </div>
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

export default ResultBox;