import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LessonLayout from '../components/LessonLayout'
import StepExplainer from '../components/StepExplainer'
import './BruteForceLesson.css'

const steps = [
    {
        title: 'The locked door',
        description: 'Imagine a door with a combination lock. You don\'t know the code, but you have unlimited time and attempts. What do you do? Try every combination!',
    },
    {
        title: 'Trying every key',
        description: 'A brute force attack does exactly this — it tries every possible password one by one. Starting from "aaa", then "aab", "aac"... until it finds the right one.',
    },
    {
        title: 'It takes time',
        description: 'Short passwords (4 chars) can be cracked in seconds. But longer passwords (12+ chars with symbols) would take millions of years. Length is your best defense!',
    },
    {
        title: 'Speed matters',
        description: 'Attackers use powerful GPUs that try billions of passwords per second. Common passwords like "password123" are checked first using wordlists.',
    },
    {
        title: 'How to defend',
        description: 'Use long, unique passwords (16+ chars). Enable 2FA. Websites should use rate-limiting and account lockout after failed attempts.',
    },
]

const commonPasswords = [
    'password', '123456', 'qwerty', 'admin', 'letmein',
    'welcome', 'monkey', 'dragon', 'master', 'login',
    'abc123', 'iloveyou', 'sunshine', 'princess', 'football',
]

const targetPassword = 'dragon'

export default function BruteForceLesson() {
    const [phase, setPhase] = useState('idle') // idle | running | cracked
    const [currentStep, setCurrentStep] = useState(0)
    const [attempts, setAttempts] = useState([])
    const [speed, setSpeed] = useState(0)
    const [found, setFound] = useState(false)
    const intervalRef = useRef(null)
    const indexRef = useRef(0)

    const startAttack = () => {
        setPhase('running')
        setCurrentStep(1)
        setAttempts([])
        setFound(false)
        indexRef.current = 0

        intervalRef.current = setInterval(() => {
            const idx = indexRef.current
            if (idx >= commonPasswords.length) {
                clearInterval(intervalRef.current)
                return
            }
            const pw = commonPasswords[idx]
            const isMatch = pw === targetPassword
            setAttempts(prev => [...prev, { password: pw, match: isMatch }])
            setSpeed(Math.floor(Math.random() * 5000000) + 1000000)

            if (isMatch) {
                clearInterval(intervalRef.current)
                setFound(true)
                setPhase('cracked')
                setCurrentStep(2)
            }
            indexRef.current++
        }, 500)
    }

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [])

    const reset = () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setPhase('idle')
        setCurrentStep(0)
        setAttempts([])
        setSpeed(0)
        setFound(false)
        indexRef.current = 0
    }

    const sidebar = <StepExplainer steps={steps} currentStep={currentStep} />

    return (
        <LessonLayout
            title="Brute Force"
            subtitle="Trying every single key until one fits the lock"
            sidebar={sidebar}
        >
            <div className="bf-scene">
                {/* Lock Visualization */}
                <div className="bf-lock-area">
                    <div className={`bf-lock ${found ? 'bf-lock-open' : ''}`}>
                        <div className="bf-lock-body">
                            <div className="bf-lock-icon">
                                {found ? '🔓' : '🔒'}
                            </div>
                            <div className="bf-lock-label">
                                {found ? 'CRACKED!' : 'Password Protected'}
                            </div>
                        </div>
                        <div className="bf-password-display">
                            {targetPassword.split('').map((c, i) => (
                                <span key={i} className={`bf-char ${found ? 'bf-char-revealed' : ''}`}>
                                    {found ? c : '•'}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Speed indicator */}
                    {phase === 'running' && (
                        <motion.div
                            className="bf-speed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            ⚡ {speed.toLocaleString()} attempts/sec
                        </motion.div>
                    )}
                </div>

                {/* Attempt Log */}
                <div className="bf-log">
                    <div className="bf-log-header">
                        <span>🔑 Password Attempts</span>
                        <span className="bf-log-count">
                            {attempts.length}/{commonPasswords.length}
                        </span>
                    </div>
                    <div className="bf-log-body">
                        {attempts.length === 0 && (
                            <div className="bf-log-empty">No attempts yet...</div>
                        )}
                        {attempts.map((a, i) => (
                            <motion.div
                                key={i}
                                className={`bf-attempt ${a.match ? 'bf-attempt-match' : 'bf-attempt-fail'}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <span className="bf-attempt-icon">{a.match ? '✅' : '❌'}</span>
                                <span className="bf-attempt-pw">{a.password}</span>
                                <span className="bf-attempt-status">
                                    {a.match ? 'MATCH!' : 'wrong'}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Password Strength Comparison */}
                <div className="bf-strength">
                    <div className="bf-strength-header">⏱️ Time to crack:</div>
                    <div className="bf-strength-grid">
                        <div className="bf-str-row">
                            <span className="bf-str-pw">dragon</span>
                            <div className="bf-str-bar bf-str-weak" style={{ width: '15%' }} />
                            <span className="bf-str-time">0.2 seconds</span>
                        </div>
                        <div className="bf-str-row">
                            <span className="bf-str-pw">Dr@g0n2024</span>
                            <div className="bf-str-bar bf-str-medium" style={{ width: '45%' }} />
                            <span className="bf-str-time">3 days</span>
                        </div>
                        <div className="bf-str-row">
                            <span className="bf-str-pw">My-Dr@g0n-Is-Str0ng!</span>
                            <div className="bf-str-bar bf-str-strong" style={{ width: '95%' }} />
                            <span className="bf-str-time">4 million years</span>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="bf-controls">
                    {phase === 'idle' && (
                        <motion.button
                            className="bf-btn bf-btn-attack"
                            onClick={startAttack}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            🔓 Start Brute Force
                        </motion.button>
                    )}
                    {phase === 'running' && (
                        <div className="bf-running">
                            <span className="bf-pulse" /> Trying passwords...
                        </div>
                    )}
                    {phase === 'cracked' && (
                        <motion.button
                            className="bf-btn bf-btn-reset"
                            onClick={() => { reset(); setCurrentStep(4); }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            ↻ Try Again
                        </motion.button>
                    )}
                </div>
            </div>
        </LessonLayout>
    )
}
