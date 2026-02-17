import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LessonLayout from '../components/LessonLayout'
import StepExplainer from '../components/StepExplainer'
import './MitmLesson.css'

const steps = [
    {
        title: 'The coffee shop',
        description: 'You\'re at a café, connected to the free WiFi. You open your banking app to check your balance. Everything seems normal.',
    },
    {
        title: 'The eavesdropper',
        description: 'An attacker at the next table has set up a fake WiFi hotspot with the same name as the café\'s. Your phone connected to theirs instead.',
    },
    {
        title: 'Intercepted!',
        description: 'Now every message you send passes through the attacker\'s laptop first. They can read your passwords, messages, and banking info before forwarding it to the real server.',
    },
    {
        title: 'How it works',
        description: 'The attacker sits "in the middle" — between you and the server. They relay messages both ways, so neither side knows they\'re being spied on.',
    },
    {
        title: 'How to protect yourself',
        description: 'Always check for HTTPS (🔒). Use a VPN on public WiFi. Never enter sensitive info on networks you don\'t trust. Verify WiFi network names with staff.',
    },
]

const messages = [
    { from: 'you', text: 'Login: john@bank.com', type: 'credential' },
    { from: 'you', text: 'Password: MyS3cur3P@ss', type: 'credential' },
    { from: 'server', text: 'Welcome back, John!', type: 'response' },
    { from: 'you', text: 'Transfer $500 to Alice', type: 'action' },
    { from: 'server', text: 'Transfer complete ✓', type: 'response' },
]

export default function MitmLesson() {
    const [phase, setPhase] = useState('safe') // safe | connecting | intercepted | revealed
    const [currentStep, setCurrentStep] = useState(0)
    const [visibleMessages, setVisibleMessages] = useState([])
    const [stolenData, setStolenData] = useState([])

    const startDemo = () => {
        setPhase('connecting')
        setCurrentStep(1)

        setTimeout(() => {
            setPhase('intercepted')
            setCurrentStep(2)
            // Show messages one by one
            messages.forEach((msg, i) => {
                setTimeout(() => {
                    setVisibleMessages(prev => [...prev, msg])
                    if (msg.type === 'credential' || msg.type === 'action') {
                        setTimeout(() => {
                            setStolenData(prev => [...prev, msg.text])
                        }, 400)
                    }
                    if (i === messages.length - 1) {
                        setTimeout(() => {
                            setCurrentStep(3)
                            setPhase('revealed')
                        }, 1000)
                    }
                }, (i + 1) * 1500)
            })
        }, 2000)
    }

    const reset = () => {
        setPhase('safe')
        setCurrentStep(0)
        setVisibleMessages([])
        setStolenData([])
    }

    const sidebar = <StepExplainer steps={steps} currentStep={currentStep} />

    return (
        <LessonLayout
            title="Man-in-the-Middle"
            subtitle="When someone secretly listens to your private conversations"
            sidebar={sidebar}
        >
            <div className="mitm-scene">
                {/* Network Diagram */}
                <div className="mitm-diagram">
                    {/* You */}
                    <div className="mitm-node mitm-you">
                        <div className="mitm-node-icon">👤</div>
                        <div className="mitm-node-label">You</div>
                        <div className="mitm-node-sub">☕ Café WiFi</div>
                    </div>

                    {/* Connection Line 1 */}
                    <div className="mitm-connection">
                        <div className={`mitm-line ${phase !== 'safe' ? 'mitm-line-danger' : ''}`}>
                            {phase === 'intercepted' || phase === 'revealed' ? (
                                <motion.div
                                    className="mitm-packet"
                                    animate={{ x: [0, 100, 0] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                                />
                            ) : null}
                        </div>
                    </div>

                    {/* Attacker */}
                    <AnimatePresence>
                        {phase !== 'safe' && (
                            <motion.div
                                className="mitm-node mitm-attacker"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                            >
                                <div className="mitm-node-icon">🕵️</div>
                                <div className="mitm-node-label">Attacker</div>
                                <div className="mitm-node-sub">Fake hotspot</div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Connection Line 2 */}
                    <div className="mitm-connection">
                        <div className={`mitm-line ${phase !== 'safe' ? 'mitm-line-danger' : 'mitm-line-safe'}`}>
                            {phase === 'intercepted' || phase === 'revealed' ? (
                                <motion.div
                                    className="mitm-packet"
                                    animate={{ x: [0, 100, 0] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: 'linear', delay: 1 }}
                                />
                            ) : null}
                        </div>
                    </div>

                    {/* Server */}
                    <div className="mitm-node mitm-server">
                        <div className="mitm-node-icon">🏦</div>
                        <div className="mitm-node-label">Bank Server</div>
                        <div className="mitm-node-sub">bank.com</div>
                    </div>
                </div>

                {/* Message Feed */}
                {visibleMessages.length > 0 && (
                    <div className="mitm-feed">
                        <div className="mitm-feed-header">📡 Intercepted Traffic</div>
                        <div className="mitm-messages">
                            {visibleMessages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    className={`mitm-msg mitm-msg-${msg.from}`}
                                    initial={{ opacity: 0, x: msg.from === 'you' ? -20 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <span className="mitm-msg-dir">
                                        {msg.from === 'you' ? '→' : '←'}
                                    </span>
                                    <span className={`mitm-msg-text ${msg.type === 'credential' ? 'mitm-msg-danger' : ''}`}>
                                        {msg.text}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Stolen Data Panel */}
                <AnimatePresence>
                    {stolenData.length > 0 && (
                        <motion.div
                            className="mitm-stolen"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="mitm-stolen-header">🔓 Attacker's Notepad</div>
                            {stolenData.map((d, i) => (
                                <motion.div
                                    key={i}
                                    className="mitm-stolen-item"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    ✏️ {d}
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Controls */}
                <div className="mitm-controls">
                    {phase === 'safe' && (
                        <motion.button
                            className="mitm-btn mitm-btn-start"
                            onClick={startDemo}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            📶 Connect to Café WiFi
                        </motion.button>
                    )}
                    {phase === 'connecting' && (
                        <div className="mitm-connecting">
                            <span className="mitm-pulse" /> Connecting to "CafeWiFi_Free"...
                        </div>
                    )}
                    {phase === 'revealed' && (
                        <div className="mitm-done">
                            <motion.button
                                className="mitm-btn mitm-btn-reset"
                                onClick={() => { reset(); setCurrentStep(4); }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                ↻ Try Again
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>
        </LessonLayout>
    )
}
