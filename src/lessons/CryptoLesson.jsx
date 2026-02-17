import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LessonLayout from '../components/LessonLayout'
import StepExplainer from '../components/StepExplainer'
import './CryptoLesson.css'

/* — Simple hash function (djb2 variant) to simulate real hashing — */
function fakeHash(str, algo) {
    let hash = 5381
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0
    }
    const hex = hash.toString(16).padStart(8, '0')
    if (algo === 'MD5') return hex + hex.slice(0, 8) + hex.slice(2, 10) + hex.slice(4, 12)
    if (algo === 'SHA256') return hex + hex.slice(1) + hex.slice(2) + hex.slice(0, 7) + hex.slice(3, 11) + hex.slice(1, 9) + hex.slice(4) + hex.slice(0, 8)
    return hex
}

/* — Password database (hashed) — */
const passwords = [
    { user: 'admin', plaintext: 'password123', algo: 'MD5' },
    { user: 'jsmith', plaintext: 'letmein', algo: 'MD5' },
    { user: 'root', plaintext: 'qwerty', algo: 'SHA256' },
    { user: 'dbadmin', plaintext: 'hunter2', algo: 'SHA256' },
    { user: 'ceo_karen', plaintext: 'Karen2024!', algo: 'SHA256' },
]

/* — Wordlist for rainbow table attack — */
const wordlist = [
    'password123', '123456', 'admin', 'letmein', 'qwerty',
    'abc123', 'monkey', 'dragon', 'master', 'hunter2',
    'iloveyou', 'trustno1', 'sunshine', 'welcome', 'shadow',
]

// Pre-compute hashes
const hashDB = passwords.map(p => ({
    ...p,
    hash: fakeHash(p.plaintext, p.algo),
}))

const steps = [
    {
        title: 'What is hashing?',
        description: 'Hashing is a one-way function that converts data into a fixed-length string. Think of it like a meat grinder — you can turn meat into mince, but you can\'t turn mince back into a steak.',
    },
    {
        title: 'How passwords are stored',
        description: 'Websites don\'t store your password — they store the hash. When you log in, they hash your input and compare it to the stored hash. If they match, you\'re in.',
    },
    {
        title: 'The rainbow table attack',
        description: 'Attackers pre-compute hashes for millions of common passwords (a "rainbow table"). Then they compare stolen hashes against the table to find matches — no cracking needed!',
    },
    {
        title: 'Crack the hashes!',
        description: 'You\'ve stolen a database dump with hashed passwords. Use the wordlist on the right to try matching each hash. Click a word, then click a hash to test if they match.',
    },
    {
        title: 'Defense: salting',
        description: 'To stop rainbow tables, defenders add a random "salt" to each password before hashing. Even if two users have the same password, their hashes will be different. This is why bcrypt and Argon2 are used instead of plain MD5/SHA.',
    },
]

