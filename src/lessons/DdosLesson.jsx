import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LessonLayout from '../components/LessonLayout'
import StepExplainer from '../components/StepExplainer'
import './DdosLesson.css'

const steps = [
    {
        title: 'Normal traffic',
        description: 'Think of the server as a shop at the end of a road. Cars (users) drive up, park, buy something, and leave. Everything runs smoothly.',
    },
    {
        title: 'The attack begins',
        description: 'The attacker sends thousands of fake cars to flood the road. Real customers can\'t get through — the shop is overwhelmed.',
    },
    {
        title: 'Server overloaded',
        description: 'Too many requests at once! The server can\'t tell real users from fake ones. It slows down, crashes, or becomes completely unreachable.',
    },
    {
        title: 'Defense activated',
        description: 'A firewall/filter is like a traffic police checkpoint. It inspects each car, blocks the fakes, and lets real customers through.',
    },
    {
        title: 'How to defend',
        description: 'Real defenses include rate limiting, CDNs (like Cloudflare), traffic analysis, and scaling up server capacity during attacks.',
    },
]

function Car({ type, delay, lane, speed }) {
    return (
        <motion.div
            className={`ddos-car ${type === 'legit' ? 'ddos-car-green' : 'ddos-car-red'}`}
            initial={{ x: -60 }}
            animate={{ x: '100vw' }}
            transition={{
                duration: speed || 4,
                delay: delay,
                ease: 'linear',
                repeat: Infinity,
                repeatDelay: Math.random() * 2,
            }}
            style={{ top: `${lane}%` }}
        >
            {type === 'legit' ? '🚗' : '🚗'}
        </motion.div>
    )
}

