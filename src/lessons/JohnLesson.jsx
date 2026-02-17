import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LessonLayout from '../components/LessonLayout'
import StepExplainer from '../components/StepExplainer'
import './JohnLesson.css'

/* ═══ Fake hash database ═══ */
function fakeHash(str) {
    let h = 0x811c9dc5
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i)
        h = Math.imul(h, 0x01000193)
    }
    const hex = ('0000000' + (h >>> 0).toString(16)).slice(-8)
    return hex + hex.slice(0, 8) + hex.slice(2, 10) + hex.slice(1, 9)
}

// Target users with hashed passwords
const TARGET_USERS = [
    { user: 'admin', password: 'password123', hash: null },
    { user: 'jsmith', password: 'letmein', hash: null },
    { user: 'root', password: 'toor', hash: null },
    { user: 'karen', password: 'iloveyou', hash: null },
    { user: 'dbadmin', password: 'Tr0ub4dor&3', hash: null }, // Strong — won't crack with our wordlist
]

// Pre-compute hashes
TARGET_USERS.forEach(u => { u.hash = fakeHash(u.password) })

// Simulated rockyou.txt excerpt (common passwords)
const ROCKYOU_WORDLIST = [
    '123456', 'password', '12345678', 'qwerty', 'abc123',
    'monkey', '1234567', 'letmein', 'trustno1', 'dragon',
    'baseball', 'iloveyou', 'master', 'sunshine', 'ashley',
    'shadow', '123123', '654321', 'superman', 'qazwsx',
    'michael', 'football', 'password1', 'password123', 'toor',
    'admin', 'welcome', 'hello', 'charlie', 'donald',
]

const ATTACK_MODES = [
    { id: 'wordlist', label: 'Wordlist Attack', desc: 'Try every word in rockyou.txt', icon: '📖' },
    { id: 'rules', label: 'Wordlist + Rules', desc: 'Apply mutations (l33t, caps, numbers)', icon: '🔧' },
    { id: 'brute', label: 'Brute Force', desc: 'Try every combination (slow!)', icon: '💪' },
]

const steps = [
    {
        title: 'What is John the Ripper?',
        description: 'John the Ripper (JtR) is one of the most famous password cracking tools. It takes a file of password hashes and tries to find the original passwords using wordlists, rules, and brute-force attacks.',
    },
    {
        title: 'The Hash File',
        description: 'We\'ve obtained a file with 5 user hashes from a compromised database. Each line contains a username and its hashed password. Our job: crack as many as possible.',
    },
    {
        title: 'Choose Your Attack',
        description: 'Wordlist attacks try every word in a dictionary (like rockyou.txt — 14 million leaked passwords). Rules add mutations like capitalizing, adding numbers, or l33t speak. Brute force tries every possible combination but takes ages.',
    },
    {
        title: 'Running John',
        description: 'Watch John work through the wordlist, hashing each candidate and comparing it to our targets. When a hash matches — we\'ve cracked a password!',
    },
    {
        title: 'Defense: Why Salting Matters',
        description: 'Salting adds random data to each password before hashing, making pre-computed attacks useless. Bcrypt, scrypt, and Argon2 are slow-by-design hash functions that make cracking exponentially harder.',
    },
]

