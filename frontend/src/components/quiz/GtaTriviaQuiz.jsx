import React, { useState, useEffect } from 'react';
import { defaultQuestions } from '../../data/gtaQuizQuestions';
import Leaderboard from './Leaderboard';
import BadgeDisplay from './BadgeDisplay';

const GtaTriviaQuiz = ({ questions = defaultQuestions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [topScores, setTopScores] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem('gtaQuizScores') || '[]');
    setTopScores(savedScores.sort((a, b) => b.score - a.score).slice(0, 5));
  }, []);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQuestionIndex].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
      } else {
        finishQuiz();
      }
    }, 1000);
  };

  const finishQuiz = () => {
    const finalScore = Math.round((score / questions.length) * 100);
    const newScore = { score: finalScore, timestamp: Date.now() };
    
    const savedScores = JSON.parse(localStorage.getItem('gtaQuizScores') || '[]');
    const updatedScores = [...savedScores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    localStorage.setItem('gtaQuizScores', JSON.stringify(updatedScores));
    setTopScores(updatedScores);
    setIsComplete(true);
    
    if (onComplete) {
      onComplete(finalScore);
    }
  };

  if (isComplete) {
    const finalScore = Math.round((score / questions.length) * 100);
    const isPerfectScore = finalScore === 100;

    return (
      <div className="space-y-8 animate-fade-in">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-white
            bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 
            bg-clip-text text-transparent">
            Quiz Complete!
          </h2>
          <p className="text-2xl text-yellow-500">Your Score: {finalScore}%</p>
        </div>

        <BadgeDisplay isVisible={isPerfectScore} />
        <Leaderboard scores={topScores} />

        <button
          onClick={() => window.location.reload()}
          className="w-full py-4 px-6 rounded-xl text-white font-bold text-lg
            cursor-pointer relative overflow-hidden group/btn
            active:scale-95 hover:-translate-y-1
            transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-500
            group-hover/btn:from-yellow-500 group-hover/btn:to-yellow-400
            transition-all duration-300"></div>
          <span className="relative z-10 flex items-center justify-center gap-2">
            Try Again
            <i className="ri-restart-line group-hover/btn:rotate-180 transition-transform"></i>
          </span>
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <span className="text-white/80">Question {currentQuestionIndex + 1}/{questions.length}</span>
        <span className="text-yellow-500">Score: {score}</span>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-white">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              disabled={selectedAnswer !== null}
              className={`w-full p-4 rounded-lg text-left transition-all duration-300
                ${selectedAnswer === null 
                  ? 'bg-white/5 hover:bg-white/10 hover:border-yellow-500/20' 
                  : selectedAnswer === option
                    ? option === currentQuestion.correctAnswer
                      ? 'bg-green-500/20 border-green-500/50'
                      : 'bg-red-500/20 border-red-500/50'
                    : option === currentQuestion.correctAnswer
                      ? 'bg-green-500/20 border-green-500/50'
                      : 'bg-white/5'
                }
                border border-white/10
                ${selectedAnswer === null ? 'hover:-translate-y-1' : ''}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GtaTriviaQuiz;
