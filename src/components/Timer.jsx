import { useState, useEffect } from 'react';

export default function Timer({ duration, onTimeUp, isActive }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isActive) return;

    const endTime = Date.now() + timeLeft * 1000;
    
    const timer = setInterval(() => {
      const remaining = Math.ceil((endTime - Date.now()) / 1000);
      
      if (remaining <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
        onTimeUp();
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]); // Only depend on isActive

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration);
    }
  }, [duration, isActive]);

  return (
    <div className="timer-display">
      <div className="timer-bar">
        <div 
          className="timer-progress"
          style={{
            width: `${(timeLeft / duration) * 100}%`,
            backgroundColor: timeLeft <= 10 ? '#ff4444' : '#646cff'
          }}
        />
      </div>
      <span className={`timer-text ${timeLeft <= 10 ? 'warning' : ''}`}>
        {timeLeft}s
      </span>
    </div>
  );
} 