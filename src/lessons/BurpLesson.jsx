import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LessonLayout from '../components/LessonLayout'
import StepExplainer from '../components/StepExplainer'
import './BurpLesson.css'

const steps = [
    {
        title: 'What is a web proxy?',
        description:
            'A proxy sits between your browser and the server. Normally, requests fly straight through. Burp Suite acts like a courier who opens and reads every letter before passing it along.',
    },
    {
        title: 'Intercepting a request',
        description:
            'When you click "Buy" on a webpage, your browser sends a request like "POST /purchase — item=shirt&price=99". Burp catches this mid-flight so you can inspect it.',
    },
    {
        title: 'Modifying the request',
        description:
            'Here\'s the dangerous part: the attacker changes price=99 to price=1 and forwards the modified request to the server. If the server trusts client data, the shirt costs $1!',
    },
    {
        title: 'The server responds',
        description:
            'The server processes the tampered request blindly. It sees price=1 and says "OK! Here\'s your shirt for $1." This is why you never trust client-side validation alone.',
    },
    {
        title: 'How to defend',
        description:
            'Always validate on the server side. Never trust data from the client — prices, roles, user IDs. Use signed tokens. Implement integrity checks. Log and monitor for impossible values.',
    },
]

export default function BurpLesson() {
    // intro | intercept | editing | forwarded | responded | defense
    const [phase, setPhase] = useState('intro')
    const [currentStep, setCurrentStep] = useState(0)
    const [originalReq, setOriginalReq] = useState(null)
    const [modifiedReq, setModifiedReq] = useState(null)
    const [priceValue, setPriceValue] = useState('99')
    const [serverResponse, setServerResponse] = useState(null)

    const startIntercept = () => {
        setPhase('intercept')
        setCurrentStep(1)
        setOriginalReq({
            method: 'POST',
            url: '/api/purchase',
            headers: [
                'Host: shop.cyberbank.com',
                'Content-Type: application/json',
                'Cookie: session=a7f3b9...',
            ],
            body: {
                item: 'Premium T-Shirt',
                quantity: 1,
                price: 99,
                currency: 'USD',
            },
        })
        setPriceValue('99')
        setModifiedReq(null)
        setServerResponse(null)
    }

    const editAndForward = () => {
        setPhase('editing')
        setCurrentStep(2)
    }

    const forwardRequest = () => {
        const numPrice = parseFloat(priceValue) || 0
        setModifiedReq({
            ...originalReq,
            body: { ...originalReq.body, price: numPrice },
            tampered: numPrice !== 99,
        })
        setPhase('forwarded')
        setCurrentStep(3)

        setTimeout(() => {
            setServerResponse({
                status: 200,
                message: 'Purchase successful!',
                total: `$${numPrice.toFixed(2)}`,
                tampered: numPrice !== 99,
            })
            setPhase('responded')
        }, 2000)
    }

    const showDefense = () => {
        setPhase('defense')
        setCurrentStep(4)
    }

    const reset = () => {
        setPhase('intro')
        setCurrentStep(0)
        setOriginalReq(null)
        setModifiedReq(null)
        setServerResponse(null)
        setPriceValue('99')
    }

    const sidebar = <StepExplainer steps={steps} currentStep={currentStep} />

    return (
        <LessonLayout
            title="Burp Suite — HTTP Proxy"
            subtitle="The courier who opens your letters"
            sidebar={sidebar}
        >
            <div className="bp-scene">
                {/* Three-column flow: Browser → Burp → Server */}
                <div className="bp-flow">
                    {/* Browser */}
                    <div className="bp-node bp-browser">
                        <div className="bp-node-icon">🌐</div>
                        <div className="bp-node-label">Browser</div>
                        <div className="bp-node-sub">shop.cyberbank.com</div>
                    </div>

                    {/* Arrow 1 */}
                    <div className="bp-arrow">
                        <motion.div
                            className={`bp-arrow-line ${phase === 'intercept' || phase === 'editing' ? 'bp-arrow-intercepted' : ''}`}
                            animate={
                                phase === 'intercept' || phase === 'editing'
                                    ? { background: ['rgba(255,71,87,0.4)', 'rgba(255,71,87,0.8)', 'rgba(255,71,87,0.4)'] }
                                    : {}
                            }
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <span className="bp-arrow-label">
                            {phase === 'intercept' || phase === 'editing' ? '⏸ Intercepted!' : '→'}
                        </span>
                    </div>

                    {/* Burp Proxy */}
                    <motion.div
                        className={`bp-node bp-proxy ${phase === 'intercept' || phase === 'editing' ? 'bp-proxy-active' : ''}`}
                        animate={
                            phase === 'intercept' || phase === 'editing'
                                ? { boxShadow: ['0 0 10px rgba(255,71,87,0.3)', '0 0 25px rgba(255,71,87,0.6)', '0 0 10px rgba(255,71,87,0.3)'] }
                                : {}
                        }
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <div className="bp-node-icon">🔧</div>
                        <div className="bp-node-label">Burp Suite</div>
                        <div className="bp-node-sub">Proxy Intercept</div>
                    </motion.div>

                    {/* Arrow 2 */}
                    <div className="bp-arrow">
                        <div className={`bp-arrow-line ${phase === 'forwarded' ? 'bp-arrow-forwarded' : ''}`} />
                        <span className="bp-arrow-label">
                            {phase === 'forwarded' || phase === 'responded' ? '→ Forwarded' : '→'}
                        </span>
                    </div>

                    {/* Server */}
                    <motion.div
                        className="bp-node bp-server"
                        animate={
                            phase === 'responded' && serverResponse?.tampered
                                ? { borderColor: ['rgba(255,71,87,0.3)', 'rgba(255,71,87,0.8)', 'rgba(255,71,87,0.3)'] }
                                : {}
                        }
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <div className="bp-node-icon">🖥️</div>
                        <div className="bp-node-label">Server</div>
                        <div className="bp-node-sub">API Backend</div>
                    </motion.div>
                </div>

                {/* Request Inspector */}
                <AnimatePresence mode="wait">
                    {(phase === 'intercept' || phase === 'editing') && originalReq && (
                        <motion.div
                            key="inspector"
                            className="bp-inspector"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="bp-inspector-header">
                                <span className="bp-inspector-dot bp-dot-red" />
                                <span className="bp-inspector-dot bp-dot-yellow" />
                                <span className="bp-inspector-dot bp-dot-green" />
                                <span className="bp-inspector-title">
                                    {phase === 'editing' ? '✏️ Editing Request...' : '📩 Intercepted Request'}
                                </span>
                            </div>
                            <div className="bp-inspector-body">
                                <div className="bp-req-line bp-req-method">
                                    {originalReq.method} {originalReq.url} HTTP/1.1
                                </div>
                                {originalReq.headers.map((h, i) => (
                                    <div key={i} className="bp-req-line bp-req-header">{h}</div>
                                ))}
                                <div className="bp-req-line bp-req-empty" />
                                <div className="bp-req-body">
                                    {'{'}<br />
                                    &nbsp;&nbsp;"item": "{originalReq.body.item}",<br />
                                    &nbsp;&nbsp;"quantity": {originalReq.body.quantity},<br />
                                    &nbsp;&nbsp;"price": {phase === 'editing' ? (
                                        <input
                                            className="bp-price-input"
                                            type="text"
                                            value={priceValue}
                                            onChange={(e) => setPriceValue(e.target.value)}
                                            autoFocus
                                        />
                                    ) : (
                                        <span className="bp-price-value">{originalReq.body.price}</span>
                                    )},<br />
                                    &nbsp;&nbsp;"currency": "{originalReq.body.currency}"<br />
                                    {'}'}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {phase === 'forwarded' && (
                        <motion.div
                            key="forwarding"
                            className="bp-forwarding"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <span className="bp-forwarding-pulse" />
                            Forwarding {modifiedReq?.tampered ? 'TAMPERED' : ''} request to server...
                        </motion.div>
                    )}

                    {phase === 'responded' && serverResponse && (
                        <motion.div
                            key="response"
                            className={`bp-response ${serverResponse.tampered ? 'bp-response-tampered' : ''}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="bp-response-header">
                                {serverResponse.tampered ? '⚠️' : '✅'} Server Response
                            </div>
                            <div className="bp-response-body">
                                <div className="bp-response-status">HTTP/1.1 {serverResponse.status} OK</div>
                                <div className="bp-response-msg">{serverResponse.message}</div>
                                <div className={`bp-response-total ${serverResponse.tampered ? 'bp-total-tampered' : ''}`}>
                                    Total charged: {serverResponse.total}
                                    {serverResponse.tampered && (
                                        <span className="bp-total-original"> (was $99.00!)</span>
                                    )}
                                </div>
                            </div>
                            {serverResponse.tampered && (
                                <div className="bp-response-warning">
                                    💡 The server trusted the client-submitted price without validation!
                                </div>
                            )}
                        </motion.div>
                    )}

                    {phase === 'defense' && (
                        <motion.div
                            key="defense"
                            className="bp-defense"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="bp-defense-header">🛡️ Defense Playbook</div>
                            <div className="bp-defense-list">
                                <div className="bp-defense-item">✅ Server-side validation — NEVER trust client prices</div>
                                <div className="bp-defense-item">✅ Reference prices from database, not from request</div>
                                <div className="bp-defense-item">✅ Use signed/encrypted tokens for sensitive values</div>
                                <div className="bp-defense-item">✅ Implement integrity checks (HMAC on payloads)</div>
                                <div className="bp-defense-item">✅ Log and alert on impossible values (price &lt; cost)</div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Controls */}
                <div className="bp-controls">
                    <AnimatePresence mode="wait">
                        {phase === 'intro' && (
                            <motion.button
                                key="start"
                                className="bp-btn bp-btn-primary"
                                onClick={startIntercept}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                🛒 Click "Buy" ($99 T-Shirt)
                            </motion.button>
                        )}

                        {phase === 'intercept' && (
                            <motion.button
                                key="edit"
                                className="bp-btn bp-btn-danger"
                                onClick={editAndForward}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                ✏️ Tamper with Request
                            </motion.button>
                        )}

                        {phase === 'editing' && (
                            <motion.button
                                key="forward"
                                className="bp-btn bp-btn-danger"
                                onClick={forwardRequest}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                ▶ Forward Modified Request
                            </motion.button>
                        )}

                        {phase === 'responded' && (
                            <motion.div
                                key="post-response"
                                className="bp-btn-group"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.button
                                    className="bp-btn bp-btn-safe"
                                    onClick={showDefense}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    🛡️ How to prevent this
                                </motion.button>
                                <motion.button
                                    className="bp-btn bp-btn-secondary"
                                    onClick={reset}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    ↻ Try Again
                                </motion.button>
                            </motion.div>
                        )}

                        {phase === 'defense' && (
                            <motion.button
                                key="reset"
                                className="bp-btn bp-btn-secondary"
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
