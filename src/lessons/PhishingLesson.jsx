import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LessonLayout from '../components/LessonLayout'
import StepExplainer from '../components/StepExplainer'
import './PhishingLesson.css'

const redFlags = [
    { id: 'sender', label: 'Suspicious sender', area: 'sender', detail: 'The email is from "support@secureb4nk.com" — notice the "4" instead of "a". Real banks use their official domain.' },
    { id: 'urgency', label: 'Creates urgency', area: 'urgency', detail: '"URGENT: Your account will be suspended in 24 hours!" — Phishers use fear and urgency to make you act without thinking.' },
    { id: 'link', label: 'Fake link', area: 'link', detail: 'The button says "Verify Account" but hovering shows it goes to "http://evil-site.ru/login" — not the real bank at all.' },
    { id: 'greeting', label: 'Generic greeting', area: 'greeting', detail: '"Dear Customer" instead of your actual name. Real companies address you by name because they know who you are.' },
    { id: 'typos', label: 'Grammar mistakes', area: 'typos', detail: '"Please verificate your informations" — poor grammar and spelling is a classic sign of a scam email.' },
]

const steps = [
    {
        title: 'The email arrives',
        description: 'A new email lands in your inbox. It looks like it\'s from your bank — complete with logos and familiar layout. But is it real?',
    },
    {
        title: 'Spot the red flags',
        description: 'Click on the highlighted areas to discover the warning signs. Real phishing emails often have subtle clues that reveal they\'re fake.',
    },
    {
        title: 'What if you click?',
        description: 'If you click the fake link, you\'d be taken to a page that looks like your bank\'s login. But any password you enter goes straight to the attacker.',
    },
    {
        title: 'How to protect yourself',
        description: 'Never click suspicious links. Hover to check URLs first. When in doubt, go directly to the website by typing the address yourself. Report suspicious emails.',
    },
]

