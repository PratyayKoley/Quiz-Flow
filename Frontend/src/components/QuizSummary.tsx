import { Trophy, Crown, Star, Medal, Target, Clock, Brain, Leaf } from 'lucide-react';
import type { QuizState } from '../types';
import { motion } from 'framer-motion';
import { FloatingBioElements } from '../App';

interface QuizSummaryProps {
  quizState: QuizState;
  totalQuestions: number;
  onRestart: () => void;
}

export function QuizSummary({ quizState, totalQuestions, onRestart }: QuizSummaryProps) {
  const averageTime = quizState.timePerQuestion.reduce((a, b) => a + b, 0) / totalQuestions;
  const accuracy = (quizState.score / totalQuestions) * 100;

  const getPerformanceDetails = (accuracy: number, averageTime: number) => {
    if (accuracy >= 90 && averageTime < 10) {
      return {
        icon: Crown,
        color: "text-yellow-400",
        title: "Biology Master!",
        message: "Outstanding performance! You're a natural scientist!"
      };
    } else if (accuracy >= 80) {
      return {
        icon: Star,
        color: "text-purple-400",
        title: "Science Star!",
        message: "Great work! Your knowledge is impressive!"
      };
    } else if (accuracy >= 70) {
      return {
        icon: Medal,
        color: "text-blue-400",
        title: "Bio Explorer!",
        message: "Good job! Keep exploring the world of biology!"
      };
    } else {
      return {
        icon: Target,
        color: "text-green-400",
        title: "Bio Learner!",
        message: "Keep practicing! Every experiment teaches us something new!"
      };
    }
  };

  const performance = getPerformanceDetails(accuracy, averageTime);
  const PerformanceIcon = performance.icon;

  return (
    <div className="relative">
      <FloatingBioElements />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl bg-gradient-to-br from-green-900 to-blue-900 rounded-xl shadow-2xl p-8 text-white border-2 border-green-400/30"
      >
        <motion.div
          className="text-center mb-8"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <PerformanceIcon className={`w-20 h-20 ${performance.color} mx-auto mb-4`} />
          </motion.div>
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">
            {performance.title}
          </h2>
          <p className="text-gray-300 mt-2">{performance.message}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center p-6 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10"
          >
            <Trophy className="w-10 h-10 text-yellow-400 mb-3" />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold text-yellow-400"
            >
              {quizState.score}
            </motion.span>
            <span className="text-sm text-gray-300">Final Score</span>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center p-6 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10"
          >
            <Clock className="w-10 h-10 text-blue-400 mb-3" />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold text-blue-400"
            >
              {averageTime.toFixed(1)}s
            </motion.span>
            <span className="text-sm text-gray-300">Avg. Time</span>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center p-6 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10"
          >
            <Leaf className="w-10 h-10 text-green-400 mb-3" />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold text-green-400"
            >
              {accuracy.toFixed(1)}%
            </motion.span>
            <span className="text-sm text-gray-300">Accuracy</span>
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRestart}
          className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg transform transition-all hover:shadow-lg"
        >
          Start New Experiment
        </motion.button>
      </motion.div>
    </div>
  );
}

export default QuizSummary;