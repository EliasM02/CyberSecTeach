import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LessonLayout from '../components/LessonLayout'
import StepExplainer from '../components/StepExplainer'
import './LogAnalysisLesson.css'

/* — Simulated server log entries — */
const logEntries = [
    { id: 1, time: '08:12:01', src: '10.0.0.5', event: 'GET /index.html HTTP/1.1 → 200 OK', suspicious: false, reason: null },
    { id: 2, time: '08:12:03', src: '10.0.0.5', event: 'GET /style.css HTTP/1.1 → 200 OK', suspicious: false, reason: null },
    { id: 3, time: '08:14:22', src: '45.33.32.156', event: 'SYN → :22 (SSH) → RST', suspicious: true, reason: 'Port scan — probing SSH' },
    { id: 4, time: '08:14:22', src: '45.33.32.156', event: 'SYN → :80 (HTTP) → SYN-ACK', suspicious: true, reason: 'Port scan — probing HTTP' },
    { id: 5, time: '08:14:23', src: '45.33.32.156', event: 'SYN → :443 (HTTPS) → SYN-ACK', suspicious: true, reason: 'Port scan — probing HTTPS' },
    { id: 6, time: '08:14:23', src: '45.33.32.156', event: 'SYN → :3306 (MySQL) → RST', suspicious: true, reason: 'Port scan — probing database' },
    { id: 7, time: '08:15:44', src: '10.0.0.8', event: 'POST /api/login → 200 OK (user: admin)', suspicious: false, reason: null },
    { id: 8, time: '08:18:02', src: '45.33.32.156', event: 'POST /api/login → 401 Unauthorized (user: admin)', suspicious: true, reason: 'Failed login attempt from scanner IP' },
    { id: 9, time: '08:18:04', src: '45.33.32.156', event: 'POST /api/login → 401 Unauthorized (user: root)', suspicious: true, reason: 'Brute-force attempt — trying common usernames' },
    { id: 10, time: '08:18:06', src: '45.33.32.156', event: 'POST /api/login → 401 Unauthorized (user: admin)', suspicious: true, reason: 'Repeated failed login — brute-force confirmed' },
    { id: 11, time: '08:20:11', src: '10.0.0.12', event: 'GET /dashboard HTTP/1.1 → 200 OK', suspicious: false, reason: null },
    { id: 12, time: '08:22:45', src: '192.168.1.99', event: 'TCP :4444 → ESTABLISHED (bash -i)', suspicious: true, reason: '⚠️ Reverse shell! Outbound connection to attacker on port 4444' },
    { id: 13, time: '08:22:47', src: '192.168.1.99', event: 'TCP :4444 → "whoami" → "www-data"', suspicious: true, reason: 'Attacker executing commands via shell' },
    { id: 14, time: '08:23:01', src: '10.0.0.5', event: 'GET /about.html HTTP/1.1 → 200 OK', suspicious: false, reason: null },
]

const totalSuspicious = logEntries.filter(e => e.suspicious).length

const steps = [
    {
        title: 'What are server logs?',
        description: 'Every server keeps a diary of everything that happens — who connected, what they requested, and whether it worked. Logs are like security camera footage for your network.',
    },
    {
        title: 'Reading the log',
        description: 'Each line shows a timestamp, source IP, and what happened. Normal traffic looks like regular web requests (GET /index.html → 200 OK). Suspicious activity stands out — port scans, failed logins, and unusual connections.',
    },
    {
        title: 'Find the threats!',
        description: 'Click on any log entry you think is suspicious. Look for: repeated connections from the same IP, port scanning patterns, failed login attempts, and unusual outbound connections.',
    },
    {
        title: 'Analysis complete',
        description: 'Great detective work! In real life, SIEM tools (like Splunk or ELK) automate this process — but understanding what to look for is the foundation of every SOC analyst\'s skill set.',
    },
    {
        title: 'Blue Team takeaway',
        description: 'Log analysis is how defenders catch attackers AFTER they get in. Combine logs with alerts, and you can detect port scans, brute-force attacks, and even active reverse shells before real damage is done.',
    },
]