export default function CryptoLesson() {
    const [phase, setPhase] = useState('intro')   // intro | cracking | done
    const [selectedWord, setSelectedWord] = useState(null)
    const [cracked, setCracked] = useState({})      // { user: plaintext }
    const [attempts, setAttempts] = useState([])
    const [currentStep, setCurrentStep] = useState(0)
    const [shakeTarget, setShakeTarget] = useState(null)

    const startCracking = useCallback(() => {
        setPhase('cracking')
        setCurrentStep(3)
        setCracked({})
        setAttempts([])
    }, [])

    const tryMatch = (entry) => {
        if (phase !== 'cracking' || !selectedWord) return
        if (cracked[entry.user]) return // already cracked

        const wordHash = fakeHash(selectedWord, entry.algo)
        const match = wordHash === entry.hash

        setAttempts(prev => [
            { word: selectedWord, user: entry.user, match, algo: entry.algo },
            ...prev,
        ])

        if (match) {
            setCracked(prev => ({ ...prev, [entry.user]: selectedWord }))
        } else {
            setShakeTarget(entry.user)
            setTimeout(() => setShakeTarget(null), 500)
        }
        setSelectedWord(null)

        // Check if all crackable ones are done (ceo_karen can't be cracked)
        const crackable = hashDB.filter(e => wordlist.includes(e.plaintext))
        const newCracked = { ...cracked, ...(match ? { [entry.user]: selectedWord } : {}) }
        const crackedCount = crackable.filter(e => newCracked[e.user]).length
        if (crackedCount === crackable.length) {
            setTimeout(() => {
                setPhase('done')
                setCurrentStep(4)
            }, 800)
        }
    }

    const reset = () => {
        setPhase('intro')
        setCurrentStep(0)
        setCracked({})
        setAttempts([])
        setSelectedWord(null)
    }

    const crackedCount = Object.keys(cracked).length
    const totalCrackable = hashDB.filter(e => wordlist.includes(e.plaintext)).length

    const sidebar = <StepExplainer steps={steps} currentStep={currentStep} />

    return (
        <LessonLayout
            title="Cryptography"
            subtitle="Crack the hash — and learn why salting saves lives"
            sidebar={sidebar}
        >
            <div className="crypto-scene">
                {/* Hash Database */}
                <div className="crypto-db">
                    <div className="crypto-db-header">
                        <span className="crypto-db-icon">🗄️</span>
                        <span className="crypto-db-title">Stolen Database — user_credentials.db</span>
                    </div>
                    <div className="crypto-db-table">
                        <div className="crypto-db-row crypto-db-heading">
                            <span className="crypto-col-user">User</span>
                            <span className="crypto-col-algo">Algo</span>
                            <span className="crypto-col-hash">Hash</span>
                            <span className="crypto-col-status">Status</span>
                        </div>
                        {hashDB.map(entry => (
                            <motion.div
                                key={entry.user}
                                className={`crypto-db-row ${cracked[entry.user] ? 'crypto-row-cracked' :
                                        phase === 'cracking' && selectedWord ? 'crypto-row-target' : ''
                                    } ${shakeTarget === entry.user ? 'crypto-row-shake' : ''}`}
                                onClick={() => tryMatch(entry)}
                            >
                                <span className="crypto-col-user">{entry.user}</span>
                                <span className="crypto-col-algo">{entry.algo}</span>
                                <span className="crypto-col-hash">
                                    {cracked[entry.user]
                                        ? <span className="crypto-cracked-text">"{cracked[entry.user]}"</span>
                                        : entry.hash.slice(0, 24) + '...'
                                    }
                                </span>
                                <span className="crypto-col-status">
                                    {cracked[entry.user] ? '🔓' : '🔒'}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Wordlist Rainbow Table */}
                {(phase === 'cracking' || phase === 'done') && (
                    <div className="crypto-wordlist">
                        <div className="crypto-wordlist-header">
                            <span className="crypto-wordlist-icon">📖</span>
                            <span className="crypto-wordlist-title">Rainbow Table — common_passwords.txt</span>
                        </div>
                        <div className="crypto-wordlist-hint">
                            {selectedWord
                                ? `Selected: "${selectedWord}" — now click a hash row to test`
                                : 'Click a word to select it, then click a hash to test'}
                        </div>
                        <div className="crypto-words">
                            {wordlist.map(word => {
                                const isUsed = Object.values(cracked).includes(word)
                                return (
                                    <motion.button
                                        key={word}
                                        className={`crypto-word ${selectedWord === word ? 'crypto-word-selected' : ''} ${isUsed ? 'crypto-word-used' : ''}`}
                                        onClick={() => !isUsed && phase === 'cracking' && setSelectedWord(word === selectedWord ? null : word)}
                                        disabled={isUsed || phase === 'done'}
                                        whileHover={!isUsed ? { scale: 1.05 } : {}}
                                        whileTap={!isUsed ? { scale: 0.95 } : {}}
                                    >
                                        {word}
                                    </motion.button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Attempt Log */}
                {attempts.length > 0 && (
                    <div className="crypto-log">
                        <div className="crypto-log-header">
                            <span className="crypto-log-dot crypto-dot-red" />
                            <span className="crypto-log-dot crypto-dot-yellow" />
                            <span className="crypto-log-dot crypto-dot-green" />
                            <span className="crypto-log-title">hashcat — output log</span>
                        </div>
                        <div className="crypto-log-body">
                            {attempts.slice(0, 10).map((a, i) => (
                                <motion.div
                                    key={`${i}-${a.word}-${a.user}`}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`crypto-log-line ${a.match ? 'crypto-log-match' : 'crypto-log-miss'}`}
                                >
                                    {a.match
                                        ? `✅ CRACKED! ${a.user}:${a.algo} → "${a.word}"`
                                        : `❌ ${a.algo}("${a.word}") ≠ ${a.user}'s hash`
                                    }
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Done — Score */}
                {phase === 'done' && (
                    <motion.div
                        className="crypto-result"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h3 className="crypto-result-title">🔓 {crackedCount}/{hashDB.length} Hashes Cracked</h3>
                        <p className="crypto-result-text">
                            {crackedCount < hashDB.length
                                ? `"${hashDB.find(e => !cracked[e.user])?.user}" survived! Their password wasn't in the wordlist. Strong, unique passwords defeat rainbow tables.`
                                : 'All hashes cracked! Every password was in the common wordlist. This is why you never use simple passwords.'}
                        </p>
                        <div className="crypto-result-defense">
                            <strong>🧂 Defense: Salting</strong>
                            <p>Add a random "salt" before hashing: <code>hash(salt + password)</code>. Even identical passwords produce different hashes. This is why bcrypt &gt; MD5.</p>
                        </div>
                    </motion.div>
                )}

                {/* Controls */}
                <div className="crypto-controls">
                    {phase === 'intro' && (
                        <motion.button
                            className="crypto-btn crypto-btn-start"
                            onClick={() => { setCurrentStep(1); setTimeout(startCracking, 600); }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            🔓 Start Cracking
                        </motion.button>
                    )}
                    {phase === 'cracking' && (
                        <div className="crypto-progress-bar-row">
                            <span className="crypto-progress-text">🔓 {crackedCount}/{totalCrackable} cracked</span>
                            {!wordlist.includes(hashDB.find(e => !cracked[e.user])?.plaintext) && crackedCount === totalCrackable && (
                                <span className="crypto-progress-hint">One hash can't be cracked with this wordlist!</span>
                            )}
                        </div>
                    )}
                    {phase === 'done' && (
                        <motion.button
                            className="crypto-btn crypto-btn-reset"
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
