// components/EndScreen.jsx
export default function EndScreen({ score, gameOutcome, currentLevel, onRestart, onRetry }) {
    return (
      <div className="end-screen">
        <h2>Quiz Finished!</h2>
        <p className="total-score">Total Score: {score}</p>
  
        {gameOutcome === 'completed' && (
          <div className="outcome-message success">
            <h3>Congratulations! 🎉</h3>
            <p>You've successfully completed all levels!</p>
          </div>
        )}
  
        {gameOutcome === 'failed' && (
          <div className="outcome-message warning">
            <h3>Try Again! 💪</h3>
            <p>You didn't pass the {currentLevel} level.</p>
            <div className="button-group">
              <button onClick={onRetry}>Retry {currentLevel} Level</button>
              <button onClick={onRestart}>Restart Quiz</button>
            </div>
          </div>
        )}
  
        {gameOutcome === 'completed' && (
          <button onClick={onRestart}>Play Again</button>
        )}
      </div>
    )
  }