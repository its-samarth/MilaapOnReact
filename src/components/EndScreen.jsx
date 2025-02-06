// src/components/EndScreen.jsx
import React, { useEffect, useState, useRef } from 'react';
import './EndScreen.css';

export default function EndScreen({ score, gameOutcome, currentLevel, onRestart, onRetry }) {
  const [allScores, setAllScores] = useState([]);
  const [highestScore, setHighestScore] = useState(0);
  const scoreSaved = useRef(false);

  useEffect(() => {
    if (!scoreSaved.current) {
      const savedScores = JSON.parse(localStorage.getItem('allScores')) || [];
      const updatedScores = [...savedScores, score];
      localStorage.setItem('allScores', JSON.stringify(updatedScores));
      setAllScores(updatedScores);
      scoreSaved.current = true;
    }
  }, [score]);

  useEffect(() => {
    if (allScores.length > 0) {
      const maxScore = Math.max(...allScores);
      setHighestScore(maxScore);
    }
  }, [allScores]);

  return (
    <div className="end-screen">
      <h2 className="end-title">Quiz Finished!</h2>
      <p className="total-score">Total Score: <span>{score}</span></p>
      <p className="highest-score">Highest Score: <span>{highestScore}</span></p>

      <div className={`outcome-message ${gameOutcome}`}>
        {gameOutcome === 'completed' ? (
          <>
            <h3>Congratulations! 🎉</h3>
            <p>You've successfully completed all levels!</p>
          </>
        ) : (
          <>
            <h3>Try Again! 💪</h3>
            <p>You didn't pass the {currentLevel} level.</p>
          </>
        )}
      </div>

      <div className="button-group">
        {gameOutcome === 'failed' && (
          <button className="retry-button" onClick={onRetry}>Retry {currentLevel} Level</button>
        )}
        <button className="restart-button" onClick={onRestart}>
          {gameOutcome === 'completed' ? 'Play Again' : 'Restart Quiz'}
        </button>
      </div>

      <div className="score-history">
        <h3>Score History</h3>
        <ul>
          {allScores.map((s, index) => (
            <li key={index}>Attempt {index + 1}: {s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}