import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LessonLayout from '../components/LessonLayout'
import StepExplainer from '../components/StepExplainer'
import './SessionHijackLesson.css'

const steps = [
    {
        title: 'What is a session cookie?',
        description:
            'When you log in to a website, the server gives your browser a "session cookie" — like a VIP wristband at a club. You show it instead of your password every time you do something.',
    },
    {
        title: 'Logging in',
        description:
            'You enter your username and password. The server checks them and hands you a unique wristband (cookie). From now on, the server recognises you by the wristband alone.',
    },
    {
        title: 'Browsing with your wristband',
        description:
            'Every time you visit a new page, your browser automatically shows the wristband. The server sees it and says "Oh, it\'s you — here\'s your data!"',
    },
    {
        title: 'The attacker steals it!',
        description:
            'On an insecure network (public WiFi without HTTPS), an attacker can "sniff" the wristband off the wire — like someone clipping your VIP band and putting it on their own wrist.',
    },
    {
        title: 'Impersonation',
        description:
            'The attacker now shows YOUR wristband to the server. The server has no idea it\'s a different person — it just sees a valid wristband and gives full access.',
    },
    {
        title: 'How to protect yourself',
        description:
            'HTTPS encrypts the wristband in transit so nobody can copy it. Secure & HttpOnly cookie flags add extra protection. Always look for the 🔒 padlock in your browser!',
    },
]

const COOKIE_VALUE = 'session=a7f3b9e2d1c8'

