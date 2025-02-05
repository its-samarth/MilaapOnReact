// components/LevelTransition.jsx
export default function LevelTransition({ currentLevel, nextLevel, onProceed }) {
    return (
      <div className="level-transition">
        <h2>Level Complete! 🚀</h2>
        <p>You've successfully completed the {currentLevel} level!</p>
        <p>Next up: {nextLevel} level</p>
        <button onClick={onProceed}>Continue to {nextLevel} Level</button>
      </div>
    )
  }