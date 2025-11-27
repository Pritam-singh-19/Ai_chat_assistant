import React from "react";
import "../components/styles/voiceRecorder.css";

export default function VoiceRecorder({ onRecord, isRecording }) {
  return (
    <button 
      className={`mic-btn ${isRecording ? 'recording' : ''}`} 
      onClick={onRecord}
      title={isRecording ? "Stop recording" : "Start voice recording"}
    >
      {isRecording ? '⏹️' : '🎤'}
    </button>
  );
}
