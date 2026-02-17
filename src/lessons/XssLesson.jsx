import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LessonLayout from '../components/LessonLayout'
import StepExplainer from '../components/StepExplainer'
import './XssLesson.css'

/* — Pre-existing guestbook comments — */
const existingComments = [
    { user: 'Alice', text: 'Love this website! Great UI.', time: '09:12' },
    { user: 'Bob', text: 'Very helpful, thanks!', time: '10:34' },
    { user: 'Charlie', text: 'When is the next update?', time: '11:01' },
]

/* — XSS payloads the user can try — */
const payloads = [
    {
        id: 'alert',
        label: '<script>alert("XSS")</script>',
        description: 'Classic alert box — proves JavaScript runs in the victim\'s browser.',
        effect: 'alert',
        severity: 'low',
    },
    {
        id: 'cookie',
        label: '<script>document.cookie</script>',
        description: 'Steals the user\'s session cookie and sends it to the attacker.',
        effect: 'cookie-steal',
        severity: 'critical',
    },
    {
        id: 'redirect',
        label: '<script>window.location="evil.com"</script>',
        description: 'Redirects any visitor to a fake login page to steal credentials.',
        effect: 'redirect',
        severity: 'high',
    },
    {
        id: 'deface',
        label: '<img src=x onerror="document.body.innerHTML=\'HACKED\'">',
        description: 'Replaces the entire page content — website defacement.',
        effect: 'deface',
        severity: 'high',
    },
    {
        id: 'keylog',
        label: '<script>document.onkeypress=...</script>',
        description: 'Logs every keystroke and sends it to the attacker — a keylogger in the browser.',
        effect: 'keylog',
        severity: 'critical',
    },
]

const steps = [
    {
        title: 'What is XSS?',
        description: 'Cross-Site Scripting (XSS) lets an attacker inject JavaScript into a website. When other users visit the page, the malicious script runs in THEIR browser — as if the website itself sent it.',
    },
    {
        title: 'The guestbook analogy',
        description: 'Imagine a real-world guestbook at a hotel. If you write: "Turn off the lights at 9 PM" and the staff blindly follows every instruction in the book — that\'s XSS. The website trusts user input without checking it.',
    },
    {
        title: 'Try the attack!',
        description: 'This is a vulnerable guestbook. Pick a payload from the right and submit it. Watch what happens to the page — and imagine this happening to every visitor.',
    },
    {
        title: 'Why is XSS dangerous?',
        description: 'XSS can steal session cookies (hijack accounts), redirect users to phishing pages, deface websites, or even install keyloggers. It\'s one of the OWASP Top 10 vulnerabilities.',
    },
    {
        title: 'How to prevent XSS',
        description: 'The fix is output encoding: convert < to &lt;, > to &gt; before rendering. Modern frameworks like React do this by default — which is why we simulate instead of actually injecting. Also use Content Security Policy (CSP) headers.',
    },
]