export default function JohnLesson() {
    const [phase, setPhase] = useState('hashfile')  // hashfile | mode | cracking | results | defense
    const [currentStep, setCurrentStep] = useState(0)
    const [selectedMode, setSelectedMode] = useState(null)
    const [terminalLines, setTerminalLines] = useState([])
    const [cracking, setCracking] = useState(false)
    const [crackedUsers, setCrackedUsers] = useState([])
    const [wordlistIdx, setWordlistIdx] = useState(0)
    const [attempts, setAttempts] = useState(0)
    const termRef = useRef(null)
    const intervalRef = useRef(null)

    // Auto-scroll terminal
    useEffect(() => {
        if (termRef.current) {
            termRef.current.scrollTop = termRef.current.scrollHeight
        }
    }, [terminalLines])

    const addLine = useCallback((text, type = 'output') => {
        setTerminalLines(prev => [...prev, { text, type }])
    }, [])

    const startCrack = () => {
        setPhase('cracking')
        setCurrentStep(3)
        setCracking(true)
        setCrackedUsers([])
        setWordlistIdx(0)
        setAttempts(0)

        const modeLabel = selectedMode === 'wordlist' ? '--wordlist=rockyou.txt'
            : selectedMode === 'rules' ? '--wordlist=rockyou.txt --rules'
                : '--incremental'

        setTerminalLines([
            { text: `$ john ${modeLabel} hashes.txt`, type: 'command' },
            { text: 'Loaded 5 password hashes (Raw-SHA256)', type: 'info' },
            { text: `Using wordlist: rockyou.txt (${ROCKYOU_WORDLIST.length} words)`, type: 'info' },
            { text: '', type: 'output' },
        ])

        let idx = 0
        let cracked = []
        let attemptCount = 0

        intervalRef.current = setInterval(() => {
            if (idx >= ROCKYOU_WORDLIST.length) {
                clearInterval(intervalRef.current)
                setCracking(false)
                setTerminalLines(prev => [
                    ...prev,
                    { text: '', type: 'output' },
                    { text: `Session completed. ${cracked.length}/5 passwords cracked.`, type: 'success' },
                    { text: `Total attempts: ${attemptCount}`, type: 'info' },
                    { text: `1 password remains uncracked (strong password!)`, type: 'warning' },
                ])
                setTimeout(() => setPhase('results'), 1000)
                return
            }

            const word = ROCKYOU_WORDLIST[idx]
            const hash = fakeHash(word)
            attemptCount++
            setAttempts(attemptCount)
            setWordlistIdx(idx + 1)

            // Check if this word cracks any user
            const match = TARGET_USERS.find(u =>
                u.hash === hash && !cracked.find(c => c.user === u.user)
            )

            if (match) {
                cracked.push({ user: match.user, password: word })
                setCrackedUsers([...cracked])
                setTerminalLines(prev => [
                    ...prev,
                    { text: `Trying: ${word.padEnd(16)} → ${hash.slice(0, 16)}...`, type: 'dim' },
                    { text: `  ✓ CRACKED: ${match.user}:${word}`, type: 'crack' },
                ])
            } else {
                // Show every 3rd attempt to keep terminal readable
                if (idx % 3 === 0) {
                    setTerminalLines(prev => [
                        ...prev,
                        { text: `Trying: ${word.padEnd(16)} → ${hash.slice(0, 16)}...`, type: 'dim' },
                    ])
                }
            }

            idx++
        }, 120)
    }

    const showDefense = () => {
        setPhase('defense')
        setCurrentStep(4)
    }

    const reset = () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setPhase('hashfile')
        setCurrentStep(0)
        setSelectedMode(null)
        setTerminalLines([])
        setCracking(false)
        setCrackedUsers([])
        setWordlistIdx(0)
        setAttempts(0)
    }

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [])

    const sidebar = <StepExplainer steps={steps} currentStep={currentStep} />

    return (
        <LessonLayout
            title="John the Ripper"
            subtitle="Crack the hashes — with rockyou.txt"
            sidebar={sidebar}
        >
            <div className="jtr-scene">
                {/* Phase: Hash File */}
                {phase === 'hashfile' && (
                    <motion.div className="jtr-hashfile" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="jtr-file-card">
                            <div className="jtr-file-header">
                                <span>📄 hashes.txt</span>
                                <span className="jtr-file-badge">5 entries</span>
                            </div>
                            <div className="jtr-file-body">
                                {TARGET_USERS.map((u, i) => (
                                    <div key={i} className="jtr-hash-row">
                                        <span className="jtr-hash-user">{u.user}</span>
                                        <span className="jtr-hash-sep">:</span>
                                        <code className="jtr-hash-val">{u.hash}</code>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <motion.button
                            className="jtr-btn jtr-btn-primary"
                            onClick={() => { setPhase('mode'); setCurrentStep(2) }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            🔨 Choose Attack Mode
                        </motion.button>
                    </motion.div>
                )}

                {/* Phase: Mode Select */}
                {phase === 'mode' && (
                    <motion.div className="jtr-modes" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h3 className="jtr-section-title">Choose Attack Mode</h3>
                        <div className="jtr-mode-grid">
                            {ATTACK_MODES.map(m => (
                                <motion.button
                                    key={m.id}
                                    className={`jtr-mode-card ${selectedMode === m.id ? 'jtr-mode-selected' : ''}`}
                                    onClick={() => setSelectedMode(m.id)}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <span className="jtr-mode-icon">{m.icon}</span>
                                    <span className="jtr-mode-label">{m.label}</span>
                                    <span className="jtr-mode-desc">{m.desc}</span>
                                </motion.button>
                            ))}
                        </div>

                        {/* Wordlist preview */}
                        <div className="jtr-wordlist-card">
                            <div className="jtr-wordlist-header">
                                <span>📖 rockyou.txt</span>
                                <span className="jtr-wordlist-meta">{ROCKYOU_WORDLIST.length} words (excerpt from 14M)</span>
                            </div>
                            <div className="jtr-wordlist-body">
                                {ROCKYOU_WORDLIST.map((w, i) => (
                                    <span key={i} className="jtr-word">{w}</span>
                                ))}
                            </div>
                        </div>

                        <motion.button
                            className="jtr-btn jtr-btn-primary"
                            onClick={startCrack}
                            disabled={!selectedMode}
                            whileHover={selectedMode ? { scale: 1.05 } : {}}
                            whileTap={selectedMode ? { scale: 0.95 } : {}}
                            style={{ opacity: selectedMode ? 1 : 0.4 }}
                        >
                            💣 Run John
                        </motion.button>
                    </motion.div>
                )}

                {/* Phase: Cracking */}
                {phase === 'cracking' && (
                    <motion.div className="jtr-cracking" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {/* Progress */}
                        <div className="jtr-progress-bar">
                            <div className="jtr-progress-fill" style={{ width: `${(wordlistIdx / ROCKYOU_WORDLIST.length) * 100}%` }} />
                            <span className="jtr-progress-label">
                                {wordlistIdx}/{ROCKYOU_WORDLIST.length} words • {attempts} attempts • {crackedUsers.length}/5 cracked
                            </span>
                        </div>

                        {/* Terminal */}
                        <div className="jtr-terminal" ref={termRef}>
                            {terminalLines.map((line, i) => (
                                <div key={i} className={`jtr-term-line jtr-term-${line.type}`}>
                                    {line.text}
                                </div>
                            ))}
                            {cracking && <span className="jtr-cursor">█</span>}
                        </div>

                        {/* Cracked list on the side */}
                        <div className="jtr-cracked-sidebar">
                            <div className="jtr-cracked-header">🔓 Cracked ({crackedUsers.length}/5)</div>
                            {crackedUsers.map((c, i) => (
                                <motion.div key={i} className="jtr-cracked-row" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                                    <span className="jtr-cracked-user">{c.user}</span>
                                    <code className="jtr-cracked-pass">{c.password}</code>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Phase: Results */}
                {phase === 'results' && (
                    <motion.div className="jtr-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h3 className="jtr-section-title">📊 Cracking Results</h3>
                        <div className="jtr-results-grid">
                            {TARGET_USERS.map((u, i) => {
                                const cracked = crackedUsers.find(c => c.user === u.user)
                                return (
                                    <div key={i} className={`jtr-result-card ${cracked ? 'jtr-result-cracked' : 'jtr-result-safe'}`}>
                                        <div className="jtr-result-status">{cracked ? '🔓' : '🔒'}</div>
                                        <div className="jtr-result-user">{u.user}</div>
                                        {cracked
                                            ? <code className="jtr-result-pass">{cracked.password}</code>
                                            : <span className="jtr-result-safe-label">Not cracked!</span>
                                        }
                                    </div>
                                )
                            })}
                        </div>
                        <div className="jtr-result-insight">
                            <strong>Key insight:</strong> 4 of 5 passwords were in rockyou.txt — a list of real leaked passwords.
                            The one that survived (<code>Tr0ub4dor&3</code>) used mixed case, numbers, and special characters.
                        </div>
                        <motion.button className="jtr-btn jtr-btn-primary" onClick={showDefense} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            🛡️ How to Defend
                        </motion.button>
                    </motion.div>
                )}

                {/* Phase: Defense */}
                {phase === 'defense' && (
                    <motion.div className="jtr-defense" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h3 className="jtr-section-title">🛡️ Defense Against Hash Cracking</h3>
                        <div className="jtr-defense-grid">
                            <div className="jtr-defense-card">
                                <div className="jtr-defense-label">Salting</div>
                                <code>hash(salt + password)</code>
                                <p>Adds random data to each password before hashing, so two users with the same password get different hashes. Renders rainbow tables useless.</p>
                            </div>
                            <div className="jtr-defense-card">
                                <div className="jtr-defense-label">Slow Hash Functions</div>
                                <code>bcrypt, scrypt, Argon2</code>
                                <p>Designed to be slow (100ms+ per hash). John can try billions of MD5's per second, but only thousands of bcrypt hashes.</p>
                            </div>
                            <div className="jtr-defense-card">
                                <div className="jtr-defense-label">Password Policies</div>
                                <code>min 12 chars, unique, no reuse</code>
                                <p>The best hash function can't save "password123". Enforce length, uniqueness, and check against known breach lists.</p>
                            </div>
                            <div className="jtr-defense-card">
                                <div className="jtr-defense-label">MFA</div>
                                <code>TOTP, WebAuthn, hardware keys</code>
                                <p>Even if the password is cracked, MFA ensures the attacker still can't log in without a second factor.</p>
                            </div>
                        </div>
                        <motion.button className="jtr-btn jtr-btn-reset" onClick={reset} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            ↻ Try Again
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </LessonLayout>
    )
}
