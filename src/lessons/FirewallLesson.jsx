import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LessonLayout from '../components/LessonLayout'
import StepExplainer from '../components/StepExplainer'
import './FirewallLesson.css'

/* — rule set the user can toggle — */
const defaultRules = [
    { id: 1, port: 22, service: 'SSH', action: 'allow', description: 'Remote terminal access' },
    { id: 2, port: 80, service: 'HTTP', action: 'allow', description: 'Website traffic' },
    { id: 3, port: 443, service: 'HTTPS', action: 'allow', description: 'Encrypted website traffic' },
    { id: 4, port: 3306, service: 'MySQL', action: 'deny', description: 'Database server' },
    { id: 5, port: 8080, service: 'Proxy', action: 'deny', description: 'Alternative web port' },
]

/* — incoming packets that arrive during the simulation — */
const packetWaves = [
    { src: '10.0.0.5', port: 80, label: 'Web visitor', intent: 'legit' },
    { src: '10.0.0.12', port: 443, label: 'HTTPS request', intent: 'legit' },
    { src: '45.33.32.156', port: 22, label: 'SSH brute-force', intent: 'attack' },
    { src: '192.168.1.99', port: 3306, label: 'DB exfiltration', intent: 'attack' },
    { src: '10.0.0.8', port: 80, label: 'API call', intent: 'legit' },
    { src: '172.16.0.44', port: 8080, label: 'Proxy scan', intent: 'attack' },
]

const steps = [
    {
        title: 'What is a firewall?',
        description: 'Think of a firewall as a bouncer at a nightclub. Every packet (person) that arrives must show ID (port number). The bouncer checks their list: "Port 80? Come on in. Port 3306? Not on the list — go home."',
    },
    {
        title: 'Setting the rules',
        description: 'Before the club opens, you write the guest list. Each rule says: "If someone arrives at port X, ALLOW or DENY them." Green means let in, red means block.',
    },
    {
        title: 'Packets arrive!',
        description: 'Network traffic hits the firewall. Each packet has a source IP and a destination port. The firewall checks its rules instantly — allow or deny, no exceptions.',
    },
    {
        title: 'Results',
        description: 'Allowed packets reach the server. Denied packets bounce off. A good firewall blocks attackers while letting legitimate traffic through.',
    },
    {
        title: 'Defense in depth',
        description: 'Firewalls are the first line of defense. But they\'re not enough alone — attackers can use allowed ports (like 80) for attacks. That\'s why we combine firewalls with IDS, logging, and monitoring.',
    },
]

