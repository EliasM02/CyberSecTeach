import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useProgress } from '../context/ProgressContext'
import lessons from '../lessonData'
import './GlobalTerminal.css'

const HELP_TEXT = [
    { text: 'Available commands:', type: 'header' },
    { text: '  help              — Show this menu', type: 'info' },
    { text: '  ls / list         — List all lessons', type: 'info' },
    { text: '  connect <lesson>  — Open a lesson (e.g. connect nmap)', type: 'info' },
    { text: '  whoami            — Show your XP, level & badges', type: 'info' },
    { text: '  campaign          — Go to campaign page', type: 'info' },
    { text: '  clear             — Clear the terminal', type: 'info' },
    { text: '  exit              — Close the terminal', type: 'info' },
]

const WELCOME = [
    { text: '╔══════════════════════════════════════════╗', type: 'accent' },
    { text: '║     🖥️  CyberSecTeach Terminal v1.0      ║', type: 'accent' },
    { text: '║     Type "help" to see commands          ║', type: 'accent' },
    { text: '╚══════════════════════════════════════════╝', type: 'accent' },
    { text: '', type: 'info' },
]

export default function GlobalTerminal() {
    const [isOpen, setIsOpen] = useState(false)
    const [lines, setLines] = useState([...WELCOME])
    const [input, setInput] = useState('')
    const [history, setHistory] = useState([])
    const [historyIdx, setHistoryIdx] = useState(-1)
    const inputRef = useRef(null)
    const bodyRef = useRef(null)
    const navigate = useNavigate()
    const { xp, totalCompleted, badges } = useProgress()

    // Toggle with Ctrl+` or button
    useEffect(() => {
        const handler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === '`') {
                e.preventDefault()
                setIsOpen(prev => !prev)
            }
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false)
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [isOpen])

    // Auto-focus input when opened
    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 100)
    }, [isOpen])

    // Auto-scroll to bottom
    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight
        }
    }, [lines])

    const addLines = useCallback((newLines) => {
        setLines(prev => [...prev, ...newLines])
    }, [])

    const executeCommand = useCallback((cmd) => {
        const trimmed = cmd.trim().toLowerCase()
        const parts = trimmed.split(/\s+/)
        const command = parts[0]
        const arg = parts.slice(1).join(' ')

        // Echo the command
        addLines([{ text: `$ ${cmd}`, type: 'command' }])

        if (!command) return

        // Save to history
        setHistory(prev => [cmd, ...prev.slice(0, 20)])
        setHistoryIdx(-1)

        switch (command) {
            case 'help':
            case '?':
                addLines(HELP_TEXT)
                break

            case 'ls':
            case 'list':
                addLines([
                    { text: `Found ${lessons.length} lessons:`, type: 'header' },
                    ...lessons.map(l => ({
                        text: `  ${l.icon} ${l.title.padEnd(22)} → ${l.to}`,
                        type: 'info',
                    })),
                ])
                break

            case 'connect':
            case 'open':
            case 'go': {
                if (!arg) {
                    addLines([{ text: 'Usage: connect <lesson-name>', type: 'error' }])
                    break
                }
                const match = lessons.find(l =>
                    l.title.toLowerCase().includes(arg) ||
                    l.to.toLowerCase().includes(arg)
                )
                if (match) {
                    addLines([{ text: `Connecting to ${match.title}...`, type: 'success' }])
                    setTimeout(() => {
                        setIsOpen(false)
                        navigate(match.to)
                    }, 500)
                } else {
                    addLines([{ text: `Error: "${arg}" not found. Try "ls" to see available lessons.`, type: 'error' }])
                }
                break
            }

            case 'whoami': {
                const badgeList = badges.length > 0
                    ? badges.map(b => `  ${b.label}`).join('\n')
                    : '  No badges yet'
                addLines([
                    { text: '─── User Profile ───', type: 'header' },
                    { text: `  XP:        ${xp}`, type: 'info' },
                    { text: `  Completed: ${totalCompleted} lessons`, type: 'info' },
                    { text: `  Badges:`, type: 'info' },
                    ...badges.map(b => ({ text: `    ${b.label}`, type: 'success' })),
                    ...(badges.length === 0 ? [{ text: '    None yet — complete a lesson!', type: 'warning' }] : []),
                ])
                break
            }

            case 'campaign':
            case 'campaigns':
                addLines([{ text: 'Navigating to campaign map...', type: 'success' }])
                setTimeout(() => {
                    setIsOpen(false)
                    navigate('/campaign')
                }, 500)
                break

            case 'clear':
            case 'cls':
                setLines([])
                break

            case 'exit':
            case 'quit':
                addLines([{ text: 'Closing terminal...', type: 'info' }])
                setTimeout(() => setIsOpen(false), 300)
                break

            case 'sudo':
                addLines([{ text: '🚫 Nice try. You are not in the sudoers file. This incident will be reported.', type: 'error' }])
                break

            case 'rm':
                addLines([{ text: '🚫 Permission denied. This is a read-only terminal!', type: 'error' }])
                break

            case 'hack':
                addLines([
                    { text: '🎯 Initializing hack sequence...', type: 'accent' },
                    { text: '   Just kidding. Try "connect nmap" to start learning!', type: 'info' },
                ])
                break

            default:
                addLines([{ text: `Command not found: ${command}. Type "help" for available commands.`, type: 'error' }])
        }
    }, [addLines, navigate, xp, totalCompleted, badges])

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            executeCommand(input)
            setInput('')
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            if (history.length > 0) {
                const newIdx = Math.min(historyIdx + 1, history.length - 1)
                setHistoryIdx(newIdx)
                setInput(history[newIdx])
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault()
            if (historyIdx > 0) {
                const newIdx = historyIdx - 1
                setHistoryIdx(newIdx)
                setInput(history[newIdx])
            } else {
                setHistoryIdx(-1)
                setInput('')
            }
        }
    }

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                className="gt-toggle"
                onClick={() => setIsOpen(prev => !prev)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Toggle Terminal (Ctrl + `)"
            >
                {isOpen ? '✕' : '>_'}
            </motion.button>

            {/* Terminal Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="gt-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            className="gt-window"
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 40, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="gt-header">
                                <span className="gt-dot gt-dot-red" onClick={() => setIsOpen(false)} />
                                <span className="gt-dot gt-dot-yellow" />
                                <span className="gt-dot gt-dot-green" />
                                <span className="gt-title">cybersecteach@kali:~$</span>
                                <span className="gt-shortcut">Ctrl + `</span>
                            </div>

                            {/* Body */}
                            <div className="gt-body" ref={bodyRef} onClick={() => inputRef.current?.focus()}>
                                {lines.map((line, i) => (
                                    <div
                                        key={`${i}-${line.text?.slice(0, 20)}`}
                                        className={`gt-line gt-line-${line.type || 'info'}`}
                                    >
                                        {line.text}
                                    </div>
                                ))}

                                {/* Input Line */}
                                <div className="gt-input-line">
                                    <span className="gt-prompt">$</span>
                                    <input
                                        ref={inputRef}
                                        className="gt-input"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        spellCheck={false}
                                        autoComplete="off"
                                        placeholder="type a command..."
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
