import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import quizData from '../data/quizData'
import './QuizPanel.css'

export default function QuizPanel() {
    const location = useLocation()
    const { completeLesson, isCompleted, xp, xpPerLesson } = useProgress()
    const lessonPath = location.pathname
    const questions = quizData[lessonPath]

    const [started, setStarted] = useState(false)
    const [qIndex, setQIndex] = useState(0)
    const [selected, setSelected] = useState(null)
    const [showResult, setShowResult] = useState(false)
    const [score, setScore] = useState(0)
    const [finished, setFinished] = useState(false)

    const alreadyDone = isCompleted(lessonPath)

    if (!questions) return null

    const q = questions[qIndex]

    const handleAnswer = (optIdx) => {
        if (showResult) return
        setSelected(optIdx)
        setShowResult(true)
        if (optIdx === q.correct) {
            setScore((s) => s + 1)
        }
    }

    const nextQuestion = () => {
        if (qIndex + 1 < questions.length) {
            setQIndex((i) => i + 1)
            setSelected(null)
            setShowResult(false)
        } else {
            setFinished(true)
            // Award XP if passed (2/3 or better)
            if (score + (selected === q?.correct ? 1 : 0) >= 2) {
                completeLesson(lessonPath)
            }
        }
    }

    const finalScore = score

    // Already completed view
    if (alreadyDone && !started) {
        return (
            <div className="qp-panel qp-done">
                <div className="qp-done-icon">✅</div>
                <div className="qp-done-text">Lesson completed! +{xpPerLesson} XP earned</div>
                <div className="qp-done-xp">Total XP: {xp}</div>
            </div>
        )
    }

    // Start quiz prompt
    if (!started) {
        return (
            <motion.div
                className="qp-panel qp-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="qp-start-icon">🧠</div>
                <h3 className="qp-start-title">Ready to test your knowledge?</h3>
                <p className="qp-start-desc">
                    Answer 3 quick questions to earn <strong>+{xpPerLesson} XP</strong> and unlock a badge!
                </p>
                <button className="qp-btn qp-btn-start" onClick={() => setStarted(true)}>
                    Start Quiz
                </button>
            </motion.div>
        )
    }

    // Finished view
    if (finished) {
        const passed = finalScore >= 2
        return (
            <motion.div
                className={`qp-panel qp-result ${passed ? 'qp-result-pass' : 'qp-result-fail'}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div className="qp-result-icon">{passed ? '🎉' : '😓'}</div>
                <h3 className="qp-result-title">
                    {passed ? 'Great job!' : 'Not quite!'}
                </h3>
                <div className="qp-result-score">
                    {finalScore} / {questions.length} correct
                </div>
                {passed ? (
                    <div className="qp-result-xp">+{xpPerLesson} XP earned! 🏆</div>
                ) : (
                    <button
                        className="qp-btn qp-btn-retry"
                        onClick={() => {
                            setStarted(true)
                            setQIndex(0)
                            setSelected(null)
                            setShowResult(false)
                            setScore(0)
                            setFinished(false)
                        }}
                    >
                        Try Again
                    </button>
                )}
            </motion.div>
        )
    }

    // Active quiz
    return (
        <div className="qp-panel qp-active">
            <div className="qp-header">
                <span className="qp-progress">
                    Question {qIndex + 1} / {questions.length}
                </span>
                <div className="qp-dots">
                    {questions.map((_, i) => (
                        <span
                            key={i}
                            className={`qp-dot ${i === qIndex ? 'qp-dot-active' : i < qIndex ? 'qp-dot-done' : ''}`}
                        />
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={qIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="qp-question-area"
                >
                    <h4 className="qp-question">{q.question}</h4>
                    <div className="qp-options">
                        {q.options.map((opt, i) => {
                            let cls = 'qp-option'
                            if (showResult) {
                                if (i === q.correct) cls += ' qp-option-correct'
                                else if (i === selected) cls += ' qp-option-wrong'
                                else cls += ' qp-option-dim'
                            } else if (i === selected) {
                                cls += ' qp-option-selected'
                            }
                            return (
                                <button
                                    key={i}
                                    className={cls}
                                    onClick={() => handleAnswer(i)}
                                    disabled={showResult}
                                >
                                    <span className="qp-option-letter">
                                        {String.fromCharCode(65 + i)}
                                    </span>
                                    {opt}
                                </button>
                            )
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>

            {showResult && (
                <motion.div
                    className="qp-feedback"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <span>{selected === q.correct ? '✅ Correct!' : `❌ The answer was: ${q.options[q.correct]}`}</span>
                    <button className="qp-btn qp-btn-next" onClick={nextQuestion}>
                        {qIndex + 1 < questions.length ? 'Next →' : 'See Results'}
                    </button>
                </motion.div>
            )}
        </div>
    )
}