export default function SessionHijackLesson() {
    const [phase, setPhase] = useState('intro') // intro | login | browsing | hijack | impersonate | defense
    const [currentStep, setCurrentStep] = useState(0)
    const [secureMode, setSecureMode] = useState(false)
    const [hijackBlocked, setHijackBlocked] = useState(false)
    const [terminalLines, setTerminalLines] = useState([])
    const [browseCount, setBrowseCount] = useState(0)

    const addTerminalLine = useCallback((text, type = 'info') => {
        setTerminalLines((prev) => [...prev, { text, type }])
    }, [])

    // Phase: Login
    const doLogin = () => {
        setPhase('login')
        setCurrentStep(1)
        setTerminalLines([
            { text: '> POST /login', type: 'command' },
            { text: '  username=alice&password=••••••', type: 'info' },
        ])

        setTimeout(() => {
            addTerminalLine('< 200 OK', 'open')
            addTerminalLine(`< Set-Cookie: ${COOKIE_VALUE}`, 'open')
            addTerminalLine('', 'info')
            addTerminalLine('🎟️  Wristband received!', 'highlight')
        }, 1200)

        setTimeout(() => {
            setPhase('browsing')
            setCurrentStep(2)
            setBrowseCount(0)
        }, 3000)
    }

    // Phase: Browsing
    const browseAction = () => {
        const pages = ['/profile', '/settings', '/messages', '/dashboard']
        const page = pages[browseCount % pages.length]
        addTerminalLine(`> GET ${page}`, 'command')
        addTerminalLine(`  Cookie: ${COOKIE_VALUE}`, 'info')
        addTerminalLine(`< 200 OK — Welcome back, Alice!`, 'open')
        addTerminalLine('', 'info')
        setBrowseCount((c) => c + 1)
    }

    // Phase: Hijack attempt
    const startHijack = () => {
        setCurrentStep(3)
        setPhase('hijack')
        addTerminalLine('═══ ATTACKER VIEW ═══', 'header')

        if (secureMode) {
            addTerminalLine('🔍 Sniffing WiFi traffic...', 'info')
            setTimeout(() => {
                addTerminalLine('⚡ Intercepted packet from Alice', 'info')
                addTerminalLine('🔒 Payload: [ENCRYPTED — TLS 1.3]', 'blocked')
                addTerminalLine('❌ Cannot read cookie — HTTPS active!', 'blocked')
                addTerminalLine('', 'info')
                addTerminalLine('🛡️  Attack BLOCKED by HTTPS', 'highlight')
                setHijackBlocked(true)
            }, 1500)
        } else {
            addTerminalLine('🔍 Sniffing WiFi traffic...', 'info')
            setTimeout(() => {
                addTerminalLine('⚡ Intercepted packet from Alice', 'info')
                addTerminalLine(`🎟️ STOLEN: ${COOKIE_VALUE}`, 'stolen')
                addTerminalLine('', 'info')
            }, 1500)
            setTimeout(() => {
                setPhase('impersonate')
                setCurrentStep(4)
                addTerminalLine('═══ USING STOLEN COOKIE ═══', 'header')
                addTerminalLine(`> GET /profile`, 'command')
                addTerminalLine(`  Cookie: ${COOKIE_VALUE}`, 'stolen')
                addTerminalLine('< 200 OK — Welcome back, Alice!', 'stolen')
                addTerminalLine('', 'info')
                addTerminalLine('💀  Server thinks attacker IS Alice!', 'highlight')
            }, 3500)
        }
    }

    const enableDefense = () => {
        setSecureMode(true)
        setCurrentStep(5)
        setPhase('defense')
        setTerminalLines([
            { text: '🛡️  DEFENSE MODE ENABLED', type: 'highlight' },
            { text: '', type: 'info' },
            { text: '✅ HTTPS (TLS 1.3) — encrypts all traffic', type: 'open' },
            { text: '✅ Secure flag — cookie only sent over HTTPS', type: 'open' },
            { text: '✅ HttpOnly — JavaScript cannot access cookie', type: 'open' },
            { text: '✅ SameSite — prevents cross-site cookie use', type: 'open' },
            { text: '', type: 'info' },
            { text: 'Try the attack again to see the difference!', type: 'info' },
        ])
    }

    const reset = () => {
        setPhase('intro')
        setCurrentStep(0)
        setSecureMode(false)
        setHijackBlocked(false)
        setTerminalLines([])
        setBrowseCount(0)
    }

    const tryAgainSecure = () => {
        setPhase('browsing')
        setCurrentStep(2)
        setBrowseCount(0)
        setTerminalLines([
            { text: '🔒 HTTPS MODE ACTIVE', type: 'highlight' },
            { text: '', type: 'info' },
            { text: '> POST /login (encrypted)', type: 'command' },
            { text: `< Set-Cookie: ${COOKIE_VALUE}; Secure; HttpOnly`, type: 'open' },
            { text: '🎟️  Secure wristband received!', type: 'highlight' },
            { text: '', type: 'info' },
        ])
    }

    const sidebar = <StepExplainer steps={steps} currentStep={currentStep} />

    return (
        <LessonLayout
            title="Session Hijacking"
            subtitle="When someone steals your VIP wristband"
            sidebar={sidebar}
        >
            <div className="session-scene">
                {/* Club Scene Visualization */}
                <div className="session-club">
                    <div className="session-club-header">
                        <span className="session-club-name">🏪 CyberBank.com</span>
                        {secureMode && (
                            <motion.span
                                className="session-https-badge"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                🔒 HTTPS
                            </motion.span>
                        )}
                    </div>

                    {/* Split View: Victim + Attacker */}
                    <div className="session-split">
                        {/* Victim Side */}
                        <div className="session-side session-victim-side">
                            <div className="session-side-label">👤 Alice (You)</div>
                            <div className="session-avatar-area">
                                <motion.div
                                    className="session-avatar"
                                    animate={
                                        phase === 'browsing'
                                            ? { y: [0, -4, 0] }
                                            : phase === 'impersonate'
                                                ? { opacity: 0.4 }
                                                : {}
                                    }
                                    transition={{ duration: 2, repeat: phase === 'browsing' ? Infinity : 0 }}
                                >
                                    👩‍💻
                                </motion.div>
                                {(phase === 'login' ||
                                    phase === 'browsing' ||
                                    phase === 'hijack' ||
                                    phase === 'impersonate' ||
                                    phase === 'defense') && (
                                        <motion.div
                                            className={`session-wristband ${secureMode ? 'session-wristband-secure' : ''}`}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 400 }}
                                        >
                                            🎟️
                                            <span className="session-wristband-label">
                                                {secureMode ? '🔒 cookie' : 'cookie'}
                                            </span>
                                        </motion.div>
                                    )}
                            </div>
                        </div>

                        {/* Network Pipe */}
                        <div className="session-pipe">
                            <div className={`session-pipe-line ${secureMode ? 'session-pipe-secure' : ''}`}>
                                {secureMode ? '🔒' : '📡'}
                            </div>
                            <span className="session-pipe-label">
                                {secureMode ? 'Encrypted' : 'Public WiFi'}
                            </span>
                        </div>

                        {/* Attacker Side */}
                        <div className="session-side session-attacker-side">
                            <div className="session-side-label">🕵️ Attacker</div>
                            <div className="session-avatar-area">
                                <motion.div
                                    className="session-avatar session-avatar-attacker"
                                    animate={
                                        phase === 'hijack' && !secureMode
                                            ? { scale: [1, 1.1, 1] }
                                            : phase === 'impersonate'
                                                ? { y: [0, -4, 0] }
                                                : {}
                                    }
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    🕵️
                                </motion.div>
                                {phase === 'impersonate' && !hijackBlocked && (
                                    <motion.div
                                        className="session-wristband session-wristband-stolen"
                                        initial={{ scale: 0, rotate: -20 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        🎟️
                                        <span className="session-wristband-label">stolen!</span>
                                    </motion.div>
                                )}
                                {hijackBlocked && (
                                    <motion.div
                                        className="session-blocked-badge"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                    >
                                        ❌ Blocked
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Terminal */}
                <div className="session-terminal">
                    <div className="session-terminal-header">
                        <span className="session-terminal-dot session-dot-red" />
                        <span className="session-terminal-dot session-dot-yellow" />
                        <span className="session-terminal-dot session-dot-green" />
                        <span className="session-terminal-title">
                            Network Traffic {secureMode ? '(Encrypted 🔒)' : '(Unencrypted ⚠️)'}
                        </span>
                    </div>
                    <div className="session-terminal-body">
                        {terminalLines.map((line, i) => (
                            <motion.div
                                key={`${i}-${line.text}`}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`session-terminal-line session-line-${line.type}`}
                            >
                                {line.text}
                            </motion.div>
                        ))}
                        {(phase === 'hijack' || phase === 'login') && (
                            <span className="session-cursor">▌</span>
                        )}
                    </div>
                </div>

                {/* Controls */}
                <div className="session-controls">
                    <AnimatePresence mode="wait">
                        {phase === 'intro' && (
                            <motion.button
                                key="start"
                                className="session-btn session-btn-primary"
                                onClick={doLogin}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                🔐 Log in to CyberBank
                            </motion.button>
                        )}

                        {phase === 'browsing' && (
                            <motion.div
                                key="browsing"
                                className="session-btn-group"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.button
                                    className="session-btn session-btn-secondary"
                                    onClick={browseAction}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    🌐 Browse a page ({browseCount}/3)
                                </motion.button>
                                {browseCount >= 2 && (
                                    <motion.button
                                        className="session-btn session-btn-danger"
                                        onClick={startHijack}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        🕵️ Attacker: Steal the cookie!
                                    </motion.button>
                                )}
                            </motion.div>
                        )}

                        {(phase === 'hijack' || phase === 'impersonate') && !hijackBlocked && !secureMode && (
                            <motion.div
                                key="post-hijack"
                                className="session-btn-group"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.button
                                    className="session-btn session-btn-safe"
                                    onClick={enableDefense}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    🛡️ Enable HTTPS Defense
                                </motion.button>
                                <motion.button
                                    className="session-btn session-btn-secondary"
                                    onClick={reset}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    ↻ Start Over
                                </motion.button>
                            </motion.div>
                        )}

                        {(phase === 'hijack' && hijackBlocked) && (
                            <motion.div
                                key="blocked"
                                className="session-btn-group"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="session-success-msg">
                                    🛡️ Attack blocked! HTTPS kept the cookie safe.
                                </div>
                                <motion.button
                                    className="session-btn session-btn-secondary"
                                    onClick={reset}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    ↻ Start Over
                                </motion.button>
                            </motion.div>
                        )}

                        {phase === 'defense' && (
                            <motion.div
                                key="defense"
                                className="session-btn-group"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.button
                                    className="session-btn session-btn-primary"
                                    onClick={tryAgainSecure}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    ▶ Try Again (with HTTPS)
                                </motion.button>
                                <motion.button
                                    className="session-btn session-btn-secondary"
                                    onClick={reset}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    ↻ Start Over
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </LessonLayout>
    )
}
