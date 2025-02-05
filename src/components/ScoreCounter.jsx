import React from 'react';

const ScoreCounter = ({ score }) => {
  return (
    <div className="score-counter-container">
      <div className="score-counter">
        Score: {score}
      </div>
    </div>
  );
};

export default ScoreCounter;