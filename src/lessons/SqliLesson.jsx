import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LessonLayout from '../components/LessonLayout'
import StepExplainer from '../components/StepExplainer'
import './SqliLesson.css'

const steps = [
    {
        title: 'What is a database query?',
        description: 'When you log in to a website, the server sends your username and password to a database to check if they match. Think of it like asking a bank teller to look up your account.',
    },
    {
        title: 'The normal request',
        description: 'You fill in the login form with your username. The server creates a query: "Find the user named \'John\'". The database returns only John\'s data. Everything works correctly.',
    },
    {
        title: 'The injection attack',
        description: 'Instead of a normal username, the attacker types a special command. This tricks the database into thinking the extra text is part of its instructions — not just a name.',
    },
    {
        title: 'What happens next',
        description: 'The database now executes the attacker\'s command. It might return ALL users\' data, bypass the password check, or even delete the entire database!',
    },
    {
        title: 'How to prevent it',
        description: 'Use "parameterized queries" (prepared statements) — they treat user input strictly as data, never as commands. It\'s like the teller putting your request in a sealed form first.',
    },
]

const examples = [
    {
        id: 'normal',
        label: '👤 Normal Login',
        username: 'john',
        query: "SELECT * FROM users WHERE username = 'john' AND password = '••••••'",
        result: 'success',
        resultText: '✅ Found 1 user: John Smith',
        resultDetail: 'The query only finds John\'s account. Everything works as expected.',
        queryParts: [
            { text: "SELECT * FROM users WHERE username = '", type: 'sql' },
            { text: 'john', type: 'input-safe' },
            { text: "' AND password = '", type: 'sql' },
            { text: '••••••', type: 'input-safe' },
            { text: "'", type: 'sql' },
        ],
    },
    {
        id: 'attack',
        label: '💉 SQL Injection',
        username: "' OR '1'='1' --",
        query: "SELECT * FROM users WHERE username = '' OR '1'='1' --' AND password = ''",
        result: 'danger',
        resultText: '💀 Returned ALL 2,847 users!',
        resultDetail: "The injected code makes the condition always true ('1'='1'). The -- comments out the password check entirely.",
        queryParts: [
            { text: "SELECT * FROM users WHERE username = '", type: 'sql' },
            { text: "' OR '1'='1' --", type: 'input-danger' },
            { text: "' AND password = ''", type: 'sql-disabled' },
        ],
    },
    {
        id: 'drop',
        label: '💣 Drop Table',
        username: "'; DROP TABLE users; --",
        query: "SELECT * FROM users WHERE username = ''; DROP TABLE users; --'",
        result: 'critical',
        resultText: '☠️ Table "users" deleted!',
        resultDetail: 'The attacker closed the original query, then added a command to delete the entire users table. All data is gone.',
        queryParts: [
            { text: "SELECT * FROM users WHERE username = '", type: 'sql' },
            { text: "'; DROP TABLE users; --", type: 'input-critical' },
            { text: "'", type: 'sql-disabled' },
        ],
    },
]

