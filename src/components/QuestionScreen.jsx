// components/QuestionScreen.jsx
import { useState } from 'react'

export default function QuestionScreen({ question, onSubmitAnswer, onContinue, feedback }) {
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [textAnswer, setTextAnswer] = useState('')

  const handleSubmit = () => {
    let isCorrect = false
    switch (question.type) {
      case 'multiple-choice':
      case 'true-false':
        isCorrect = selectedAnswer === question.correctAnswer
        break
      case 'text-input':
        isCorrect = textAnswer.trim().toLowerCase() === question.correctAnswer.toLowerCase().trim()
        break
      default:
        isCorrect = false
    }
    onSubmitAnswer(isCorrect, question.correctAnswer)
  }

  if (feedback) {
    return (
      <div className={`feedback ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
        <h3>{feedback.isCorrect ? 'Correct! 🎉' : 'Incorrect 😞'}</h3>
        <p>Correct answer: {feedback.correctAnswer}</p>
        <button onClick={onContinue}>Continue</button>
      </div>
    )
  }

  return (
    <div className="question-screen">
      <div className="question-header">
        <h2>Question {question.type}</h2>
        <p>Level: {question.level}</p>
      </div>
      
      <h3 className="question-text">{question.question}</h3>

      {question.type === 'multiple-choice' && (
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

      {question.type === 'true-false' && (
        <div className="options">
          <label className="option">
            <input
              type="radio"
              name="answer"
              value="true"
              checked={selectedAnswer === 'true'}
              onChange={(e) => setSelectedAnswer(e.target.value)}
            />
            <span>True</span>
          </label>
          <label className="option">
            <input
              type="radio"
              name="answer"
              value="false"
              checked={selectedAnswer === 'false'}
              onChange={(e) => setSelectedAnswer(e.target.value)}
            />
            <span>False</span>
          </label>
        </div>
      )}

      {question.type === 'text-input' && (
        <input
          type="text"
          value={textAnswer}
          onChange={(e) => setTextAnswer(e.target.value)}
          placeholder="Type your answer here..."
        />
      )}

      <button 
        onClick={handleSubmit}
        disabled={
          (question.type !== 'text-input' && !selectedAnswer) ||
          (question.type === 'text-input' && !textAnswer.trim())
        }
      >
        Submit Answer
      </button>
    </div>
  )
}