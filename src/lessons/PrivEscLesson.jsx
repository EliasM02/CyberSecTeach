import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LessonLayout from '../components/LessonLayout'
import StepExplainer from '../components/StepExplainer'
import './PrivEscLesson.css'

const steps = [
    {
        title: 'Initial access — the intern badge',
        description:
            'An attacker gains access to one low-privilege machine, like a guest getting an intern badge that only opens the lobby. They can look around but not do much damage.',
    },
    {
        title: 'Reconnaissance inside',
        description:
            'From the first desk, the attacker pokes around the network. They check shared folders, cached passwords, and configuration files — like reading the office directory on the wall.',
    },
    {
        title: 'Lateral Movement — desk to desk',
        description:
            'The attacker finds credentials on the first machine and uses them to hop to another employee\'s desktop. It\'s like sneaking through unlocked doors between offices in the same hallway.',
    },
    {
        title: 'Discovery — finding the master key',
        description:
            'On the new machine, the attacker discovers an admin password stored in a config file. They\'ve just found the janitor\'s master key ring hanging on a hook!',
    },
    {
        title: 'Privilege Escalation — VIP access',
        description:
            'Using the admin credentials, the attacker elevates from a regular user to a Domain Admin. Now they have keys to every room in the building — including the server room.',
    },
    {
        title: 'How to defend against this',
        description:
            'Principle of Least Privilege — give people only the keys they need. Remove saved passwords in config files. Use network segmentation (locked fire-doors between floors). Enable MFA everywhere.',
    },
]

/* The "office" rooms the attacker moves through */
const rooms = [
    { id: 'lobby', label: 'Lobby PC', icon: '🖥️', priv: 'guest', floor: 0 },
    { id: 'office1', label: 'Clerk PC', icon: '💼', priv: 'user', floor: 0 },
    { id: 'office2', label: 'Developer PC', icon: '👨‍💻', priv: 'user', floor: 1 },
    { id: 'server', label: 'Server Room', icon: '🖧', priv: 'admin', floor: 2 },
]

