import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LessonLayout from '../components/LessonLayout'
import StepExplainer from '../components/StepExplainer'
import './NmapLesson.css'

const doors = [
    { id: 1, port: 22, name: 'SSH', status: 'open' },
    { id: 2, port: 53, name: 'DNS', status: 'closed' },
    { id: 3, port: 80, name: 'HTTP', status: 'open' },
    { id: 4, port: 443, name: 'HTTPS', status: 'open' },
    { id: 5, port: 3306, name: 'MySQL', status: 'closed' },
    { id: 6, port: 8080, name: 'Proxy', status: 'closed' },
]

const steps = [
    {
        title: 'What is a port?',
        description: 'Think of a server as a house. Each port is a door — a numbered entrance for a specific service. Port 80 is for websites, port 22 is for remote access, etc.',
    },
    {
        title: 'Starting the scan',
        description: 'Nmap is like a person who walks up to the house and tries every door. They knock and wait to see if anyone answers.',
    },
    {
        title: 'Checking each door',
        description: 'The scanner tries each port one by one. An open door (green) means a service is running. A closed door (red) means nothing is listening.',
    },
    {
        title: 'Results are in!',
        description: 'The scan is complete. Open ports are potential entry points. Hackers use this info to find vulnerable services to attack.',
    },
    {
        title: 'Why it matters',
        description: 'Defenders use Nmap too! They scan their own servers to find accidentally open ports — like checking all your doors are locked at night.',
    },
]

