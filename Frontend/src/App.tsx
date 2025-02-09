import { useState, useEffect } from 'react';
import { Brain, Leaf, Heart, Flower2, TestTube2, BeakerIcon, Microscope } from 'lucide-react';
import { QuizCard } from './components/QuizCard';
import { QuizSummary } from './components/QuizSummary';
import { Root, type Question, type QuizState } from './types';
import axios from 'axios';
import { motion } from 'framer-motion';

const QUESTION_TIMER = 30; 

export const FloatingBioElements = () => {
  const bioIcons = [Leaf, Heart, Brain, Flower2, TestTube2, BeakerIcon, Microscope];

  return (
    <div className="fixed inset-0 pointer-events-none">
      {[...Array(10)].map((_, i) => {
        const RandomIcon = bioIcons[(i % bioIcons.length)];
        return (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0.5
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: [0.5, 0.7, 0.5]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <RandomIcon className="text-green-500/20 w-12 h-12" />
          </motion.div>
        )
      })}
    </div>
  );
};

function App() {
  const [response, setResponse] = useState<Root>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIMER);
  const [canProceed, setCanProceed] = useState(false);
  const [selectedAnswerByUser, setSelectedAnswerByUser] = useState<number | null>(null);

  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    answers: [],
    isComplete: false,
    streak: 0,
    timePerQuestion: [],
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api');
        if (!response) throw new Error('Failed to fetch questions');
        setResponse(response.data);
        setQuestions(response.data.questions || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (quizStarted && !quizState.isComplete && selectedAnswerByUser === null) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAnswer(-1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [quizStarted, quizState.isComplete, selectedAnswerByUser]);

  const calculateScore = (isCorrect: boolean, timeRemaining: number) => {
    if (!isCorrect) return 0; // No points for incorrect answers

    const baseScore = 10;
    const timeBonus = Math.floor((timeRemaining / QUESTION_TIMER) * 5);
    const streakBonus = Math.floor(Math.min(quizState.streak * 1.5, 10));
    
    return baseScore + timeBonus + streakBonus;
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswerByUser !== null) return; 
    setSelectedAnswerByUser(answerIndex);

    const currentQuestion = questions[quizState.currentQuestionIndex];
    if (!currentQuestion) return;

    const isCorrect = answerIndex >= 0 && currentQuestion.options[answerIndex]?.is_correct;
    const questionScore = calculateScore(isCorrect, timeLeft);

    setQuizState((prev) => ({
      ...prev,
      answers: [...prev.answers, answerIndex],
      score: prev.score + questionScore,
      streak: isCorrect ? prev.streak + 1 : 0,
      timePerQuestion: [...prev.timePerQuestion, QUESTION_TIMER - timeLeft],
    }));

    setCanProceed(true);
  };

  const handleNextQuestion = () => {
    if (!canProceed) return;

    const isLastQuestion = quizState.currentQuestionIndex === questions.length - 1;

    setQuizState((prev) => ({
      ...prev,
      currentQuestionIndex: isLastQuestion ? prev.currentQuestionIndex : prev.currentQuestionIndex + 1,
      isComplete: isLastQuestion,
    }));

    if (!isLastQuestion) {
      setTimeLeft(QUESTION_TIMER);
      setCanProceed(false);
      setSelectedAnswerByUser(null);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(QUESTION_TIMER);
    setQuizState({
      currentQuestionIndex: 0,
      score: 0,
      answers: [],
      isComplete: false,
      streak: 0,
      timePerQuestion: [],
    });
  };


  const restartQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      score: 0,
      answers: [],
      isComplete: false,
      streak: 0,
      timePerQuestion: [],
    });
    setTimeLeft(QUESTION_TIMER);
    setQuizStarted(true);
    setCanProceed(false);
    setSelectedAnswerByUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold mb-2">Error loading quiz</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 to-blue-900 flex items-center justify-center p-4 relative">
        <FloatingBioElements />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full text-center relative z-10"
        >
          <motion.div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-2xl p-8 border-2 border-green-400/30">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative mb-6"
            >
              <Brain className="w-20 h-20 text-green-400 mx-auto" />
            </motion.div>

            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-4xl font-bold mb-4 text-white"
            >
              Bio Quest
              <motion.div
                className="text-2xl text-green-400 mt-2"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {response?.title}
              </motion.div>
            </motion.h1>

            <motion.div
              className="bg-yellow-400 text-black text-sm px-4 py-1 rounded-full font-semibold mb-6 inline-block"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              🔥 Topic: {response?.topic}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-300 mb-8"
            >
              Explore the fascinating world of biology! Test your knowledge and discover the mysteries of life!
            </motion.p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startQuiz}
              className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg transform transition-all hover:shadow-lg"
            >
              Let's Microscope It!
              <Microscope className="ms-3 w-6 h-6 inline-block" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (quizState.isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <QuizSummary
          quizState={quizState}
          totalQuestions={questions.length}
          onRestart={restartQuiz}
        />
      </div>
    );
  }

  const currentQuestion = questions[quizState.currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>No questions available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-blue-900 flex flex-col items-center p-4 py-8">
      <div className="w-full max-w-2xl mb-4">
        <div className="flex justify-between items-center text-white">
          <span className="text-lg font-semibold">
            Question {quizState.currentQuestionIndex + 1}/{questions.length}
          </span>
          <span className="text-lg font-semibold">Score: {quizState.score}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 mt-2">
          <div
            className="bg-green-400 h-2 rounded-full transition-all"
            style={{
              width: `${((quizState.currentQuestionIndex + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <QuizCard
        question={currentQuestion}
        selectedAnswer={selectedAnswerByUser}
        onSelectAnswer={handleAnswer}
        onNextQuestion={handleNextQuestion}
        streak={quizState.streak}
        timeLeft={timeLeft}
      />
    </div>
  );
}

export default App;