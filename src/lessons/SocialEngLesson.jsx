import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LessonLayout from '../components/LessonLayout'
import StepExplainer from '../components/StepExplainer'
import './SocialEngLesson.css'

const steps = [
    {
        title: 'What is social engineering?',
        description: 'Instead of hacking a computer, the attacker hacks a person. They use tricks, lies, and psychology to get you to hand over information or access voluntarily.',
    },
    {
        title: 'The scenario',
        description: 'Someone calls pretending to be from IT support, a delivery company, or even your boss. They create a convincing story to get what they want.',
    },
    {
        title: 'The manipulation',
        description: 'They use pressure tactics: urgency ("right now!"), authority ("the CEO asked me"), fear ("your account is compromised"), or friendliness ("I\'m just trying to help").',
    },
    {
        title: 'The result',
        description: 'If you fall for it, they might get your password, access to a building, sensitive company data, or money. All without writing a single line of code.',
    },
    {
        title: 'How to protect yourself',
        description: 'Always verify identities through a separate channel. Take your time — urgency is a red flag. Never share passwords. If something feels off, it probably is.',
    },
]

const scenarios = [
    {
        id: 'phone',
        icon: '📞',
        title: 'IT Support Call',
        setup: 'Your phone rings at work...',
        visual: null,
        dialogue: [
            { who: 'attacker', text: '"Hi, this is James from IT Support. We detected a security breach on your account."', tactic: 'authority' },
            { who: 'attacker', text: '"I need to verify your identity. Can you confirm your username and password so I can reset the breach?"', tactic: 'urgency' },
            { who: 'you-bad', text: '😰 "Oh no! It\'s john.smith and my password is Welcome2024!"' },
            { who: 'result', text: '💀 The attacker now has your credentials. Real IT would never ask for your password.' },
        ],
        betterResponse: '✅ "I\'ll call back on the official IT helpdesk number to verify this is real."',
    },
    {
        id: 'email',
        icon: '👔',
        title: 'CEO Fraud',
        setup: 'You receive an urgent email from the "CEO"...',
        visual: null,
        dialogue: [
            { who: 'attacker', text: '"Hi, I\'m in an important meeting and can\'t talk. I need you to urgently wire $15,000 to this account for a confidential deal."', tactic: 'authority' },
            { who: 'attacker', text: '"This is time-sensitive. Don\'t mention it to anyone else yet. I\'m counting on you."', tactic: 'urgency' },
            { who: 'you-bad', text: '😰 "Right away, sir! Sending the transfer now."' },
            { who: 'result', text: '💀 $15,000 gone. The email was spoofed — the real CEO never sent it.' },
        ],
        betterResponse: '✅ "Let me verify this by calling the CEO directly on their known phone number."',
    },
    {
        id: 'physical',
        icon: '🚪',
        title: 'Tailgating',
        setup: 'Someone approaches the office entrance as you badge in...',
        visual: 'tailgate',
        dialogue: [
            { who: 'attacker', text: '"Hey! Could you hold the door? My badge is in my bag somewhere and I\'m carrying all this stuff for the meeting upstairs."', tactic: 'friendliness' },
            { who: 'attacker', text: '"I\'m the new person from marketing — I think we met at the team lunch last week?"', tactic: 'rapport' },
            { who: 'you-bad', text: '😊 "Of course, no problem! Welcome aboard!"' },
            { who: 'result', text: '💀 An unauthorized person now has physical access to the building.' },
        ],
        betterResponse: '✅ "No problem! Let me call reception so they can let you in properly."',
    },
]

