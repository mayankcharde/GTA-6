import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GtaTriviaQuiz from '../components/quiz/GtaTriviaQuiz';
import gsap from 'gsap';

const Quiz = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Cleanup function
    return () => {
      // Kill all GSAP animations
      gsap.killTweensOf("*");
      // Clear any running timeouts
      const highestId = window.setTimeout(() => {}, 0);
      for (let i = highestId; i >= 0; i--) {
        window.clearTimeout(i);
      }
    };
  }, []);

  const handleQuizComplete = (score) => {
    console.log(`Quiz completed with score: ${score}`);
  };

  const handleBackClick = () => {
    // Cleanup before navigation
    gsap.killTweensOf("*");
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden py-20">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[80rem] h-[50rem] 
          bg-yellow-500/10 rounded-full filter blur-[10rem] animate-float-slow"></div>
        <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] 
          bg-yellow-600/10 rounded-full filter blur-[10rem] animate-float-slow-reverse"></div>
      </div>

      {/* Back Button */}
      <Link 
        onClick={handleBackClick}
        to="/" 
        className="fixed top-8 left-8 z-50 p-4 rounded-full 
        bg-white/10 backdrop-blur-lg border border-white/20
        hover:bg-white/20 transition-all duration-300
        group">
        <i className="ri-arrow-left-line text-2xl group-hover:-translate-x-1 transition-transform"></i>
      </Link>

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4
            bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 
            bg-clip-text text-transparent animate-gradient-x">
            GTA Trivia Challenge
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Test your Grand Theft Auto knowledge and earn the Jetpack Genius badge!
          </p>
        </div>

        {/* Quiz Component */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 md:p-8
          border border-white/10 hover:border-yellow-500/30
          transition-all duration-500 shadow-xl hover:shadow-yellow-500/10">
          <GtaTriviaQuiz onComplete={handleQuizComplete} />
        </div>
      </div>
    </div>
  );
};

export default Quiz;
