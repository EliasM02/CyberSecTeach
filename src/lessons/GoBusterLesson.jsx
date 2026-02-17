import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LessonLayout from '../components/LessonLayout'
import StepExplainer from '../components/StepExplainer'
import './GoBusterLesson.css'

const steps = [
    {
        title: 'What is directory brute-forcing?',
        description:
            'Websites have public pages everyone sees, but often have hidden pages too — like /admin, /backup, or /dev. GoBuster systematically checks a wordlist to see if these hidden paths exist.',
    },
    {
        title: 'The blueprint metaphor',
        description:
            'Imagine a building with a public lobby directory. GoBuster is like an inspector who ignores the directory and instead walks down every hallway and tries every unmarked door.',
    },
    {
        title: 'Scanning in progress',
        description:
            'GoBuster sends HTTP requests for each word in the list. A 200 OK means the page exists. A 404 means it doesn\'t. A 403 Forbidden means it exists but is locked!',
    },
    {
        title: 'Results — hidden paths found!',
        description:
            'The scan reveals pages the owners didn\'t expect anyone to find: admin panels, backup files, API endpoints. These are treasure maps for attackers.',
    },
    {
        title: 'How to defend against this',
        description:
            'Remove unnecessary files from production. Use authentication for all admin pages. Implement rate limiting. Monitor for unusual 404 spikes — it usually means someone is scanning you.',
    },
]

const paths = [
    { path: '/index.html', status: 200, type: 'public', desc: 'Homepage' },
    { path: '/about', status: 200, type: 'public', desc: 'About page' },
    { path: '/login', status: 200, type: 'public', desc: 'Login page' },
    { path: '/admin', status: 403, type: 'forbidden', desc: 'Admin panel!' },
    { path: '/api/users', status: 200, type: 'hidden', desc: 'User API' },
    { path: '/robots.txt', status: 200, type: 'public', desc: 'Robots file' },
    { path: '/.env', status: 200, type: 'critical', desc: 'Environment secrets!' },
    { path: '/backup.sql', status: 200, type: 'critical', desc: 'Database backup!' },
    { path: '/wp-admin', status: 404, type: 'miss', desc: '' },
    { path: '/phpmyadmin', status: 404, type: 'miss', desc: '' },
    { path: '/dashboard', status: 301, type: 'redirect', desc: 'Redirects to /login' },
    { path: '/dev', status: 200, type: 'hidden', desc: 'Dev environment!' },
]

