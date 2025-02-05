// components/StartScreen.jsx
export default function StartScreen({ onStart }) {
    return (
      <div className="start-screen">
        <h1>Welcome to the Quiz!</h1>
        <button onClick={onStart}>Start Quiz</button>
      </div>
    )
  }