export default function NmapLesson() {
    const [phase, setPhase] = useState('idle') // idle | scanning | done
    const [currentDoor, setCurrentDoor] = useState(-1)
    const [scannedDoors, setScannedDoors] = useState([])
    const [currentStep, setCurrentStep] = useState(0)
    const [terminalLines, setTerminalLines] = useState([
        { text: '$ nmap -sV 192.168.1.100', type: 'command' },
        { text: 'Starting Nmap 7.94 ( https://nmap.org )', type: 'info' },
    ])

    const startScan = useCallback(() => {
        setPhase('scanning')
        setCurrentStep(1)
        setCurrentDoor(-1)
        setScannedDoors([])
        setTerminalLines([
            { text: '$ nmap -sV 192.168.1.100', type: 'command' },
            { text: 'Starting Nmap 7.94 ( https://nmap.org )', type: 'info' },
            { text: 'Scanning 192.168.1.100 [6 ports]', type: 'info' },
            { text: '', type: 'info' },
            { text: 'PORT      STATE   SERVICE', type: 'header' },
        ])
    }, [])

    useEffect(() => {
        if (phase !== 'scanning') return

        if (currentDoor < doors.length - 1) {
            const timer = setTimeout(() => {
                const nextIdx = currentDoor + 1
                const door = doors[nextIdx]
                setCurrentDoor(nextIdx)
                setScannedDoors(prev => [...prev, door.id])
                setCurrentStep(2)

                setTerminalLines(prev => [
                    ...prev,
                    {
                        text: `${String(door.port).padEnd(5)}/tcp  ${door.status.padEnd(8)} ${door.name}`,
                        type: door.status === 'open' ? 'open' : 'closed',
                    },
                ])
            }, 1400)
            return () => clearTimeout(timer)
        } else {
            const timer = setTimeout(() => {
                setPhase('done')
                setCurrentStep(3)
                const openCount = doors.filter(d => d.status === 'open').length
                const closedCount = doors.filter(d => d.status === 'closed').length
                setTerminalLines(prev => [
                    ...prev,
                    { text: '', type: 'info' },
                    { text: `Nmap done: 1 IP address (1 host up)`, type: 'info' },
                    { text: `${openCount} open ports, ${closedCount} closed ports`, type: 'info' },
                ])
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [phase, currentDoor])

    const resetScan = () => {
        setPhase('idle')
        setCurrentDoor(-1)
        setScannedDoors([])
        setCurrentStep(4)
        setTerminalLines([
            { text: '$ nmap -sV 192.168.1.100', type: 'command' },
            { text: 'Starting Nmap 7.94 ( https://nmap.org )', type: 'info' },
        ])
    }

    // Calculate figure position based on current door index
    const getFigureLeft = () => {
        if (currentDoor < 0) return '5%'
        // Each door takes ~16.6% of the grid (100/6). Center on each cell.
        const cellWidth = 100 / doors.length
        return `${cellWidth * currentDoor + cellWidth / 2 - 2}%`
    }

    const sidebar = <StepExplainer steps={steps} currentStep={currentStep} />

    return (
        <LessonLayout
            title="Nmap — Port Scanning"
            subtitle="Discover how hackers find open doors into systems"
            sidebar={sidebar}
        >
            <div className="nmap-scene">
                {/* House Visualization */}
                <div className="nmap-house-container">
                    {/* Roof SVG */}
                    <div className="nmap-roof">
                        <svg viewBox="0 0 400 50" preserveAspectRatio="none">
                            <polygon
                                points="0,50 200,4 400,50"
                                fill="#1c2541"
                                stroke="#2a3a5c"
                                strokeWidth="2"
                            />
                            {/* Chimney */}
                            <rect x="300" y="12" width="24" height="38" fill="#1c2541" stroke="#2a3a5c" strokeWidth="2" />
                        </svg>
                    </div>

                    {/* House Body */}
                    <div className="nmap-house">
                        <div className="nmap-house-label">
                            🖥️ 192.168.1.100 (target-server)
                        </div>

                        {/* Windows */}
                        <div className="nmap-windows">
                            <div className="nmap-window nmap-window-lit" />
                            <div className="nmap-window" />
                            <div className="nmap-window nmap-window-lit" />
                            <div className="nmap-window" />
                        </div>

                        {/* Doors Row */}
                        <div className="nmap-doors-row">
                            {doors.map((door) => {
                                const isScanned = scannedDoors.includes(door.id)
                                const isActive = doors[currentDoor]?.id === door.id

                                let doorClass = 'nmap-door'
                                if (isActive && !isScanned) doorClass += ' nmap-door-scanning'
                                if (isScanned && door.status === 'open') doorClass += ' nmap-door-open'
                                if (isScanned && door.status === 'closed') doorClass += ' nmap-door-closed'

                                return (
                                    <div key={door.id} className="nmap-door-wrapper">
                                        <motion.div
                                            className={doorClass}
                                            animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                                            transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
                                        >
                                            <span className="nmap-knob" />
                                            {isScanned && (
                                                <motion.span
                                                    className="nmap-door-status"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: 'spring', stiffness: 300 }}
                                                >
                                                    {door.status === 'open' ? '✅' : '❌'}
                                                </motion.span>
                                            )}
                                        </motion.div>
                                        <div className="nmap-door-info">
                                            <span className="nmap-port-num">:{door.port}</span>
                                            <span className="nmap-port-svc">{door.name}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Ground */}
                    <div className="nmap-ground" />
                </div>

                {/* Scanner Figure */}
                <div className="nmap-figure-track">
                    <AnimatePresence>
                        {phase === 'scanning' && currentDoor >= 0 && (
                            <motion.div
                                className="nmap-figure"
                                style={{ left: getFigureLeft() }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                <span className="nmap-figure-emoji">🕵️</span>
                                <span className="nmap-figure-label">nmap</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Terminal Output */}
                <div className="nmap-terminal">
                    <div className="nmap-terminal-header">
                        <span className="nmap-terminal-dot nmap-dot-red" />
                        <span className="nmap-terminal-dot nmap-dot-yellow" />
                        <span className="nmap-terminal-dot nmap-dot-green" />
                        <span className="nmap-terminal-title">Terminal — nmap output</span>
                    </div>
                    <div className="nmap-terminal-body">
                        {terminalLines.map((line, i) => (
                            <motion.div
                                key={`${i}-${line.text}`}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`nmap-terminal-line ${line.type === 'header' ? 'nmap-terminal-line-header' :
                                        line.type === 'open' ? 'nmap-terminal-line-open' :
                                            line.type === 'closed' ? 'nmap-terminal-line-closed' : ''
                                    }`}
                            >
                                {line.text}
                            </motion.div>
                        ))}
                        {phase === 'scanning' && <span className="nmap-cursor">▌</span>}
                    </div>
                </div>

                {/* Controls */}
                <div className="nmap-controls">
                    {phase === 'idle' && (
                        <motion.button
                            className="nmap-btn nmap-btn-start"
                            onClick={startScan}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            🔍 Start Port Scan
                        </motion.button>
                    )}
                    {phase === 'scanning' && (
                        <div className="nmap-scanning-indicator">
                            <span className="nmap-pulse" />
                            Knocking on port {doors[currentDoor]?.port} ({doors[currentDoor]?.name})...
                        </div>
                    )}
                    {phase === 'done' && (
                        <div className="nmap-done-controls">
                            <div className="nmap-results-summary">
                                <span className="nmap-result-open">
                                    ✅ {doors.filter(d => d.status === 'open').length} open
                                </span>
                                <span className="nmap-result-closed">
                                    ❌ {doors.filter(d => d.status === 'closed').length} closed
                                </span>
                            </div>
                            <motion.button
                                className="nmap-btn nmap-btn-reset"
                                onClick={resetScan}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                ↻ Scan Again
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>
        </LessonLayout>
    )
}