export default function GoBusterLesson() {
    const [phase, setPhase] = useState('idle') // idle | scanning | done
    const [currentStep, setCurrentStep] = useState(0)
    const [scannedPaths, setScannedPaths] = useState([])
    const [currentIdx, setCurrentIdx] = useState(-1)
    const [terminalLines, setTerminalLines] = useState([
        { text: '$ gobuster dir -u https://cyberbank.com -w common.txt', type: 'command' },
        { text: '===============================================================', type: 'info' },
        { text: 'GoBuster v3.6 — Directory/File enumeration tool', type: 'info' },
        { text: '===============================================================', type: 'info' },
    ])

    const addLine = useCallback((text, type = 'info') => {
        setTerminalLines((prev) => [...prev, { text, type }])
    }, [])

    const startScan = useCallback(() => {
        setPhase('scanning')
        setCurrentStep(2)
        setCurrentIdx(-1)
        setScannedPaths([])
        setTerminalLines([
            { text: '$ gobuster dir -u https://cyberbank.com -w common.txt', type: 'command' },
            { text: '===============================================================', type: 'info' },
            { text: 'GoBuster v3.6', type: 'info' },
            { text: `Wordlist: common.txt (${paths.length} entries)`, type: 'info' },
            { text: '===============================================================', type: 'info' },
            { text: '', type: 'info' },
        ])
    }, [])

    useEffect(() => {
        if (phase !== 'scanning') return

        if (currentIdx < paths.length - 1) {
            const timer = setTimeout(() => {
                const nextIdx = currentIdx + 1
                const p = paths[nextIdx]
                setCurrentIdx(nextIdx)
                setScannedPaths((prev) => [...prev, nextIdx])

                const statusColor =
                    p.status === 200 ? (p.type === 'critical' ? 'critical' : p.type === 'hidden' ? 'found' : 'ok')
                        : p.status === 403 ? 'forbidden'
                            : p.status === 301 ? 'redirect'
                                : 'miss'

                const line = `${p.path.padEnd(20)} [Status: ${p.status}]${p.desc ? ` — ${p.desc}` : ''}`
                addLine(line, statusColor)
            }, 600)
            return () => clearTimeout(timer)
        } else {
            const timer = setTimeout(() => {
                setPhase('done')
                setCurrentStep(3)
                const found = paths.filter((p) => p.status !== 404).length
                const critical = paths.filter((p) => p.type === 'critical').length
                addLine('', 'info')
                addLine('===============================================================', 'info')
                addLine(`Scan complete: ${found} paths found, ${critical} CRITICAL`, 'found')
                addLine('===============================================================', 'info')
            }, 800)
            return () => clearTimeout(timer)
        }
    }, [phase, currentIdx, addLine])

    const reset = () => {
        setPhase('idle')
        setCurrentStep(4)
        setCurrentIdx(-1)
        setScannedPaths([])
        setTerminalLines([
            { text: '$ gobuster dir -u https://cyberbank.com -w common.txt', type: 'command' },
            { text: '===============================================================', type: 'info' },
            { text: 'GoBuster v3.6 — Directory/File enumeration tool', type: 'info' },
            { text: '===============================================================', type: 'info' },
        ])
    }

    const sidebar = <StepExplainer steps={steps} currentStep={currentStep} />

    return (
        <LessonLayout
            title="GoBuster — Directory Brute-forcing"
            subtitle="Finding hidden doors that aren't on the building directory"
            sidebar={sidebar}
        >
            <div className="gb-scene">
                {/* Building visualization */}
                <div className="gb-building">
                    <div className="gb-building-header">
                        <span className="gb-site-name">🌐 cyberbank.com</span>
                        <span className="gb-scan-status">
                            {phase === 'scanning'
                                ? `🔍 Scanning... ${scannedPaths.length}/${paths.length}`
                                : phase === 'done'
                                    ? `✅ Scan complete`
                                    : '⏸ Ready'}
                        </span>
                    </div>

                    <div className="gb-path-grid">
                        {paths.map((p, i) => {
                            const isScanned = scannedPaths.includes(i)
                            const isActive = i === currentIdx && phase === 'scanning'
                            const found = isScanned && p.status !== 404

                            return (
                                <motion.div
                                    key={p.path}
                                    className={`gb-path-card ${isActive ? 'gb-path-active' : ''} ${isScanned ? `gb-path-${p.type}` : 'gb-path-unknown'}`}
                                    initial={{ opacity: 0.3 }}
                                    animate={{
                                        opacity: isScanned ? 1 : 0.3,
                                        scale: isActive ? 1.05 : 1,
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="gb-path-icon">
                                        {!isScanned ? '❓' :
                                            p.type === 'critical' ? '🚨' :
                                                p.type === 'forbidden' ? '🔒' :
                                                    p.type === 'hidden' ? '👁️' :
                                                        p.type === 'redirect' ? '↪️' :
                                                            p.status === 404 ? '❌' : '✅'}
                                    </div>
                                    <div className="gb-path-name">{p.path}</div>
                                    {isScanned && (
                                        <motion.div
                                            className="gb-path-status"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                        >
                                            {p.status}
                                        </motion.div>
                                    )}
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                {/* Terminal */}
                <div className="gb-terminal">
                    <div className="gb-terminal-header">
                        <span className="gb-terminal-dot gb-dot-red" />
                        <span className="gb-terminal-dot gb-dot-yellow" />
                        <span className="gb-terminal-dot gb-dot-green" />
                        <span className="gb-terminal-title">Terminal — GoBuster output</span>
                    </div>
                    <div className="gb-terminal-body">
                        {terminalLines.map((line, i) => (
                            <motion.div
                                key={`${i}-${line.text}`}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`gb-terminal-line gb-line-${line.type}`}
                            >
                                {line.text}
                            </motion.div>
                        ))}
                        {phase === 'scanning' && <span className="gb-cursor">▌</span>}
                    </div>
                </div>

                {/* Controls */}
                <div className="gb-controls">
                    <AnimatePresence mode="wait">
                        {phase === 'idle' && (
                            <motion.button
                                key="start"
                                className="gb-btn gb-btn-start"
                                onClick={() => { startScan(); setCurrentStep(1); }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                🔍 Start GoBuster Scan
                            </motion.button>
                        )}
                        {phase === 'scanning' && (
                            <motion.div
                                key="scanning"
                                className="gb-scanning-indicator"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <span className="gb-pulse" />
                                Trying {paths[currentIdx]?.path || '...'}
                            </motion.div>
                        )}
                        {phase === 'done' && (
                            <motion.div
                                key="done"
                                className="gb-btn-group"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="gb-results-summary">
                                    <span className="gb-result-found">
                                        ✅ {paths.filter(p => p.status === 200).length} found
                                    </span>
                                    <span className="gb-result-critical">
                                        🚨 {paths.filter(p => p.type === 'critical').length} critical
                                    </span>
                                    <span className="gb-result-miss">
                                        ❌ {paths.filter(p => p.status === 404).length} 404
                                    </span>
                                </div>
                                <motion.button
                                    className="gb-btn gb-btn-reset"
                                    onClick={reset}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    ↻ Scan Again
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </LessonLayout>
    )
}
