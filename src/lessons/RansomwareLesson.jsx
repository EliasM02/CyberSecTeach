import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LessonLayout from '../components/LessonLayout'
import StepExplainer from '../components/StepExplainer'
import './RansomwareLesson.css'

const steps = [
    {
        title: 'Your files are safe',
        description: 'You have important files on your computer — photos, documents, work projects. They\'re all accessible and working normally.',
    },
    {
        title: 'The malware arrives',
        description: 'You download what looks like a normal file — maybe an invoice PDF or a software update. Hidden inside is ransomware: a program that encrypts your files.',
    },
    {
        title: 'Files are locked!',
        description: 'The ransomware silently encrypts all your files one by one. Photos, documents, everything becomes unreadable scrambled data. A padlock on every file.',
    },
    {
        title: 'The ransom demand',
        description: 'A message appears demanding payment (usually Bitcoin) to unlock your files. They threaten to delete everything if you don\'t pay within a deadline.',
    },
    {
        title: 'How to protect yourself',
        description: 'Keep regular backups (3-2-1 rule). Don\'t open unknown email attachments. Keep software updated. Use antivirus. Never pay the ransom — it doesn\'t guarantee recovery.',
    },
]

const files = [
    { name: 'vacation_photos.zip', icon: '📸', size: '2.4 GB' },
    { name: 'resume_2024.docx', icon: '📄', size: '340 KB' },
    { name: 'project_final.pptx', icon: '📊', size: '18 MB' },
    { name: 'family_video.mp4', icon: '🎬', size: '4.1 GB' },
    { name: 'passwords.xlsx', icon: '📋', size: '52 KB' },
    { name: 'thesis_draft.pdf', icon: '📝', size: '8.7 MB' },
]

export default function RansomwareLesson() {
    const [phase, setPhase] = useState('safe') // safe | infecting | encrypting | ransom
    const [currentStep, setCurrentStep] = useState(0)
    const [encryptedFiles, setEncryptedFiles] = useState([])
    const [timer, setTimer] = useState(72)
    const timerRef = useRef(null)

    const startInfection = () => {
        setPhase('infecting')
        setCurrentStep(1)

        setTimeout(() => {
            setPhase('encrypting')
            setCurrentStep(2)
            // Encrypt files one by one
            files.forEach((_, i) => {
                setTimeout(() => {
                    setEncryptedFiles(prev => [...prev, i])
                    if (i === files.length - 1) {
                        setTimeout(() => {
                            setPhase('ransom')
                            setCurrentStep(3)
                            // Start countdown
                            timerRef.current = setInterval(() => {
                                setTimer(prev => {
                                    if (prev <= 0) {
                                        clearInterval(timerRef.current)
                                        return 0
                                    }
                                    return prev - 1
                                })
                            }, 1000)
                        }, 800)
                    }
                }, (i + 1) * 700)
            })
        }, 1500)
    }

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [])

    const reset = () => {
        if (timerRef.current) clearInterval(timerRef.current)
        setPhase('safe')
        setCurrentStep(0)
        setEncryptedFiles([])
        setTimer(72)
    }

    const sidebar = <StepExplainer steps={steps} currentStep={currentStep} />

    return (
        <LessonLayout
            title="Ransomware"
            subtitle="When your files become hostages"
            sidebar={sidebar}
        >
            <div className="rw-scene">
                {/* File Grid */}
                <div className="rw-files">
                    <div className="rw-files-header">
                        <span>💻 My Computer</span>
                        <span className="rw-file-count">
                            {encryptedFiles.length > 0
                                ? `🔒 ${encryptedFiles.length}/${files.length} encrypted`
                                : `${files.length} files`
                            }
                        </span>
                    </div>
                    <div className="rw-file-grid">
                        {files.map((file, i) => {
                            const isEncrypted = encryptedFiles.includes(i)
                            return (
                                <motion.div
                                    key={i}
                                    className={`rw-file ${isEncrypted ? 'rw-file-locked' : ''}`}
                                    animate={isEncrypted ? { scale: [1, 0.95, 1] } : {}}
                                >
                                    <div className="rw-file-icon">
                                        {isEncrypted ? '🔒' : file.icon}
                                    </div>
                                    <div className="rw-file-name">
                                        {isEncrypted ? file.name + '.encrypted' : file.name}
                                    </div>
                                    <div className="rw-file-size">{file.size}</div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                {/* Infection indicator */}
                <AnimatePresence>
                    {phase === 'infecting' && (
                        <motion.div
                            className="rw-infecting"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <span className="rw-infecting-icon">📧</span>
                            <span>Opening "invoice_march_2024.pdf.exe"...</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Ransom Note */}
                <AnimatePresence>
                    {phase === 'ransom' && (
                        <motion.div
                            className="rw-ransom"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                        >
                            <div className="rw-ransom-header">
                                ⚠️ YOUR FILES HAVE BEEN ENCRYPTED ⚠️
                            </div>
                            <div className="rw-ransom-body">
                                <p>All your important files have been encrypted with military-grade AES-256 encryption.</p>
                                <p>To recover your files, you must pay:</p>
                                <div className="rw-ransom-amount">
                                    <span className="rw-btc-icon">₿</span>
                                    <span className="rw-btc-amount">0.5 BTC</span>
                                    <span className="rw-btc-usd">(≈ $21,000)</span>
                                </div>
                                <div className="rw-ransom-timer">
                                    <span>⏰ Time remaining:</span>
                                    <span className="rw-timer-value">
                                        {Math.floor(timer / 3600)}:{String(Math.floor((timer % 3600) / 60)).padStart(2, '0')}:{String(timer % 60).padStart(2, '0')}
                                    </span>
                                </div>
                                <p className="rw-ransom-warning">If you don't pay before the timer expires, your files will be permanently deleted.</p>
                            </div>
                            <div className="rw-ransom-tip">
                                💡 <strong>Remember:</strong> Never pay the ransom. There's no guarantee you'll get your files back. This is why backups are essential!
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Controls */}
                <div className="rw-controls">
                    {phase === 'safe' && (
                        <motion.button
                            className="rw-btn rw-btn-infect"
                            onClick={startInfection}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            📧 Open Suspicious Attachment
                        </motion.button>
                    )}
                    {phase === 'encrypting' && (
                        <div className="rw-encrypting">
                            <span className="rw-pulse" /> Encrypting files...
                        </div>
                    )}
                    {phase === 'ransom' && (
                        <motion.button
                            className="rw-btn rw-btn-reset"
                            onClick={() => { reset(); setCurrentStep(4); }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            ↻ Start Over
                        </motion.button>
                    )}
                </div>
            </div>
        </LessonLayout>
    )
}