export default function DdosLesson() {
    const [phase, setPhase] = useState('normal') // normal | attack | overloaded | defense
    const [currentStep, setCurrentStep] = useState(0)
    const [serverHealth, setServerHealth] = useState(100)
    const [requestCount, setRequestCount] = useState(0)
    const intervalRef = useRef(null)

    const startAttack = () => {
        setPhase('attack')
        setCurrentStep(1)
        setServerHealth(100)
        setRequestCount(0)
    }

    useEffect(() => {
        if (phase === 'attack') {
            intervalRef.current = setInterval(() => {
                setServerHealth(prev => {
                    const next = prev - 2
                    if (next <= 0) {
                        setPhase('overloaded')
                        setCurrentStep(2)
                        clearInterval(intervalRef.current)
                        return 0
                    }
                    return next
                })
                setRequestCount(prev => prev + Math.floor(Math.random() * 500) + 200)
            }, 200)
            return () => clearInterval(intervalRef.current)
        }
    }, [phase])

    const enableDefense = () => {
        setPhase('defense')
        setCurrentStep(3)
        // Gradually restore health
        let health = 0
        const restore = setInterval(() => {
            health += 5
            setServerHealth(Math.min(health, 100))
            if (health >= 100) clearInterval(restore)
        }, 100)
    }

    const reset = () => {
        setPhase('normal')
        setCurrentStep(0)
        setServerHealth(100)
        setRequestCount(0)
        if (intervalRef.current) clearInterval(intervalRef.current)
    }

    const healthColor = serverHealth > 60 ? 'var(--accent-green)' : serverHealth > 30 ? 'var(--accent-yellow)' : 'var(--accent-red)'

    const sidebar = <StepExplainer steps={steps} currentStep={currentStep} />

    return (
        <LessonLayout
            title="DDoS Attack"
            subtitle="When millions of requests bring a server to its knees"
            sidebar={sidebar}
        >
            <div className="ddos-scene">
                {/* Road + Server Visualization */}
                <div className="ddos-road-area">
                    {/* Road */}
                    <div className="ddos-road">
                        <div className="ddos-road-surface">
                            <div className="ddos-lane-marker" />
                            <div className="ddos-lane-marker" />
                            <div className="ddos-lane-marker" />
                        </div>

                        {/* Normal cars */}
                        {phase === 'normal' && (
                            <>
                                <Car type="legit" delay={0} lane={20} speed={5} />
                                <Car type="legit" delay={1.5} lane={45} speed={6} />
                                <Car type="legit" delay={3} lane={70} speed={4.5} />
                            </>
                        )}

                        {/* Attack cars */}
                        {(phase === 'attack' || phase === 'overloaded') && (
                            <>
                                {[...Array(15)].map((_, i) => (
                                    <Car
                                        key={`attack-${i}`}
                                        type="attack"
                                        delay={i * 0.15}
                                        lane={10 + (i * 6) % 80}
                                        speed={1.5 + Math.random()}
                                    />
                                ))}
                                <Car type="legit" delay={0.5} lane={35} speed={8} />
                                <Car type="legit" delay={2} lane={60} speed={9} />
                            </>
                        )}

                        {/* Defense phase */}
                        {phase === 'defense' && (
                            <>
                                <Car type="legit" delay={0} lane={25} speed={5} />
                                <Car type="legit" delay={1} lane={50} speed={4.5} />
                                <Car type="legit" delay={2} lane={75} speed={5.5} />
                            </>
                        )}

                        {/* Firewall barrier */}
                        <AnimatePresence>
                            {phase === 'defense' && (
                                <motion.div
                                    className="ddos-firewall"
                                    initial={{ opacity: 0, scaleY: 0 }}
                                    animate={{ opacity: 1, scaleY: 1 }}
                                    transition={{ type: 'spring', stiffness: 200 }}
                                >
                                    <span className="ddos-firewall-icon">🛡️</span>
                                    <span className="ddos-firewall-label">FIREWALL</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Server */}
                    <div className={`ddos-server ${phase === 'overloaded' ? 'ddos-server-down' : ''} ${phase === 'defense' ? 'ddos-server-protected' : ''}`}>
                        <div className="ddos-server-icon">
                            {phase === 'overloaded' ? '💀' : phase === 'defense' ? '✅' : '🖥️'}
                        </div>
                        <div className="ddos-server-label">Server</div>
                    </div>
                </div>

                {/* Stats Panel */}
                <div className="ddos-stats">
                    <div className="ddos-stat">
                        <span className="ddos-stat-label">Server Health</span>
                        <div className="ddos-health-bar">
                            <motion.div
                                className="ddos-health-fill"
                                animate={{ width: `${serverHealth}%`, backgroundColor: healthColor }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <span className="ddos-stat-value" style={{ color: healthColor }}>{serverHealth}%</span>
                    </div>
                    <div className="ddos-stat">
                        <span className="ddos-stat-label">Requests/sec</span>
                        <span className="ddos-stat-value" style={{
                            color: phase === 'attack' ? 'var(--accent-red)' : phase === 'overloaded' ? 'var(--accent-red)' : 'var(--accent-green)'
                        }}>
                            {phase === 'normal' ? '~50' : phase === 'defense' ? '~45' : requestCount.toLocaleString()}
                        </span>
                    </div>
                    <div className="ddos-stat">
                        <span className="ddos-stat-label">Status</span>
                        <span className={`ddos-status-badge ddos-status-${phase}`}>
                            {phase === 'normal' ? '🟢 Online' : phase === 'attack' ? '🟡 Under Attack' : phase === 'overloaded' ? '🔴 Offline' : '🟢 Protected'}
                        </span>
                    </div>
                </div>

                {/* Controls */}
                <div className="ddos-controls">
                    {phase === 'normal' && (
                        <motion.button
                            className="ddos-btn ddos-btn-attack"
                            onClick={startAttack}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            ⚡ Launch DDoS Attack
                        </motion.button>
                    )}
                    {phase === 'attack' && (
                        <div className="ddos-attack-indicator">
                            <span className="ddos-pulse-red" /> Attack in progress...
                        </div>
                    )}
                    {phase === 'overloaded' && (
                        <motion.button
                            className="ddos-btn ddos-btn-defend"
                            onClick={enableDefense}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            🛡️ Enable Firewall Defense
                        </motion.button>
                    )}
                    {phase === 'defense' && (
                        <div className="ddos-done-controls">
                            <span className="ddos-defend-text">✅ Firewall active — malicious traffic filtered</span>
                            <motion.button
                                className="ddos-btn ddos-btn-reset"
                                onClick={() => { reset(); setCurrentStep(4); }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                ↻ Reset
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>
        </LessonLayout>
    )
}
