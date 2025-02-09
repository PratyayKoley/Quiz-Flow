import { useState } from 'react';
import { Timer, Brain, Leaf, BookOpen, ArrowRight, DnaIcon } from 'lucide-react';
import type { Question } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingBioElements } from '../App';

interface QuizCardProps {
  question: Question;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  onNextQuestion: () => void;
  streak: number;
  timeLeft: number;
}

const DNALoader = ({ position }: { position: { x: string; y: string } }) => {
  return (
    <motion.div
      className="absolute"
      style={{
        left: position.x,
        top: position.y,
      }}
      animate={{
        rotate: [0, 360],
        y: [`${position.y}`, `calc(${position.y} + 20px)`, `${position.y}`]
      }}
      transition={{
        rotate: { duration: 6, repeat: Infinity, ease: "linear" },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <DnaIcon size={40} className="text-blue-400" />
    </motion.div>
  );
};

export function QuizCard({ question, selectedAnswer, onSelectAnswer, onNextQuestion, streak, timeLeft }: QuizCardProps) {
  const [showReadingMaterial, setShowReadingMaterial] = useState(false);
  const isAnswered = selectedAnswer !== null;
  const isCorrect = isAnswered && selectedAnswer >= 0 && question.options[selectedAnswer]?.is_correct;

  const dnaPositions = [
    { x: '15%', y: '20%' },
    { x: '45%', y: '65%' },
    { x: '75%', y: '30%' },
    { x: '25%', y: '70%' },
    { x: '65%', y: '15%' }
  ];

  return (
    <div className="relative">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl bg-gradient-to-br from-green-900 to-blue-900 rounded-xl shadow-2xl p-8 mb-8 text-white border-2 border-green-400/30 relative overflow-hidden"
      >

        <FloatingBioElements />
        <div className="absolute inset-0 opacity-10">
          {dnaPositions.map((position, i) => (
            <DNALoader key={i} position={position} />
          ))}
        </div>

        {/* Status Bar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-6 bg-black/30 p-4 rounded-lg backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <Brain className="w-6 h-6 text-green-400" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-sm text-green-400">STREAK</span>
              <motion.div
                className="flex gap-1"
                animate={{ scale: streak > 0 ? [1, 1.2, 1] : 1 }}
              >
                {[...Array(Math.min(streak, 5))].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="w-2 h-2 bg-green-400 rounded-full"
                  />
                ))}
              </motion.div>
            </div>
          </div>

          <motion.div
            animate={{
              scale: timeLeft <= 5 ? [1, 1.1, 1] : 1,
            }}
            transition={{ repeat: timeLeft <= 5 ? Infinity : 0, duration: 0.5 }}
            className="flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-full"
          >
            <Timer className="w-5 h-5 text-blue-400" />
            <span className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-blue-400'}`}>
              {timeLeft}
            </span>
          </motion.div>
        </motion.div>

        {/* Question */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-6 bg-white/5 p-6 rounded-lg backdrop-blur-sm"
        >
          <h2 className="text-xl font-bold mb-3">{question.description}</h2>
          {question.topic && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-block bg-green-400/20 text-green-200 text-sm px-3 py-1 rounded-full"
            >
              <Leaf className="w-4 h-4 inline mr-2" />
              {question.topic}
            </motion.span>
          )}
        </motion.div>

        {/* Options */}
        <div className="space-y-4">
          <AnimatePresence mode='wait'>
            <div
              key={question.id}
              className="space-y-4 w-full"
            >
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = option?.is_correct || false;
                const showResult = selectedAnswer !== null;

                return (
                  <motion.div
                    key={option.id}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0, pointerEvents: 'none' }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1
                    }}
                    onClick={() => !showResult && onSelectAnswer(index)}
                    whileHover={{ scale: !showResult ? 1.02 : 1 }}
                    whileTap={{ scale: !showResult ? 0.98 : 1 }}
                    className={`w-full relative p-5 text-left rounded-lg transition-all ${!showResult ? 'cursor-pointer' : 'cursor-default'} ${!showResult
                      ? 'bg-white/10 hover:bg-white/20 border-2 border-white/20'
                      : isSelected
                        ? isCorrect
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : 'bg-red-500/20 border-2 border-red-400'
                        : isCorrect
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : 'bg-white/10 border-2 border-white/20'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={showResult && (isSelected || isCorrect) ? {
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0]
                        } : {}}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${!showResult
                          ? 'bg-white/20'
                          : isSelected
                            ? isCorrect
                              ? 'bg-green-400'
                              : 'bg-red-400'
                            : isCorrect
                              ? 'bg-green-400'
                              : 'bg-white/20'
                          }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </motion.div>
                      {option.description}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="mt-6 space-y-4 relative"
            >
              <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                <p className="font-bold mb-2">
                  {isCorrect ? '🎉 Correct!' : '❌ Incorrect'}
                </p>
                <p className="text-sm">
                  {isCorrect
                    ? "Great job! Let's continue to the next question."
                    : "Don't worry! You can review the material and try the next question."}
                </p>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowReadingMaterial(!showReadingMaterial)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-lg"
                >
                  <BookOpen className="w-5 h-5" />
                  {showReadingMaterial ? 'Hide' : 'Show'} Reading Material
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { onNextQuestion(); setShowReadingMaterial(false) }}
                  className="flex items-center gap-2 px-6 py-2 bg-green-500 rounded-lg ml-auto"
                >
                  Next Question
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showReadingMaterial && question.reading_material && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="bg-white/10 max-w-2xl backdrop-blur-sm rounded-xl p-6 text-white"
          >
            <h3 className="text-xl font-bold mb-4">Reading Material</h3>
            <div className="prose prose-invert max-w-none">
              {question.reading_material.content_sections.map((section, index) => (
                <div
                  key={index}
                  className="mb-4"
                  dangerouslySetInnerHTML={{ __html: section }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}