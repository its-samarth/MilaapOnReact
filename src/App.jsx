// App.jsx
import { useState, useEffect } from 'react'
import questions from '../questions'
import StartScreen from './components/StartScreen'
import QuestionScreen from './components/QuestionScreen'
import LevelTransition from './components/LevelTransition'
import EndScreen from './components/EndScreen'
import './App.css'

function App() {
  const [gameState, setGameState] = useState('start')
  const [currentLevel, setCurrentLevel] = useState('easy')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [currentFeedback, setCurrentFeedback] = useState(null)
  const [gameOutcome, setGameOutcome] = useState(null)
  const [nextLevel, setNextLevel] = useState(null)

  const getNextLevel = (current) => {
    const levelsOrder = ['easy', 'medium', 'hard']
    const currentIndex = levelsOrder.indexOf(current)
    return levelsOrder[currentIndex + 1] || null
  }

  const handleStart = () => {
    setGameState('playing')
  }

  const handleAnswerSubmit = (isCorrect, correctAnswer) => {
    if (isCorrect) {
      let points = 0
      switch(currentLevel) {
        case 'easy': points = 10; break
        case 'medium': points = 20; break
        case 'hard': points = 30; break
      }
      setScore(prev => prev + points)
    }
    
    setUserAnswers(prev => [...prev, isCorrect])
    setCurrentFeedback({ isCorrect, correctAnswer })
  }

  const handleContinue = () => {
    const isLastQuestion = currentQuestionIndex === questions[currentLevel].length - 1
    if (isLastQuestion) {
      const correctCount = userAnswers.filter(a => a).length
      if (correctCount >= 2) {
        const next = getNextLevel(currentLevel)
        if (next) {
          setNextLevel(next)
          setGameState('levelTransition')
        } else {
          setGameOutcome('completed')
          setGameState('end')
        }
      } else {
        setGameOutcome('failed')
        setGameState('end')
      }
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
    }
    setCurrentFeedback(null)
  }

  const handleProceed = () => {
    setCurrentLevel(nextLevel)
    setCurrentQuestionIndex(0)
    setUserAnswers([])
    setGameState('playing')
  }

  const handleRetry = () => {
    setCurrentQuestionIndex(0)
    setUserAnswers([])
    setCurrentFeedback(null)
    setGameState('playing')
  }

  const handleRestart = () => {
    setGameState('start')
    setCurrentLevel('easy')
    setCurrentQuestionIndex(0)
    setScore(0)
    setUserAnswers([])
    setCurrentFeedback(null)
    setGameOutcome(null)
  }

  return (
    <div className="app">
      {gameState === 'start' && <StartScreen onStart={handleStart} />}
      
      {gameState === 'playing' && (
        <QuestionScreen
          question={questions[currentLevel][currentQuestionIndex]}
          onSubmitAnswer={handleAnswerSubmit}
          onContinue={handleContinue}
          feedback={currentFeedback}
        />
      )}
      
      {gameState === 'levelTransition' && (
        <LevelTransition
          currentLevel={currentLevel}
          nextLevel={nextLevel}
          onProceed={handleProceed}
        />
      )}
      
      {gameState === 'end' && (
        <EndScreen
          score={score}
          gameOutcome={gameOutcome}
          currentLevel={currentLevel}
          onRestart={handleRestart}
          onRetry={handleRetry}
        />
      )}
    </div>
  )
}

export default App