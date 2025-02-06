import { useState, useEffect, useRef } from "react";
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
  const currentAnswerRef = useRef("");

  // Timer effect
  useEffect(() => {
    if (feedback) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmit(currentAnswerRef.current); // Use the current answer from ref
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [feedback, question]); // Only depend on feedback and question

  // Current answer effect
  useEffect(() => {
    currentAnswerRef.current = question.type === "text-input" ? textAnswer : selectedAnswer;
  }, [textAnswer, selectedAnswer, question.type]); // Update ref on answer change

  const handleSubmit = (forcedAnswer = null) => {
    let isCorrect = false;
    const answer = forcedAnswer !== null ? forcedAnswer : currentAnswerRef.current;

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
        const cleanAnswer = String(answer || "").trim().toLowerCase();
        const cleanCorrectAnswer = String(question.correctAnswer || "").trim().toLowerCase();
        isCorrect = cleanAnswer === cleanCorrectAnswer;
        break;
      default:
        isCorrect = false;
    }

    onSubmitAnswer(isCorrect, question.correctAnswer);
  };

  // Reset answers when question changes
  useEffect(() => {
    setTimeLeft(30);
    setSelectedAnswer("");
    setTextAnswer("");
  }, [question]);

  if (feedback) {
    return (
      <div className={`feedback ${feedback.isCorrect ? "correct" : "incorrect"}`}>
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