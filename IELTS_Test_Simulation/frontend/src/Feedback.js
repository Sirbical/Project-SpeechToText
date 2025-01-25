import React from 'react';

function Feedback({ scores }) {
  return (
    <div>
      <h3>IELTS Scoring</h3>
      <p>Fluency: {scores.fluency}</p>
      <p>Grammar: {scores.grammar}</p>
      <p>Pronunciation: {scores.pronunciation}</p>
      <p>Vocabulary: {scores.vocabulary}</p>
    </div>
  );
}

export default Feedback;