export default function PrivEscLesson() {
    // Phases: intro → recon → lateral1 → lateral2 → escalate → pwned → defense
    const [phase, setPhase] = useState('intro')
    const [currentStep, setCurrentStep] = useState(0)
    const [currentRoom, setCurrentRoom] = useState(0)
    const [privLevel, setPrivLevel] = useState('guest')
    const [terminalLines, setTerminalLines] = useState([])
    const [visitedRooms, setVisitedRooms] = useState([0])

    const addLine = useCallback((text, type = 'info') => {
        setTerminalLines((prev) => [...prev, { text, type }])
    }, [])

    /* ── Phase transitions ── */

    const startRecon = () => {
        setPhase('recon')
        setCurrentStep(1)
        setTerminalLines([
            { text: '> whoami', type: 'command' },
            { text: '  guest-intern', type: 'info' },
            { text: '> net view /domain', type: 'command' },
            { text: '  Scanning network shares...', type: 'info' },
        ])
        setTimeout(() => {
            addLine('  \\\\CLERK-PC\\SharedDocs  — READ', 'open')
            addLine('  \\\\DEV-PC\\Projects      — ACCESS DENIED', 'blocked')
            addLine('  \\\\SRV-DC01\\Admin$      — ACCESS DENIED', 'blocked')
            addLine('', 'info')
            addLine('📋 Found readable share on CLERK-PC', 'highlight')
        }, 1400)
    }

    const doLateral1 = () => {
        setPhase('lateral1')
        setCurrentStep(2)
        setCurrentRoom(1)
        setVisitedRooms((prev) => [...prev, 1])
        addLine('', 'info')
        addLine('═══ LATERAL MOVEMENT ═══', 'header')
        addLine('> psexec \\\\CLERK-PC -u guest -p ••••••', 'command')
        setTimeout(() => {
            addLine('⚡ Connected to CLERK-PC!', 'open')
            addLine('> dir C:\\Users\\clerk\\Desktop', 'command')
        }, 1000)
        setTimeout(() => {
            addLine('  budget_2024.xlsx', 'info')
            addLine('  notes.txt', 'info')
            addLine('  deploy_script.bat  ← 👀', 'highlight')
            addLine('', 'info')
            addLine('> type deploy_script.bat', 'command')
        }, 2200)
        setTimeout(() => {
            addLine('  REM Auto-deploy to DEV server', 'info')
            addLine('  net use \\\\DEV-PC /user:dev_admin P@ssw0rd!', 'stolen')
            addLine('', 'info')
            addLine('🔑 Password found in plaintext script!', 'highlight')
        }, 3500)
    }

    const doLateral2 = () => {
        setPhase('lateral2')
        setCurrentStep(3)
        setCurrentRoom(2)
        setPrivLevel('user')
        setVisitedRooms((prev) => [...prev, 2])
        addLine('', 'info')
        addLine('═══ SECOND HOP ═══', 'header')
        addLine('> psexec \\\\DEV-PC -u dev_admin -p P@ssw0rd!', 'command')
        setTimeout(() => {
            addLine('⚡ Connected to DEV-PC as dev_admin!', 'open')
            addLine('> whoami /priv', 'command')
            addLine('  SeDebugPrivilege          — Enabled', 'open')
            addLine('  SeImpersonatePrivilege    — Enabled', 'open')
        }, 1200)
        setTimeout(() => {
            addLine('', 'info')
            addLine('> mimikatz.exe "sekurlsa::logonpasswords"', 'command')
        }, 2500)
        setTimeout(() => {
            addLine('  Domain: CYBERBANK', 'info')
            addLine('  User  : DomainAdmin', 'stolen')
            addLine('  NTLM  : e3b0c44298fc1c14...', 'stolen')
            addLine('', 'info')
            addLine('🗝️  Domain Admin hash captured!', 'highlight')
        }, 4000)
    }

    const doEscalate = () => {
        setPhase('escalate')
        setCurrentStep(4)
        setCurrentRoom(3)
        setPrivLevel('admin')
        setVisitedRooms((prev) => [...prev, 3])
        addLine('', 'info')
        addLine('═══ PRIVILEGE ESCALATION ═══', 'header')
        addLine('> psexec \\\\SRV-DC01 -u DomainAdmin -hashes e3b0c44...', 'command')
        setTimeout(() => {
            addLine('⚡ Connected to Domain Controller!', 'open')
            addLine('> whoami', 'command')
            addLine('  CYBERBANK\\DomainAdmin', 'stolen')
            addLine('', 'info')
            addLine('💀 FULL DOMAIN COMPROMISE', 'highlight')
        }, 1500)
        setTimeout(() => {
            setPhase('pwned')
        }, 3500)
    }

    const showDefense = () => {
        setPhase('defense')
        setCurrentStep(5)
        setTerminalLines([
            { text: '🛡️  DEFENSE PLAYBOOK', type: 'highlight' },
            { text: '', type: 'info' },
            { text: '✅ Remove plaintext passwords from scripts', type: 'open' },
            { text: '✅ Least Privilege — no local admin for users', type: 'open' },
            { text: '✅ Network segmentation between zones', type: 'open' },
            { text: '✅ Enable MFA on all admin accounts', type: 'open' },
            { text: '✅ Monitor lateral movement with EDR/SIEM', type: 'open' },
            { text: '✅ Credential Guard — prevent hash dumping', type: 'open' },
        ])
    }

    const reset = () => {
        setPhase('intro')
        setCurrentStep(0)
        setCurrentRoom(0)
        setPrivLevel('guest')
        setTerminalLines([])
        setVisitedRooms([0])
    }

    const privColors = { guest: '#94a3b8', user: '#00b4d8', admin: '#ff4757' }
    const privLabels = { guest: '👤 Guest', user: '👨‍💻 User', admin: '👑 Admin' }

    const sidebar = <StepExplainer steps={steps} currentStep={currentStep} />

    return (
        <LessonLayout
            title="Privilege Escalation & Lateral Movement"
            subtitle="How attackers find the master key by sneaking through the building"
            sidebar={sidebar}
        >
            <div className="pe-scene">
                {/* Building Visualization */}
                <div className="pe-building">
                    <div className="pe-building-header">
                        <span className="pe-building-name">🏢 CyberBank HQ</span>
                        <motion.span
                            className="pe-priv-badge"
                            key={privLevel}
                            style={{ color: privColors[privLevel], borderColor: privColors[privLevel] }}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                        >
                            {privLabels[privLevel]}
                        </motion.span>
                    </div>

                    {/* Floor Plan */}
                    <div className="pe-floors">
                        {/* Floor 2 — Server */}
                        <div className="pe-floor">
                            <span className="pe-floor-label">Floor 3 — Restricted</span>
                            <div className="pe-rooms">
                                {rooms.filter(r => r.floor === 2).map((room) => {
                                    const isHere = rooms[currentRoom]?.id === room.id
                                    const visited = visitedRooms.includes(rooms.indexOf(room))
                                    return (
                                        <motion.div
                                            key={room.id}
                                            className={`pe-room ${isHere ? 'pe-room-active' : ''} ${visited ? 'pe-room-visited' : ''} pe-room-${room.priv}`}
                                            animate={isHere ? { boxShadow: ['0 0 10px rgba(255,71,87,0.3)', '0 0 25px rgba(255,71,87,0.6)', '0 0 10px rgba(255,71,87,0.3)'] } : {}}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <span className="pe-room-icon">{room.icon}</span>
                                            <span className="pe-room-label">{room.label}</span>
                                            {isHere && (
                                                <motion.span
                                                    className="pe-attacker"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1, y: [0, -3, 0] }}
                                                    transition={{ y: { duration: 1.5, repeat: Infinity } }}
                                                >
                                                    🕵️
                                                </motion.span>
                                            )}
                                            {!visited && room.priv === 'admin' && (
                                                <span className="pe-lock">🔒</span>
                                            )}
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Floor 1 — Dev */}
                        <div className="pe-floor">
                            <span className="pe-floor-label">Floor 2 — Development</span>
                            <div className="pe-rooms">
                                {rooms.filter(r => r.floor === 1).map((room) => {
                                    const isHere = rooms[currentRoom]?.id === room.id
                                    const visited = visitedRooms.includes(rooms.indexOf(room))
                                    return (
                                        <motion.div
                                            key={room.id}
                                            className={`pe-room ${isHere ? 'pe-room-active' : ''} ${visited ? 'pe-room-visited' : ''} pe-room-${room.priv}`}
                                            animate={isHere ? { boxShadow: ['0 0 10px rgba(0,180,216,0.3)', '0 0 25px rgba(0,180,216,0.6)', '0 0 10px rgba(0,180,216,0.3)'] } : {}}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <span className="pe-room-icon">{room.icon}</span>
                                            <span className="pe-room-label">{room.label}</span>
                                            {isHere && (
                                                <motion.span
                                                    className="pe-attacker"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1, y: [0, -3, 0] }}
                                                    transition={{ y: { duration: 1.5, repeat: Infinity } }}
                                                >
                                                    🕵️
                                                </motion.span>
                                            )}
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Floor 0 — Lobby & Office */}
                        <div className="pe-floor">
                            <span className="pe-floor-label">Floor 1 — Lobby & Office</span>
                            <div className="pe-rooms">
                                {rooms.filter(r => r.floor === 0).map((room) => {
                                    const isHere = rooms[currentRoom]?.id === room.id
                                    const visited = visitedRooms.includes(rooms.indexOf(room))
                                    return (
                                        <motion.div
                                            key={room.id}
                                            className={`pe-room ${isHere ? 'pe-room-active' : ''} ${visited ? 'pe-room-visited' : ''} pe-room-${room.priv}`}
                                            animate={isHere ? { boxShadow: ['0 0 10px rgba(0,255,136,0.3)', '0 0 25px rgba(0,255,136,0.6)', '0 0 10px rgba(0,255,136,0.3)'] } : {}}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <span className="pe-room-icon">{room.icon}</span>
                                            <span className="pe-room-label">{room.label}</span>
                                            {isHere && (
                                                <motion.span
                                                    className="pe-attacker"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1, y: [0, -3, 0] }}
                                                    transition={{ y: { duration: 1.5, repeat: Infinity } }}
                                                >
                                                    🕵️
                                                </motion.span>
                                            )}
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Path arrows showing movement */}
                    <div className="pe-path-visual">
                        {visitedRooms.length > 1 && visitedRooms.map((roomIdx, i) => {
                            if (i === 0) return null
                            return (
                                <motion.span
                                    key={`arrow-${i}`}
                                    className="pe-path-hop"
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    {rooms[visitedRooms[i - 1]]?.label} → {rooms[roomIdx]?.label}
                                </motion.span>
                            )
                        })}
                    </div>
                </div>

                {/* Terminal */}
                <div className="pe-terminal">
                    <div className="pe-terminal-header">
                        <span className="pe-terminal-dot pe-dot-red" />
                        <span className="pe-terminal-dot pe-dot-yellow" />
                        <span className="pe-terminal-dot pe-dot-green" />
                        <span className="pe-terminal-title">
                            Attacker Shell — {rooms[currentRoom]?.label || 'Lobby PC'}
                        </span>
                    </div>
                    <div className="pe-terminal-body">
                        {terminalLines.map((line, i) => (
                            <motion.div
                                key={`${i}-${line.text}`}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`pe-terminal-line pe-line-${line.type}`}
                            >
                                {line.text}
                            </motion.div>
                        ))}
                        {(phase === 'recon' || phase === 'lateral1' || phase === 'lateral2' || phase === 'escalate') && (
                            <span className="pe-cursor">▌</span>
                        )}
                    </div>
                </div>

                {/* Controls */}
                <div className="pe-controls">
                    <AnimatePresence mode="wait">
                        {phase === 'intro' && (
                            <motion.button
                                key="start"
                                className="pe-btn pe-btn-primary"
                                onClick={startRecon}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                🕵️ Enter the building as Guest
                            </motion.button>
                        )}

                        {phase === 'recon' && (
                            <motion.button
                                key="lateral1"
                                className="pe-btn pe-btn-lateral"
                                onClick={doLateral1}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                🚶 Move to Clerk's PC (Lateral Movement)
                            </motion.button>
                        )}

                        {phase === 'lateral1' && (
                            <motion.button
                                key="lateral2"
                                className="pe-btn pe-btn-lateral"
                                onClick={doLateral2}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                🔑 Use stolen password → Developer PC
                            </motion.button>
                        )}

                        {phase === 'lateral2' && (
                            <motion.button
                                key="escalate"
                                className="pe-btn pe-btn-danger"
                                onClick={doEscalate}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                👑 Escalate to Domain Admin → Server Room
                            </motion.button>
                        )}

                        {phase === 'pwned' && (
                            <motion.div
                                key="pwned"
                                className="pe-btn-group"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="pe-pwned-msg">
                                    💀 Full building compromised — Guest → Admin in 4 hops!
                                </div>
                                <motion.button
                                    className="pe-btn pe-btn-safe"
                                    onClick={showDefense}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    🛡️ How do we stop this?
                                </motion.button>
                                <motion.button
                                    className="pe-btn pe-btn-secondary"
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
                                className="pe-btn-group"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.button
                                    className="pe-btn pe-btn-secondary"
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
