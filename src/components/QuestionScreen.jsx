import { useState, useEffect } from "react";
import "./QuestionScreen.css";
export default function QuestionScreen({
  question,
  onSubmitAnswer,
  onContinue,
  feedback,
  currentLevel,
}) {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  

  useEffect(() => {
    if (feedback) return;
  
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          // Capture current answer state immediately
          const currentAnswer = question.type === "text-input" ? textAnswer : selectedAnswer;
          setTimeout(() => {
            handleSubmit(currentAnswer); // Pass the captured answer from the timer
          }, 0);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  
    return () => clearInterval(timer);
  }, [feedback, question, textAnswer, selectedAnswer]);
  // Reset all states when question changes
  useEffect(() => {
    setTimeLeft(20);
    setSelectedAnswer("");
    setTextAnswer("");
    }, [question]);

    const handleSubmit = (forcedAnswer) => {
      let isCorrect = false;
      // Use forcedAnswer if provided (from timer), otherwise use current state
      
      const answer = forcedAnswer?.target?.value ?? forcedAnswer ?? (question.type === "text-input" ? textAnswer : selectedAnswer);  
      console.log("Submitting answer:", {
        givenAnswer: answer,
        correctAnswer: question.correctAnswer,
        questionType: question.type
      });  
      switch (question.type) {
        case "multiple-choice":
        case "true-false":
          isCorrect = String(answer).toLowerCase() === String(question.correctAnswer).toLowerCase();
          break;
        case "text-input":
          isCorrect = answer.trim().toLowerCase() === question.correctAnswer.toLowerCase().trim();
          break;
        default:
          isCorrect = false;
      }
      onSubmitAnswer(isCorrect, question.correctAnswer);
    };
    

  if (feedback) {
    return (
      <div
        className={`feedback ${feedback.isCorrect ? "correct" : "incorrect"}`}
      >
        <h3>{feedback.isCorrect ? "Correct! 🎉" : "Incorrect 😞"}</h3>
        <p>Correct answer: {feedback.correctAnswer}</p>
        <button onClick={onContinue}>Continue</button>
      </div>
    );
  }

  return (
    <div className="question-screen">
      <div className="question-header">
  <h2>Question {question.type}</h2>
  <div className="timer-display">
    <div className="timer-bar">
      <div 
        className="timer-progress"
        style={{
          width: `${(timeLeft / 30) * 100}%`,
          backgroundColor: timeLeft <= 10 ? '#ff4444' : '#646cff'
        }}
      />
    </div>
    <span className={`timer-text ${timeLeft <= 10 ? 'warning' : ''}`}>
      {timeLeft}s
    </span>
  </div>
  <span className="level-badge">
    Level: {currentLevel}
  </span>
</div>

      <h3 className="question-text">{question.question}</h3>

      {question.type === "multiple-choice" && (
        <div className="options">
          {question.options.map((option, index) => (
            <label key={index} className="option">
              <input
                type="radio"
                name="answer"
                value={option}
                checked={selectedAnswer === option}
                onChange={(e) => setSelectedAnswer(e.target.value)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}

      {question.type === "true-false" && (
        <div className="options">
          <label className="option">
            <input
              type="radio"
              name="answer"
              value="true"
              checked={selectedAnswer === "true"}
              onChange={(e) => setSelectedAnswer(e.target.value)}
            />
            <span>True</span>
          </label>
          <label className="option">
            <input
              type="radio"
              name="answer"
              value="false"
              checked={selectedAnswer === "false"}
              onChange={(e) => setSelectedAnswer(e.target.value)}
            />
            <span>False</span>
          </label>
        </div>
      )}

      {question.type === "text-input" && (
        <input
          type="text"
          value={textAnswer}
          onChange={(e) => setTextAnswer(e.target.value)}
          placeholder="Type your answer here..."
          autoFocus
        />
      )}

      <button
         onClick={() => handleSubmit()}
        disabled={
          (question.type !== "text-input" && !selectedAnswer) ||
          (question.type === "text-input" && !textAnswer.trim())
        }
      >
        Submit Answer
      </button>
    </div>
  );
}