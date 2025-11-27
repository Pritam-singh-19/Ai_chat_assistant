import React from "react";
import "../components/styles/confidenceMeter.css";

export default function ConfidenceMeter({ score }) {
  return (
    <div className="confidence-meter">
      <span>Confidence: {score}%</span>
      <div className="meter-bar">
        <div className="fill" style={{ width: `${score}%` }}></div>
      </div>
    </div>
  );
}