export default function SqliLesson() {
    const [activeExample, setActiveExample] = useState(null)
    const [currentStep, setCurrentStep] = useState(0)
    const [showResult, setShowResult] = useState(false)
    const [typedChars, setTypedChars] = useState(0)

    const selectExample = (ex) => {
        setActiveExample(ex)
        setShowResult(false)
        setTypedChars(0)
        setCurrentStep(ex.id === 'normal' ? 1 : 2)

        // Typewriter effect for username
        let i = 0
        const interval = setInterval(() => {
            i++
            setTypedChars(i)
            if (i >= ex.username.length) {
                clearInterval(interval)
                setTimeout(() => {
                    setShowResult(true)
                    setCurrentStep(ex.id === 'normal' ? 1 : 3)
                }, 500)
            }
        }, 60)
    }

    const reset = () => {
        setActiveExample(null)
        setShowResult(false)
        setCurrentStep(0)
        setTypedChars(0)
    }

    const sidebar = <StepExplainer steps={steps} currentStep={currentStep} />

    return (
        <LessonLayout
            title="SQL Injection"
            subtitle="How hackers trick databases into revealing their secrets"
            sidebar={sidebar}
        >
            <div className="sqli-scene">
                {/* Login Form Visualization */}
                <div className="sqli-form-area">
                    <div className="sqli-form">
                        <div className="sqli-form-header">
                            <span className="sqli-form-icon">🏦</span>
                            <span className="sqli-form-title">SecureBank Login</span>
                        </div>
                        <div className="sqli-form-body">
                            <label className="sqli-label">Username</label>
                            <div className={`sqli-input ${activeExample?.result === 'danger' || activeExample?.result === 'critical' ? 'sqli-input-danger' : ''}`}>
                                {activeExample
                                    ? activeExample.username.slice(0, typedChars)
                                    : ''
                                }
                                {activeExample && typedChars < activeExample.username.length && (
                                    <span className="sqli-type-cursor">|</span>
                                )}
                                {!activeExample && (
                                    <span className="sqli-placeholder">Enter username...</span>
                                )}
                            </div>
                            <label className="sqli-label">Password</label>
                            <div className="sqli-input sqli-input-disabled">
                                ••••••••
                            </div>
                        </div>
                    </div>

                    {/* Arrow */}
                    <div className="sqli-arrow">
                        <motion.div
                            animate={activeExample ? { x: [0, 8, 0] } : {}}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            →
                        </motion.div>
                        <span className="sqli-arrow-label">query sent</span>
                    </div>

                    {/* Database */}
                    <div className={`sqli-db ${showResult && activeExample?.result !== 'success' ? 'sqli-db-attacked' : ''}`}>
                        <div className="sqli-db-icon">
                            {showResult && activeExample?.result === 'critical' ? '💥' : '🗄️'}
                        </div>
                        <span className="sqli-db-label">Database</span>
                    </div>
                </div>

                {/* Query Display */}
                <AnimatePresence mode="wait">
                    {activeExample && (
                        <motion.div
                            key={activeExample.id}
                            className="sqli-query-box"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="sqli-query-label">Generated SQL Query:</div>
                            <div className="sqli-query-code">
                                {activeExample.queryParts.map((part, i) => (
                                    <span key={i} className={`sqli-q-${part.type}`}>{part.text}</span>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Result */}
                <AnimatePresence>
                    {showResult && activeExample && (
                        <motion.div
                            className={`sqli-result sqli-result-${activeExample.result}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="sqli-result-text">{activeExample.resultText}</div>
                            <div className="sqli-result-detail">{activeExample.resultDetail}</div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Example Buttons */}
                <div className="sqli-controls">
                    {!activeExample ? (
                        <div className="sqli-examples">
                            <p className="sqli-prompt">Try each example to see what happens:</p>
                            <div className="sqli-btn-row">
                                {examples.map((ex) => (
                                    <motion.button
                                        key={ex.id}
                                        className={`sqli-btn sqli-btn-${ex.id}`}
                                        onClick={() => selectExample(ex)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {ex.label}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="sqli-active-controls">
                            {showResult && (
                                <motion.button
                                    className="sqli-btn sqli-btn-reset"
                                    onClick={reset}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    ↻ Try Another Example
                                </motion.button>
                            )}
                        </div>
                    )}
                </div>

                {/* Defense tip */}
                {showResult && activeExample?.result !== 'success' && (
                    <motion.div
                        className="sqli-defense-tip"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="sqli-tip-header">🛡️ How to prevent this:</div>
                        <div className="sqli-tip-code">
                            <span className="sqli-q-sql">db.query(</span>
                            <span className="sqli-q-input-safe">"SELECT * FROM users WHERE username = ?"</span>
                            <span className="sqli-q-sql">, [</span>
                            <span className="sqli-q-input-safe">userInput</span>
                            <span className="sqli-q-sql">])</span>
                        </div>
                        <p className="sqli-tip-text">
                            The <strong>?</strong> placeholder ensures user input is treated as data, never as SQL commands.
                        </p>
                    </motion.div>
                )}
            </div>
        </LessonLayout>
    )
}