export default function FirewallLesson() {
    const [rules, setRules] = useState(defaultRules.map(r => ({ ...r })))
    const [phase, setPhase] = useState('config')   // config | running | done
    const [packets, setPackets] = useState([])
    const [currentPacket, setCurrentPacket] = useState(-1)
    const [log, setLog] = useState([])
    const [currentStep, setCurrentStep] = useState(0)

    const toggleRule = (id) => {
        if (phase !== 'config') return
        setRules(prev => prev.map(r =>
            r.id === id ? { ...r, action: r.action === 'allow' ? 'deny' : 'allow' } : r
        ))
    }

    const startSimulation = useCallback(() => {
        setPhase('running')
        setCurrentStep(2)
        setPackets([])
        setCurrentPacket(-1)
        setLog([{ text: '$ sudo iptables -L --line-numbers', type: 'command' }])

        // Log the current rules
        const ruleLog = rules.map((r, i) =>
            ({ text: `${i + 1}  ${r.action.toUpperCase().padEnd(6)} tcp dpt:${r.port} (${r.service})`, type: r.action === 'allow' ? 'allow' : 'deny' })
        )
        setLog(prev => [...prev, { text: 'Chain INPUT (policy DROP)', type: 'header' }, ...ruleLog, { text: '', type: 'info' }, { text: 'Listening for incoming connections...', type: 'info' }])

        // Start packet arrivals
        packetWaves.forEach((pkt, i) => {
            setTimeout(() => {
                const rule = rules.find(r => r.port === pkt.port)
                const action = rule ? rule.action : 'deny'
                const result = { ...pkt, action, id: i }

                setCurrentPacket(i)
                setPackets(prev => [...prev, result])
                setLog(prev => [
                    ...prev,
                    {
                        text: `[${pkt.src}] → :${pkt.port} (${pkt.label}) → ${action === 'allow' ? '✅ ALLOWED' : '🚫 BLOCKED'}`,
                        type: action,
                    },
                ])

                // If last packet
                if (i === packetWaves.length - 1) {
                    setTimeout(() => {
                        setPhase('done')
                        setCurrentStep(3)
                        const allowed = packetWaves.filter(p => {
                            const r = rules.find(ru => ru.port === p.port)
                            return r && r.action === 'allow'
                        }).length
                        const blocked = packetWaves.length - allowed
                        setLog(prev => [
                            ...prev,
                            { text: '', type: 'info' },
                            { text: `Session complete: ${allowed} allowed, ${blocked} blocked`, type: 'info' },
                        ])
                    }, 1000)
                }
            }, (i + 1) * 1800)
        })
    }, [rules])

    const reset = () => {
        setPhase('config')
        setCurrentStep(4)
        setPackets([])
        setCurrentPacket(-1)
        setLog([])
    }

    // Stats
    const allowed = packets.filter(p => p.action === 'allow')
    const blocked = packets.filter(p => p.action === 'deny')
    const attacksBlocked = blocked.filter(p => p.intent === 'attack').length
    const legitsBlocked = blocked.filter(p => p.intent === 'legit').length

    const sidebar = <StepExplainer steps={steps} currentStep={currentStep} />

    return (
        <LessonLayout
            title="Firewall Logic"
            subtitle="The bouncer that decides who gets in"
            sidebar={sidebar}
        >
            <div className="fw-scene">
                {/* Rule Configuration Panel */}
                <div className="fw-rules-panel">
                    <div className="fw-rules-header">
                        <span className="fw-rules-icon">📋</span>
                        <span className="fw-rules-title">Firewall Rules</span>
                        {phase === 'config' && <span className="fw-rules-hint">Click to toggle</span>}
                    </div>
                    <div className="fw-rules-grid">
                        {rules.map(rule => (
                            <motion.button
                                key={rule.id}
                                className={`fw-rule ${rule.action === 'allow' ? 'fw-rule-allow' : 'fw-rule-deny'}`}
                                onClick={() => toggleRule(rule.id)}
                                disabled={phase !== 'config'}
                                whileHover={phase === 'config' ? { scale: 1.03 } : {}}
                                whileTap={phase === 'config' ? { scale: 0.97 } : {}}
                            >
                                <div className="fw-rule-top">
                                    <span className="fw-rule-port">:{rule.port}</span>
                                    <span className={`fw-rule-action ${rule.action}`}>
                                        {rule.action === 'allow' ? '✅ ALLOW' : '🚫 DENY'}
                                    </span>
                                </div>
                                <div className="fw-rule-bottom">
                                    <span className="fw-rule-service">{rule.service}</span>
                                    <span className="fw-rule-desc">{rule.description}</span>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Firewall Wall Visualization */}
                <div className="fw-wall-container">
                    <div className="fw-internet-label">🌐 Internet</div>

                    <div className="fw-wall-scene">
                        {/* Incoming packets */}
                        <div className="fw-packets-lane">
                            <AnimatePresence>
                                {packets.map((pkt) => (
                                    <motion.div
                                        key={pkt.id}
                                        className={`fw-packet ${pkt.action === 'allow' ? 'fw-packet-allow' : 'fw-packet-deny'}`}
                                        initial={{ x: -80, opacity: 0 }}
                                        animate={{ x: pkt.action === 'allow' ? 200 : 40, opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                                    >
                                        <span className="fw-packet-label">:{pkt.port}</span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* The Firewall Wall */}
                        <div className="fw-wall">
                            <div className="fw-wall-text">🛡️ FIREWALL</div>
                            <div className="fw-wall-glow" />
                        </div>
                    </div>

                    <div className="fw-server-label">🖥️ Server</div>
                </div>

                {/* Terminal Log */}
                {log.length > 0 && (
                    <div className="fw-terminal">
                        <div className="fw-terminal-header">
                            <span className="fw-terminal-dot fw-dot-red" />
                            <span className="fw-terminal-dot fw-dot-yellow" />
                            <span className="fw-terminal-dot fw-dot-green" />
                            <span className="fw-terminal-title">Terminal — iptables log</span>
                        </div>
                        <div className="fw-terminal-body">
                            {log.map((line, i) => (
                                <motion.div
                                    key={`${i}-${line.text}`}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`fw-log-line ${line.type === 'allow' ? 'fw-log-allow' :
                                            line.type === 'deny' ? 'fw-log-deny' :
                                                line.type === 'header' ? 'fw-log-header' :
                                                    line.type === 'command' ? 'fw-log-command' : ''
                                        }`}
                                >
                                    {line.text}
                                </motion.div>
                            ))}
                            {phase === 'running' && <span className="fw-cursor">▌</span>}
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div className="fw-controls">
                    {phase === 'config' && (
                        <motion.button
                            className="fw-btn fw-btn-start"
                            onClick={() => { setCurrentStep(1); setTimeout(startSimulation, 800); }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            🛡️ Activate Firewall & Start Simulation
                        </motion.button>
                    )}
                    {phase === 'running' && (
                        <div className="fw-running-indicator">
                            <span className="fw-pulse" />
                            Processing packet {currentPacket + 1} of {packetWaves.length}...
                        </div>
                    )}
                    {phase === 'done' && (
                        <div className="fw-done-controls">
                            <div className="fw-results-summary">
                                <span className="fw-result-allowed">
                                    ✅ {allowed.length} allowed
                                </span>
                                <span className="fw-result-blocked">
                                    🚫 {blocked.length} blocked
                                </span>
                                {attacksBlocked > 0 && (
                                    <span className="fw-result-attacks">
                                        🎯 {attacksBlocked} attacks stopped
                                    </span>
                                )}
                                {legitsBlocked > 0 && (
                                    <span className="fw-result-warning">
                                        ⚠️ {legitsBlocked} legit traffic blocked
                                    </span>
                                )}
                            </div>
                            <motion.button
                                className="fw-btn fw-btn-reset"
                                onClick={reset}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                ↻ Reconfigure Rules
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>
        </LessonLayout>
    )
}