/* Tailgate Door Visual */
function TailgateDoor({ stage }) {
    // stage: 0 = door closed, 1 = badge in, 2 = door open holding, 3 = attacker walks through, 4 = breach
    const doorAngle = stage >= 2 ? -55 : 0
    const showEmployee = stage >= 1
    const showAttacker = stage >= 2
    const attackerX = stage >= 3 ? 80 : -60
    const breach = stage >= 4

    return (
        <div className="tg-visual">
            {/* Building facade */}
            <svg viewBox="0 0 300 200" className="tg-svg">
                {/* Wall */}
                <rect x="60" y="20" width="180" height="180" rx="4" fill="var(--bg-secondary)" stroke="var(--border-color)" strokeWidth="2" />
                {/* Sign */}
                <rect x="110" y="30" width="80" height="20" rx="3" fill="var(--bg-card)" stroke="var(--border-color)" strokeWidth="1" />
                <text x="150" y="44" textAnchor="middle" fill="var(--text-muted)" fontSize="8" fontFamily="var(--font-mono)">ACME CORP</text>

                {/* Door frame */}
                <rect x="120" y="70" width="60" height="130" rx="2" fill="#1a1a2e" stroke="var(--border-color)" strokeWidth="2" />

                {/* Door (animated rotation) */}
                <g transform={`translate(120, 70)`}>
                    <motion.g
                        style={{ originX: '0px', originY: '65px' }}
                        animate={{ rotateY: doorAngle }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                    >
                        {/* Door panel */}
                        <rect x="0" y="0" width="58" height="130" rx="2"
                            fill={breach ? '#3d1111' : '#2d1b00'}
                            stroke={breach ? 'var(--accent-red)' : '#5c3d1a'}
                            strokeWidth="2"
                        />
                        {/* Door panels detail */}
                        <rect x="8" y="10" width="42" height="35" rx="2" fill="none"
                            stroke={breach ? 'rgba(255,71,87,0.3)' : '#4a2d0a'} strokeWidth="1" />
                        <rect x="8" y="55" width="42" height="35" rx="2" fill="none"
                            stroke={breach ? 'rgba(255,71,87,0.3)' : '#4a2d0a'} strokeWidth="1" />
                        {/* Handle */}
                        <circle cx="48" cy="70" r="4"
                            fill={breach ? 'var(--accent-red)' : '#c19a49'}
                            stroke={breach ? 'var(--accent-red)' : '#a07830'} strokeWidth="1" />
                    </motion.g>
                </g>

                {/* Card reader */}
                <rect x="106" y="120" width="10" height="16" rx="2"
                    fill={stage >= 1 ? 'var(--accent-green)' : 'var(--bg-card)'}
                    stroke="var(--border-color)" strokeWidth="1"
                />
                {stage >= 1 && (
                    <motion.circle
                        cx="111" cy="128" r="2"
                        fill="var(--accent-green)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.5, repeat: 2 }}
                    />
                )}

                {/* Employee (person holding door) */}
                {showEmployee && (
                    <motion.g
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Head */}
                        <circle cx="100" cy="130" r="8" fill="#ffb74d" />
                        {/* Body */}
                        <rect x="94" y="138" width="12" height="24" rx="4" fill="var(--accent-blue)" />
                        {/* Arm reaching for door */}
                        {stage >= 2 && (
                            <motion.line
                                x1="106" y1="145" x2="120" y2="140"
                                stroke="#ffb74d" strokeWidth="3" strokeLinecap="round"
                                initial={{ x2: 106 }}
                                animate={{ x2: 120 }}
                                transition={{ duration: 0.3 }}
                            />
                        )}
                        {/* Badge */}
                        <rect x="96" y="142" width="8" height="5" rx="1" fill="var(--accent-green)" />
                        {/* Label */}
                        <text x="100" y="174" textAnchor="middle" fill="var(--text-muted)" fontSize="7">Employee</text>
                    </motion.g>
                )}

                {/* Attacker */}
                {showAttacker && (
                    <motion.g
                        animate={{ x: attackerX }}
                        transition={{ duration: stage >= 3 ? 1.2 : 0.5, ease: 'easeInOut' }}
                    >
                        {/* Shadow/sneaky figure */}
                        <circle cx="210" cy="130" r="8" fill="#555" />
                        <rect x="204" y="138" width="12" height="24" rx="4" fill="#333" />
                        {/* Bags */}
                        <rect x="216" y="140" width="8" height="10" rx="2" fill="#444" stroke="#555" strokeWidth="1" />
                        {/* No badge! */}
                        <motion.g
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <circle cx="208" cy="146" r="5" fill="none" stroke="var(--accent-red)" strokeWidth="1.5" />
                            <line x1="205" y1="143" x2="211" y2="149" stroke="var(--accent-red)" strokeWidth="1.5" />
                        </motion.g>
                        {/* Label */}
                        <text x="215" y="174" textAnchor="middle" fill="var(--accent-red)" fontSize="7" fontWeight="bold">
                            Attacker
                        </text>
                    </motion.g>
                )}

                {/* Breach alert */}
                {breach && (
                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <rect x="90" y="55" width="120" height="24" rx="4" fill="var(--accent-red)" />
                        <text x="150" y="70" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">
                            ⚠️ UNAUTHORIZED ACCESS
                        </text>
                    </motion.g>
                )}
            </svg>
        </div>
    )
}