export default function PhishingLesson() {
    const [phase, setPhase] = useState('inbox') // inbox | reading | spotting | result
    const [foundFlags, setFoundFlags] = useState([])
    const [currentStep, setCurrentStep] = useState(0)
    const [choice, setChoice] = useState(null) // 'click' | 'report'

    const openEmail = () => {
        setPhase('reading')
        setCurrentStep(1)
    }

    const startSpotting = () => {
        setPhase('spotting')
        setCurrentStep(1)
    }

    const clickFlag = (flagId) => {
        if (!foundFlags.includes(flagId)) {
            const newFlags = [...foundFlags, flagId]
            setFoundFlags(newFlags)
            if (newFlags.length === redFlags.length) {
                setCurrentStep(2)
            }
        }
    }

    const makeChoice = (c) => {
        setChoice(c)
        setPhase('result')
        setCurrentStep(c === 'report' ? 3 : 2)
    }

    const reset = () => {
        setPhase('inbox')
        setFoundFlags([])
        setCurrentStep(0)
        setChoice(null)
    }

    const sidebar = <StepExplainer steps={steps} currentStep={currentStep} />

    return (
        <LessonLayout
            title="Phishing"
            subtitle="How fake emails trick people into giving away their secrets"
            sidebar={sidebar}
        >
            <div className="phish-scene">
                <AnimatePresence mode="wait">
                    {/* PHASE: Inbox */}
                    {phase === 'inbox' && (
                        <motion.div
                            key="inbox"
                            className="phish-inbox"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="phish-inbox-header">
                                <span>📥 Inbox</span>
                                <span className="phish-badge">1 new</span>
                            </div>
                            <motion.div
                                className="phish-email-preview"
                                onClick={openEmail}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <div className="phish-email-dot" />
                                <div className="phish-preview-content">
                                    <div className="phish-preview-sender">SecureBank Support</div>
                                    <div className="phish-preview-subject">⚠️ URGENT: Account Security Alert</div>
                                    <div className="phish-preview-snippet">Dear Customer, we have detected unusual activity on your account...</div>
                                </div>
                                <span className="phish-preview-time">2m ago</span>
                            </motion.div>
                            <p className="phish-instruction">👆 Click the email to open it</p>
                        </motion.div>
                    )}

                    {/* PHASE: Reading / Spotting */}
                    {(phase === 'reading' || phase === 'spotting') && (
                        <motion.div
                            key="email"
                            className="phish-email"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* Email Header */}
                            <div className="phish-email-header">
                                <div
                                    data-flag="sender"
                                    onClick={() => phase === 'spotting' && clickFlag('sender')}
                                    className={`phish-email-from ${phase === 'spotting' ? 'phish-clickable' : ''} ${foundFlags.includes('sender') ? 'phish-found' : ''}`}
                                >
                                    <span className="phish-from-label">From:</span>
                                    <span>support@secureb<strong>4</strong>nk.com</span>
                                    {foundFlags.includes('sender') && <span className="phish-flag-badge">🚩 Fake sender!</span>}
                                </div>
                                <div className="phish-email-subject">⚠️ URGENT: Account Security Alert</div>
                            </div>

                            {/* Email Body */}
                            <div className="phish-email-body">
                                <div
                                    onClick={() => phase === 'spotting' && clickFlag('greeting')}
                                    className={`phish-line ${phase === 'spotting' ? 'phish-clickable' : ''} ${foundFlags.includes('greeting') ? 'phish-found' : ''}`}
                                >
                                    Dear Customer,
                                    {foundFlags.includes('greeting') && <span className="phish-flag-badge">🚩 Generic greeting!</span>}
                                </div>

                                <div
                                    onClick={() => phase === 'spotting' && clickFlag('urgency')}
                                    className={`phish-line phish-urgency ${phase === 'spotting' ? 'phish-clickable' : ''} ${foundFlags.includes('urgency') ? 'phish-found' : ''}`}
                                >
                                    We have detected unusual activity on your account. <strong>Your account will be suspended within 24 hours</strong> unless you verify your identity immediately.
                                    {foundFlags.includes('urgency') && <span className="phish-flag-badge">🚩 Creates panic!</span>}
                                </div>

                                <div
                                    onClick={() => phase === 'spotting' && clickFlag('typos')}
                                    className={`phish-line ${phase === 'spotting' ? 'phish-clickable' : ''} ${foundFlags.includes('typos') ? 'phish-found' : ''}`}
                                >
                                    Please verificate your informations by clicking the button below to secure your account.
                                    {foundFlags.includes('typos') && <span className="phish-flag-badge">🚩 Bad grammar!</span>}
                                </div>

                                <div
                                    onClick={() => phase === 'spotting' && clickFlag('link')}
                                    className={`phish-cta-area ${phase === 'spotting' ? 'phish-clickable' : ''} ${foundFlags.includes('link') ? 'phish-found' : ''}`}
                                >
                                    <div className="phish-cta-btn">🔒 Verify My Account</div>
                                    <div className="phish-fake-url">→ http://evil-site.ru/login</div>
                                    {foundFlags.includes('link') && <span className="phish-flag-badge">🚩 Fake URL!</span>}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="phish-actions">
                                {phase === 'reading' && (
                                    <motion.button
                                        className="phish-btn phish-btn-start"
                                        onClick={startSpotting}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        🔍 Find the Red Flags ({foundFlags.length}/{redFlags.length})
                                    </motion.button>
                                )}
                                {phase === 'spotting' && (
                                    <>
                                        <div className="phish-counter">
                                            Found: {foundFlags.length}/{redFlags.length} red flags
                                        </div>
                                        {foundFlags.length === redFlags.length && (
                                            <div className="phish-choice-area">
                                                <p className="phish-choice-prompt">All flags found! What would you do?</p>
                                                <div className="phish-choice-btns">
                                                    <motion.button
                                                        className="phish-btn phish-btn-danger"
                                                        onClick={() => makeChoice('click')}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        Click the Link
                                                    </motion.button>
                                                    <motion.button
                                                        className="phish-btn phish-btn-safe"
                                                        onClick={() => makeChoice('report')}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        🛡️ Report & Delete
                                                    </motion.button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* PHASE: Result */}
                    {phase === 'result' && (
                        <motion.div
                            key="result"
                            className={`phish-result ${choice === 'click' ? 'phish-result-bad' : 'phish-result-good'}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            {choice === 'click' ? (
                                <>
                                    <div className="phish-result-icon">💀</div>
                                    <h3>Credentials Stolen!</h3>
                                    <p>You entered your password on a fake site. The attacker now has your login credentials and can access your real bank account.</p>
                                    <div className="phish-stolen-data">
                                        <div className="phish-data-line">📧 Email: victim@email.com</div>
                                        <div className="phish-data-line">🔑 Password: ••••••••</div>
                                        <div className="phish-data-line">💰 Bank access: COMPROMISED</div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="phish-result-icon">🛡️</div>
                                    <h3>Great Choice!</h3>
                                    <p>You reported the phishing email and avoided the trap. Your account is safe. Here are the red flags you spotted:</p>
                                    <div className="phish-flags-summary">
                                        {redFlags.map(f => (
                                            <div key={f.id} className="phish-flag-item">
                                                <span>✅</span>
                                                <span>{f.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                            <motion.button
                                className="phish-btn phish-btn-start"
                                onClick={reset}
                                whileHover={{ scale: 1.05 }}
                                style={{ marginTop: 24 }}
                            >
                                ↻ Try Again
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </LessonLayout>
    )
}