export default function XssLesson() {
    const [phase, setPhase] = useState('intro')        // intro | attacking | done
    const [comments, setComments] = useState([...existingComments])
    const [selectedPayload, setSelectedPayload] = useState(null)
    const [injected, setInjected] = useState([])        // Array of injected payload IDs
    const [activeEffect, setActiveEffect] = useState(null)
    const [currentStep, setCurrentStep] = useState(0)
    const [customInput, setCustomInput] = useState('')

    const startAttack = useCallback(() => {
        setPhase('attacking')
        setCurrentStep(2)
    }, [])

    const injectPayload = (payload) => {
        if (injected.includes(payload.id)) return

        // Add the "comment" to the guestbook
        setComments(prev => [...prev, {
            user: 'Hacker',
            text: payload.label,
            time: new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }),
            isXss: true,
            effect: payload.effect,
            severity: payload.severity,
        }])

        setInjected(prev => [...prev, payload.id])
        setActiveEffect(payload)
        setSelectedPayload(null)

        // Check if all payloads used
        if (injected.length + 1 >= payloads.length) {
            setTimeout(() => {
                setPhase('done')
                setCurrentStep(4)
                setActiveEffect(null)
            }, 2000)
        } else {
            setTimeout(() => setActiveEffect(null), 2500)
        }
    }

    const submitCustom = () => {
        if (!customInput.trim()) return
        const hasScript = /<script|onerror|onload|javascript:/i.test(customInput)
        setComments(prev => [...prev, {
            user: 'Hacker',
            text: customInput,
            time: new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }),
            isXss: hasScript,
            effect: hasScript ? 'custom' : null,
            severity: hasScript ? 'medium' : null,
        }])
        if (hasScript) {
            setActiveEffect({ effect: 'custom', description: 'Custom XSS payload detected! The server blindly rendered your input.' })
            setTimeout(() => setActiveEffect(null), 2500)
        }
        setCustomInput('')
    }

    const reset = () => {
        setPhase('intro')
        setCurrentStep(0)
        setComments([...existingComments])
        setInjected([])
        setActiveEffect(null)
        setSelectedPayload(null)
        setCustomInput('')
    }

    const sidebar = <StepExplainer steps={steps} currentStep={currentStep} />

    return (
        <LessonLayout
            title="Cross-Site Scripting"
            subtitle="When the guestbook fights back"
            sidebar={sidebar}
        >
            <div className={`xss-scene ${activeEffect ? 'xss-scene-glitch' : ''}`}>
                {/* Fake Browser Chrome */}
                <div className="xss-browser">
                    <div className="xss-browser-bar">
                        <div className="xss-browser-dots">
                            <span className="xss-dot xss-dot-red" />
                            <span className="xss-dot xss-dot-yellow" />
                            <span className="xss-dot xss-dot-green" />
                        </div>
                        <div className="xss-url-bar">
                            <span className="xss-lock">🔓</span>
                            <span className="xss-url">http://megacorp.com/guestbook</span>
                        </div>
                    </div>

                    {/* Page Content — the "website" */}
                    <div className={`xss-page ${activeEffect?.effect === 'deface' ? 'xss-page-defaced' : ''}`}>
                        {activeEffect?.effect === 'deface' ? (
                            <motion.div
                                className="xss-defaced"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <span className="xss-defaced-skull">💀</span>
                                <h2>HACKED BY XSS</h2>
                                <p>document.body.innerHTML replaced</p>
                            </motion.div>
                        ) : (
                            <>
                                <h3 className="xss-page-title">📝 MegaCorp Guestbook</h3>
                                <div className="xss-comments">
                                    {comments.map((c, i) => (
                                        <motion.div
                                            key={`${i}-${c.user}`}
                                            className={`xss-comment ${c.isXss ? `xss-comment-malicious xss-severity-${c.severity}` : ''}`}
                                            initial={i >= existingComments.length ? { opacity: 0, x: -10 } : false}
                                            animate={{ opacity: 1, x: 0 }}
                                        >
                                            <div className="xss-comment-header">
                                                <span className="xss-comment-user">{c.user === 'Hacker' ? '😈 Hacker' : c.user}</span>
                                                <span className="xss-comment-time">{c.time}</span>
                                            </div>
                                            <div className={`xss-comment-text ${c.isXss ? 'xss-comment-code' : ''}`}>
                                                {c.text}
                                            </div>
                                            {c.isXss && (
                                                <span className={`xss-severity-badge xss-badge-${c.severity}`}>
                                                    {c.severity === 'critical' ? '🔴 CRITICAL' : c.severity === 'high' ? '🟠 HIGH' : c.severity === 'medium' ? '🟡 MEDIUM' : '🟢 LOW'}
                                                </span>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Alert popup effect */}
                <AnimatePresence>
                    {activeEffect?.effect === 'alert' && (
                        <motion.div
                            className="xss-alert-popup"
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                        >
                            <div className="xss-alert-header">⚠️ JavaScript Alert</div>
                            <div className="xss-alert-body">XSS</div>
                            <button className="xss-alert-ok" onClick={() => setActiveEffect(null)}>OK</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Cookie steal effect */}
                <AnimatePresence>
                    {activeEffect?.effect === 'cookie-steal' && (
                        <motion.div
                            className="xss-cookie-popup"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="xss-cookie-header">🍪 Stolen Cookie</div>
                            <code className="xss-cookie-value">session_id=a8f3b2c1d4e5; user=admin; role=superuser</code>
                            <div className="xss-cookie-dest">→ Sending to attacker-server.evil/collect</div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Redirect effect */}
                <AnimatePresence>
                    {activeEffect?.effect === 'redirect' && (
                        <motion.div
                            className="xss-redirect-popup"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="xss-redirect-text">🔄 Redirecting to <span className="xss-red">evil.com/fake-login</span>...</div>
                            <div className="xss-redirect-sub">Every visitor sees this. Their credentials go to the attacker.</div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Keylogger effect */}
                <AnimatePresence>
                    {activeEffect?.effect === 'keylog' && (
                        <motion.div
                            className="xss-keylog-popup"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="xss-keylog-header">⌨️ Keylogger Active</div>
                            <div className="xss-keylog-keys">
                                {['p', 'a', 's', 's', 'w', 'o', 'r', 'd'].map((k, i) => (
                                    <motion.span
                                        key={i}
                                        className="xss-keylog-key"
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.15 }}
                                    >{k}</motion.span>
                                ))}
                            </div>
                            <div className="xss-keylog-dest">→ Logging to attacker-server.evil/keys</div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Custom effect */}
                <AnimatePresence>
                    {activeEffect?.effect === 'custom' && (
                        <motion.div
                            className="xss-custom-popup"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="xss-custom-header">⚡ XSS Executed!</div>
                            <div className="xss-custom-body">{activeEffect.description}</div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Payload Selector */}
                {phase === 'attacking' && (
                    <div className="xss-payloads">
                        <div className="xss-payloads-header">
                            <span className="xss-payloads-icon">💉</span>
                            <span className="xss-payloads-title">XSS Payload Arsenal</span>
                        </div>
                        <div className="xss-payload-list">
                            {payloads.map(p => {
                                const used = injected.includes(p.id)
                                return (
                                    <motion.button
                                        key={p.id}
                                        className={`xss-payload ${selectedPayload?.id === p.id ? 'xss-payload-selected' : ''} ${used ? 'xss-payload-used' : ''}`}
                                        onClick={() => !used && setSelectedPayload(p.id === selectedPayload?.id ? null : p)}
                                        disabled={used}
                                        whileHover={!used ? { scale: 1.02 } : {}}
                                    >
                                        <code className="xss-payload-code">{p.label}</code>
                                        <span className="xss-payload-desc">{p.description}</span>
                                        {used && <span className="xss-payload-done">✅ Injected</span>}
                                    </motion.button>
                                )
                            })}
                        </div>

                        {selectedPayload && (
                            <motion.button
                                className="xss-inject-btn"
                                onClick={() => injectPayload(selectedPayload)}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                💉 Inject into Guestbook
                            </motion.button>
                        )}

                        {/* Custom input */}
                        <div className="xss-custom-input">
                            <input
                                value={customInput}
                                onChange={(e) => setCustomInput(e.target.value)}
                                placeholder='Try your own: <script>alert("hi")</script>'
                                className="xss-input"
                                onKeyDown={(e) => e.key === 'Enter' && submitCustom()}
                            />
                            <button className="xss-submit-custom" onClick={submitCustom}>Post</button>
                        </div>
                    </div>
                )}

                {/* Defense section */}
                {phase === 'done' && (
                    <motion.div
                        className="xss-defense"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h3 className="xss-defense-title">🛡️ How to Prevent XSS</h3>
                        <div className="xss-defense-grid">
                            <div className="xss-defense-card">
                                <div className="xss-defense-label">1. Output Encoding</div>
                                <code className="xss-defense-code">{'< → &lt;   > → &gt;   " → &quot;'}</code>
                                <p>Convert special characters before rendering. User input should be treated as text, never HTML.</p>
                            </div>
                            <div className="xss-defense-card">
                                <div className="xss-defense-label">2. Content Security Policy</div>
                                <code className="xss-defense-code">Content-Security-Policy: script-src 'self'</code>
                                <p>The browser will only execute scripts from your domain — inline scripts are blocked.</p>
                            </div>
                            <div className="xss-defense-card">
                                <div className="xss-defense-label">3. Use Modern Frameworks</div>
                                <code className="xss-defense-code">{'React: {userInput} auto-escapes'}</code>
                                <p>React, Vue, and Angular escape by default. Never use <code>dangerouslySetInnerHTML</code>.</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Controls */}
                <div className="xss-controls">
                    {phase === 'intro' && (
                        <motion.button
                            className="xss-btn xss-btn-start"
                            onClick={startAttack}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            💉 Start Injecting
                        </motion.button>
                    )}
                    {phase === 'done' && (
                        <motion.button
                            className="xss-btn xss-btn-reset"
                            onClick={reset}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            ↻ Try Again
                        </motion.button>
                    )}
                </div>
            </div>
        </LessonLayout>
    )
}