export default function SocialEngLesson() {
    const [activeScenario, setActiveScenario] = useState(null)
    const [visibleLines, setVisibleLines] = useState(0)
    const [showBetter, setShowBetter] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [tailgateStage, setTailgateStage] = useState(0)

    const selectScenario = (s) => {
        setActiveScenario(s)
        setVisibleLines(0)
        setShowBetter(false)
        setCurrentStep(1)
        setTailgateStage(0)

        if (s.visual === 'tailgate') {
            // Animate tailgating sequence
            setTimeout(() => setTailgateStage(1), 500)    // badge in
            setTimeout(() => setTailgateStage(2), 1500)    // door opens
        }

        // Reveal dialogue lines one by one
        s.dialogue.forEach((_, i) => {
            setTimeout(() => {
                setVisibleLines(i + 1)
                if (i === 0) setCurrentStep(2)

                // Progress tailgate visual with dialogue
                if (s.visual === 'tailgate') {
                    if (i === 2) setTailgateStage(3) // attacker walks through
                    if (i === 3) setTailgateStage(4) // breach
                }

                if (i === s.dialogue.length - 1) {
                    setCurrentStep(3)
                    setTimeout(() => setShowBetter(true), 1000)
                }
            }, (i + 1) * 2000 + (s.visual === 'tailgate' ? 1500 : 0))
        })
    }

    const reset = () => {
        setActiveScenario(null)
        setVisibleLines(0)
        setShowBetter(false)
        setCurrentStep(0)
        setTailgateStage(0)
    }

    const tacticLabels = {
        authority: '👑 Authority',
        urgency: '⏰ Urgency',
        friendliness: '🤝 Friendliness',
        rapport: '👋 Building rapport',
    }

    const sidebar = <StepExplainer steps={steps} currentStep={currentStep} />

    return (
        <LessonLayout
            title="Social Engineering"
            subtitle="The art of hacking humans instead of computers"
            sidebar={sidebar}
        >
            <div className="se-scene">
                {!activeScenario ? (
                    /* Scenario Selection */
                    <div className="se-scenarios">
                        <p className="se-prompt">Choose a scenario to see how social engineering works:</p>
                        <div className="se-scenario-grid">
                            {scenarios.map((s) => (
                                <motion.button
                                    key={s.id}
                                    className="se-scenario-card"
                                    onClick={() => selectScenario(s)}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <span className="se-scenario-icon">{s.icon}</span>
                                    <span className="se-scenario-title">{s.title}</span>
                                    <span className="se-scenario-setup">{s.setup}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Active Scenario */
                    <div className="se-active">
                        <div className="se-active-header">
                            <span className="se-active-icon">{activeScenario.icon}</span>
                            <span className="se-active-title">{activeScenario.title}</span>
                        </div>

                        {/* Tailgating door visual */}
                        {activeScenario.visual === 'tailgate' && (
                            <TailgateDoor stage={tailgateStage} />
                        )}

                        <div className="se-dialogue">
                            {activeScenario.dialogue.slice(0, visibleLines).map((line, i) => (
                                <motion.div
                                    key={i}
                                    className={`se-line se-line-${line.who}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="se-line-text">{line.text}</div>
                                    {line.tactic && (
                                        <span className="se-tactic">{tacticLabels[line.tactic]}</span>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Better Response */}
                        <AnimatePresence>
                            {showBetter && (
                                <motion.div
                                    className="se-better"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="se-better-header">🛡️ A better response:</div>
                                    <div className="se-better-text">{activeScenario.betterResponse}</div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Reset */}
                        {showBetter && (
                            <motion.div
                                className="se-controls"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <motion.button
                                    className="se-btn se-btn-reset"
                                    onClick={() => { reset(); setCurrentStep(4); }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    ↻ Try Another Scenario
                                </motion.button>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>
        </LessonLayout>
    )
}