export default function LogAnalysisLesson() {
    const [phase, setPhase] = useState('intro')   // intro | hunting | done
    const [flagged, setFlagged] = useState([])
    const [revealed, setRevealed] = useState([])
    const [currentStep, setCurrentStep] = useState(0)

    const startHunt = useCallback(() => {
        setPhase('hunting')
        setCurrentStep(2)
        setFlagged([])
        setRevealed([])
    }, [])

    const toggleFlag = (id) => {
        if (phase !== 'hunting') return
        if (flagged.includes(id)) {
            setFlagged(prev => prev.filter(f => f !== id))
            setRevealed(prev => prev.filter(r => r !== id))
        } else {
            setFlagged(prev => [...prev, id])
            // Reveal reasoning after a short delay
            setTimeout(() => {
                setRevealed(prev => [...prev, id])
            }, 300)
        }
    }

    const submitAnalysis = () => {
        setPhase('done')
        setCurrentStep(3)
    }

    const reset = () => {
        setPhase('intro')
        setCurrentStep(4)
        setFlagged([])
        setRevealed([])
    }

    // Scoring
    const correctFlags = flagged.filter(id => logEntries.find(e => e.id === id)?.suspicious)
    const falsePositives = flagged.filter(id => !logEntries.find(e => e.id === id)?.suspicious)
    const missed = logEntries.filter(e => e.suspicious && !flagged.includes(e.id))

    const sidebar = <StepExplainer steps={steps} currentStep={currentStep} />

    return (
        <LessonLayout
            title="Log Analysis"
            subtitle="The detective who reads the server's diary"
            sidebar={sidebar}
        >
            <div className="log-scene">
                {/* Server Log Viewer */}
                <div className="log-viewer">
                    <div className="log-viewer-header">
                        <span className="log-viewer-dot log-dot-red" />
                        <span className="log-viewer-dot log-dot-yellow" />
                        <span className="log-viewer-dot log-dot-green" />
                        <span className="log-viewer-title">
                            /var/log/server.log — {phase === 'hunting' ? '🔍 Click suspicious entries' : phase === 'done' ? '📊 Analysis complete' : '📋 Server log'}
                        </span>
                    </div>
                    <div className="log-viewer-body">
                        {logEntries.map((entry, i) => {
                            const isFlagged = flagged.includes(entry.id)
                            const isRevealed = revealed.includes(entry.id)

                            return (
                                <motion.div
                                    key={entry.id}
                                    className={`log-entry ${phase === 'done' && entry.suspicious && !isFlagged ? 'log-entry-missed' :
                                            phase === 'done' && isFlagged && !entry.suspicious ? 'log-entry-false' :
                                                isFlagged && entry.suspicious ? 'log-entry-correct' :
                                                    isFlagged && !entry.suspicious ? 'log-entry-wrong' :
                                                        ''
                                        } ${phase === 'hunting' ? 'log-entry-clickable' : ''}`}
                                    onClick={() => phase === 'hunting' && toggleFlag(entry.id)}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: phase === 'intro' ? i * 0.05 : 0 }}
                                >
                                    <span className="log-time">{entry.time}</span>
                                    <span className="log-src">{entry.src}</span>
                                    <span className="log-event">{entry.event}</span>
                                    {isFlagged && (
                                        <span className="log-flag">
                                            {entry.suspicious ? '🚨' : '❌'}
                                        </span>
                                    )}
                                    {phase === 'done' && entry.suspicious && !isFlagged && (
                                        <span className="log-flag log-flag-missed">⚠️</span>
                                    )}
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                {/* Reasoning Panel — shows why flagged items are suspicious */}
                <AnimatePresence>
                    {revealed.length > 0 && phase === 'hunting' && (
                        <motion.div
                            className="log-reasoning"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <div className="log-reasoning-title">🕵️ Your findings</div>
                            {revealed.map(id => {
                                const entry = logEntries.find(e => e.id === id)
                                return (
                                    <div key={id} className={`log-finding ${entry.suspicious ? 'log-finding-correct' : 'log-finding-false'}`}>
                                        <span className="log-finding-icon">{entry.suspicious ? '🚨' : '❌'}</span>
                                        <span className="log-finding-text">
                                            {entry.suspicious
                                                ? entry.reason
                                                : `${entry.event} — This is normal traffic, not suspicious.`}
                                        </span>
                                    </div>
                                )
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Done — Score Card */}
                {phase === 'done' && (
                    <motion.div
                        className="log-score"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h3 className="log-score-title">📊 Analysis Report</h3>
                        <div className="log-score-grid">
                            <div className="log-score-item log-score-good">
                                <span className="log-score-num">{correctFlags.length}</span>
                                <span className="log-score-label">Threats found</span>
                            </div>
                            <div className="log-score-item log-score-total">
                                <span className="log-score-num">{totalSuspicious}</span>
                                <span className="log-score-label">Total threats</span>
                            </div>
                            <div className="log-score-item log-score-bad">
                                <span className="log-score-num">{falsePositives.length}</span>
                                <span className="log-score-label">False positives</span>
                            </div>
                            <div className="log-score-item log-score-missed">
                                <span className="log-score-num">{missed.length}</span>
                                <span className="log-score-label">Missed</span>
                            </div>
                        </div>
                        {missed.length > 0 && (
                            <div className="log-missed-list">
                                <div className="log-missed-title">⚠️ You missed:</div>
                                {missed.map(m => (
                                    <div key={m.id} className="log-missed-item">{m.reason}</div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Controls */}
                <div className="log-controls">
                    {phase === 'intro' && (
                        <motion.button
                            className="log-btn log-btn-start"
                            onClick={() => { setCurrentStep(1); setTimeout(startHunt, 600); }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            🕵️ Start Threat Hunting
                        </motion.button>
                    )}
                    {phase === 'hunting' && (
                        <div className="log-hunting-bar">
                            <span className="log-hunt-count">
                                🚨 {flagged.length} flagged ({totalSuspicious} actual threats)
                            </span>
                            <motion.button
                                className="log-btn log-btn-submit"
                                onClick={submitAnalysis}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                📊 Submit Analysis
                            </motion.button>
                        </div>
                    )}
                    {phase === 'done' && (
                        <motion.button
                            className="log-btn log-btn-reset"
                            onClick={reset}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            ↻ Try Again
                        </motion.button>
                    )}
                </div>
            </div>
        </LessonLayout>
    )
}
