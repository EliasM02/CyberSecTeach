import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './ThreatMap.css'

/* ═══ City data: [name, lat, lon, country] ═══ */
const CITIES = [
    ['Moscow', 55.75, 37.61, 'RU'],
    ['Beijing', 39.90, 116.40, 'CN'],
    ['Washington', 38.90, -77.04, 'US'],
    ['London', 51.51, -0.13, 'GB'],
    ['Tokyo', 35.68, 139.69, 'JP'],
    ['São Paulo', -23.55, -46.63, 'BR'],
    ['Sydney', -33.87, 151.21, 'AU'],
    ['Mumbai', 19.08, 72.88, 'IN'],
    ['Berlin', 52.52, 13.40, 'DE'],
    ['Seoul', 37.57, 126.98, 'KR'],
    ['Tehran', 35.69, 51.39, 'IR'],
    ['Lagos', 6.52, 3.38, 'NG'],
    ['Stockholm', 59.33, 18.07, 'SE'],
    ['Toronto', 43.65, -79.38, 'CA'],
    ['Dubai', 25.20, 55.27, 'AE'],
    ['Singapore', 1.35, 103.82, 'SG'],
    ['Kyiv', 50.45, 30.52, 'UA'],
    ['Paris', 48.86, 2.35, 'FR'],
    ['Shenzhen', 22.54, 114.06, 'CN'],
    ['Tel Aviv', 32.08, 34.78, 'IL'],
]

const ATTACK_TYPES = [
    { type: 'DDoS', color: '#ff4757', label: '🚗 DDoS' },
    { type: 'Brute Force', color: '#feca57', label: '🔑 Brute Force' },
    { type: 'Phishing', color: '#54a0ff', label: '📬 Phishing' },
    { type: 'Ransomware', color: '#ff6b81', label: '🔒 Ransomware' },
    { type: 'SQL Injection', color: '#a855f7', label: '💉 SQL Injection' },
    { type: 'XSS', color: '#00ff88', label: '💉 XSS' },
    { type: 'Port Scan', color: '#ff9f43', label: '🔍 Port Scan' },
    { type: 'Malware', color: '#ee5a24', label: '🦠 Malware' },
]

// Simplified world map path data (continental outlines as polygons)
// Each continent is an array of [lon, lat] points
const WORLD_PATHS = [
    // North America (simplified)
    [[-130, 50], [-125, 60], [-105, 68], [-85, 70], [-75, 62], [-55, 50], [-67, 45], [-80, 25], [-90, 18], [-105, 20], [-118, 32], [-125, 48], [-130, 50]],
    // South America
    [[-80, 10], [-60, 5], [-35, -5], [-35, -20], [-55, -35], [-70, -55], [-75, -45], [-70, -20], [-80, -5], [-80, 10]],
    // Europe
    [[-10, 36], [0, 43], [5, 44], [15, 45], [30, 45], [40, 42], [28, 36], [15, 37], [5, 36], [-10, 36]],
    // Europe north
    [[5, 50], [5, 55], [10, 55], [12, 57], [18, 60], [25, 62], [30, 70], [25, 72], [15, 68], [5, 62], [5, 50]],
    // Africa
    [[-17, 15], [-10, 5], [5, 5], [10, 2], [30, -5], [40, -12], [35, -35], [20, -35], [12, -17], [5, 5], [-5, 5], [-17, 15]],
    // Africa north
    [[-10, 36], [0, 36], [10, 37], [15, 32], [25, 32], [35, 30], [30, 20], [20, 15], [5, 15], [-5, 15], [-17, 15], [-17, 22], [-10, 36]],
    // Asia
    [[28, 36], [40, 42], [50, 40], [55, 45], [65, 40], [70, 25], [80, 15], [75, 10], [90, 22], [100, 20], [105, 10], [110, 1], [120, 20], [130, 35], [140, 40], [142, 45], [135, 55], [120, 55], [100, 55], [60, 55], [40, 55], [30, 45], [28, 36]],
    // Australia
    [[115, -20], [130, -12], [145, -15], [155, -25], [150, -38], [135, -35], [115, -32], [115, -20]],
    // UK/Ireland
    [[-8, 52], [-5, 58], [0, 58], [2, 52], [-3, 50], [-5, 52], [-8, 52]],
    // Scandinavia
    [[5, 58], [8, 58], [12, 56], [15, 56], [18, 60], [22, 64], [28, 70], [20, 70], [12, 65], [8, 62], [5, 58]],
]

function latLonToXY(lat, lon, w, h) {
    const x = (lon + 180) / 360 * w
    const y = (90 - lat) / 180 * h
    return [x, y]
}

function createAttack(w, h) {
    const src = CITIES[Math.floor(Math.random() * CITIES.length)]
    let dst = CITIES[Math.floor(Math.random() * CITIES.length)]
    while (dst[0] === src[0]) dst = CITIES[Math.floor(Math.random() * CITIES.length)]
    const attackType = ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)]
    const [sx, sy] = latLonToXY(src[1], src[2], w, h)
    const [dx, dy] = latLonToXY(dst[1], dst[2], w, h)
    return {
        sx, sy, dx, dy,
        srcName: src[0], srcCountry: src[3],
        dstName: dst[0], dstCountry: dst[3],
        ...attackType,
        t: 0,
        speed: 0.003 + Math.random() * 0.005,
        id: Math.random(),
    }
}

export default function ThreatMap() {
    const canvasRef = useRef(null)
    const attacksRef = useRef([])
    const statsRef = useRef({ total: 0, byType: {} })
    const animRef = useRef(null)
    const [stats, setStats] = useState({ total: 0, byType: {} })
    const [recentAttacks, setRecentAttacks] = useState([])
    const [paused, setPaused] = useState(false)
    const pausedRef = useRef(false)

    const [scenario, setScenario] = useState(null) // null | 'stockholm' | 'dc' | 'beijing'

    const getSize = useCallback(() => {
        const canvas = canvasRef.current
        if (!canvas) return [960, 500]
        const parent = canvas.parentElement
        return [parent.clientWidth, parent.clientHeight]
    }, [])

    // Scenario configurations
    const SCENARIOS = {
        'stockholm': { target: 'Stockholm', type: 'DDoS', color: '#ff4757', label: '🇸🇪 Target: Sweden (DDoS)' },
        'dc': { target: 'Washington', type: 'Espionage', color: '#a855f7', label: '🇺🇸 Target: USA (Espionage)' },
        'financial': { target: 'London', type: 'Ransomware', color: '#ff6b81', label: '🇬🇧 Target: London (Ransomware)' },
    }

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        const resize = () => {
            const [w, h] = getSize()
            canvas.width = w * window.devicePixelRatio
            canvas.height = h * window.devicePixelRatio
            canvas.style.width = w + 'px'
            canvas.style.height = h + 'px'
            ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0)
        }
        resize()
        window.addEventListener('resize', resize)

        // Spawn attacks periodically
        const spawnInterval = setInterval(() => {
            if (pausedRef.current) return
            const [w, h] = getSize()

            // SCENARIO LOGIC
            let a
            if (scenario) {
                // 80% chance to follow scenario, 20% random noise
                if (Math.random() > 0.2) {
                    const scene = SCENARIOS[scenario]
                    const targetCity = CITIES.find(c => c[0] === scene.target)
                    // Pick random source that isn't the target
                    let src = CITIES[Math.floor(Math.random() * CITIES.length)]
                    while (src[0] === targetCity[0]) src = CITIES[Math.floor(Math.random() * CITIES.length)]

                    const [sx, sy] = latLonToXY(src[1], src[2], w, h)
                    const [dx, dy] = latLonToXY(targetCity[1], targetCity[2], w, h)

                    a = {
                        sx, sy, dx, dy,
                        srcName: src[0], srcCountry: src[3],
                        dstName: targetCity[0], dstCountry: targetCity[3],
                        type: scene.type,
                        color: scene.color,
                        label: scene.label,
                        t: 0,
                        speed: 0.005 + Math.random() * 0.008, // Faster for scenarios
                        id: Math.random(),
                    }
                } else {
                    a = createAttack(w, h)
                }
            } else {
                a = createAttack(w, h)
            }

            attacksRef.current.push(a)

            // Update stats
            statsRef.current.total++
            statsRef.current.byType[a.type] = (statsRef.current.byType[a.type] || 0) + 1
            setStats({ ...statsRef.current })

            // Update recent
            setRecentAttacks(prev => {
                const next = [{ src: a.srcName, dst: a.dstName, type: a.type, color: a.color, time: new Date() }, ...prev]
                return next.slice(0, 8)
            })
        }, scenario ? 150 : 600) // Much faster spawn rate during scenarios!

        // Animation loop (same as before)
        const draw = () => {
            const [w, h] = getSize()

            ctx.clearRect(0, 0, w, h)

            // Draw grid
            ctx.strokeStyle = 'rgba(26, 35, 50, 0.5)'
            ctx.lineWidth = 0.5
            for (let i = 0; i <= 18; i++) {
                const y = (i / 18) * h
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
            }
            for (let i = 0; i <= 36; i++) {
                const x = (i / 36) * w
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
            }

            // Draw continents
            ctx.fillStyle = 'rgba(30, 45, 65, 0.6)'
            ctx.strokeStyle = 'rgba(0, 255, 136, 0.15)'
            ctx.lineWidth = 1
            for (const path of WORLD_PATHS) {
                ctx.beginPath()
                for (let i = 0; i < path.length; i++) {
                    const [x, y] = latLonToXY(path[i][1], path[i][0], w, h)
                    if (i === 0) ctx.moveTo(x, y)
                    else ctx.lineTo(x, y)
                }
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
            }

            // Draw city dots
            for (const city of CITIES) {
                const [x, y] = latLonToXY(city[1], city[2], w, h)
                ctx.beginPath()

                // Highlight target city during scenario
                if (scenario && city[0] === SCENARIOS[scenario].target) {
                    ctx.fillStyle = SCENARIOS[scenario].color
                    ctx.shadowBlur = 15
                    ctx.shadowColor = SCENARIOS[scenario].color
                    ctx.arc(x, y, 6, 0, Math.PI * 2)
                    ctx.fill()
                    ctx.shadowBlur = 0

                    // Ripple effect
                    const time = Date.now() / 1000
                    ctx.beginPath()
                    ctx.strokeStyle = SCENARIOS[scenario].color
                    ctx.lineWidth = 1
                    ctx.arc(x, y, 10 + Math.sin(time * 5) * 5, 0, Math.PI * 2)
                    ctx.stroke()
                } else {
                    ctx.fillStyle = 'rgba(0, 255, 136, 0.3)'
                    ctx.arc(x, y, 2, 0, Math.PI * 2)
                    ctx.fill()
                }
            }

            // Draw attacks
            if (!pausedRef.current && attacksRef.current) {
                for (let i = attacksRef.current.length - 1; i >= 0; i--) {
                    const a = attacksRef.current[i]
                    a.t += a.speed

                    if (a.t > 1) {
                        // Impact flash
                        ctx.beginPath()
                        const r = 8 * (1 - (a.t - 1) * 10)
                        if (r > 0) {
                            ctx.arc(a.dx, a.dy, r, 0, Math.PI * 2)
                            ctx.fillStyle = a.color + '44'
                            ctx.fill()
                        }
                        if (a.t > 1.1) {
                            attacksRef.current.splice(i, 1)
                        }
                        continue
                    }

                    // Curved path
                    const midX = (a.sx + a.dx) / 2
                    const dist = Math.sqrt((a.dx - a.sx) ** 2 + (a.dy - a.sy) ** 2)
                    const midY = (a.sy + a.dy) / 2 - dist * 0.25

                    // Draw arc trail
                    ctx.strokeStyle = a.color + '22'
                    ctx.lineWidth = 1
                    ctx.beginPath()
                    for (let t = 0; t <= 1; t += 0.02) {
                        const x = (1 - t) * (1 - t) * a.sx + 2 * (1 - t) * t * midX + t * t * a.dx
                        const y = (1 - t) * (1 - t) * a.sy + 2 * (1 - t) * t * midY + t * t * a.dy
                        if (t === 0) ctx.moveTo(x, y)
                        else ctx.lineTo(x, y)
                    }
                    ctx.stroke()

                    // Draw the "bullet"
                    const t = a.t
                    const px = (1 - t) * (1 - t) * a.sx + 2 * (1 - t) * t * midX + t * t * a.dx
                    const py = (1 - t) * (1 - t) * a.sy + 2 * (1 - t) * t * midY + t * t * a.dy

                    // Glow
                    const glow = ctx.createRadialGradient(px, py, 0, px, py, 6)
                    glow.addColorStop(0, a.color + 'aa')
                    glow.addColorStop(1, a.color + '00')
                    ctx.fillStyle = glow
                    ctx.beginPath()
                    ctx.arc(px, py, 6, 0, Math.PI * 2)
                    ctx.fill()

                    // Core dot
                    ctx.fillStyle = a.color
                    ctx.beginPath()
                    ctx.arc(px, py, 2, 0, Math.PI * 2)
                    ctx.fill()

                    // Trail
                    const trailLen = 8
                    for (let j = 1; j <= trailLen; j++) {
                        const tt = Math.max(0, t - j * 0.008)
                        const tx = (1 - tt) * (1 - tt) * a.sx + 2 * (1 - tt) * tt * midX + tt * tt * a.dx
                        const ty = (1 - tt) * (1 - tt) * a.sy + 2 * (1 - tt) * tt * midY + tt * tt * a.dy
                        ctx.fillStyle = a.color + Math.floor(20 - j * 2).toString(16).padStart(2, '0')
                        ctx.beginPath()
                        ctx.arc(tx, ty, 1.5, 0, Math.PI * 2)
                        ctx.fill()
                    }

                    // Source / destination dots
                    ctx.fillStyle = a.color + '66'
                    ctx.beginPath(); ctx.arc(a.sx, a.sy, 3, 0, Math.PI * 2); ctx.fill()
                    ctx.beginPath(); ctx.arc(a.dx, a.dy, 3, 0, Math.PI * 2); ctx.fill()
                }
            }

            animRef.current = requestAnimationFrame(draw)
        }

        animRef.current = requestAnimationFrame(draw)

        return () => {
            window.removeEventListener('resize', resize)
            clearInterval(spawnInterval)
            if (animRef.current) cancelAnimationFrame(animRef.current)
        }
    }, [getSize, scenario]) // Re-run effect when scenario changes

    const togglePause = () => {
        setPaused(p => {
            pausedRef.current = !p
            return !p
        })
    }

    return (
        <div className="tm-page">
            {/* Header */}
            <div className="tm-header">
                <div className="tm-header-left">
                    <h1 className="tm-title">🌍 Threat Intelligence Map</h1>
                    <p className="tm-subtitle">Real-time* cyber attack visualization</p>
                    <span className="tm-disclaimer">*Simulated for educational purposes</span>
                </div>

                {/* Scenario Controls */}
                <div className="tm-scenarios">
                    <span className="tm-scenario-label">SCENARIOS:</span>
                    <button
                        className={`tm-scenario-btn ${scenario === 'stockholm' ? 'tm-scenario-active' : ''}`}
                        onClick={() => setScenario(scenario === 'stockholm' ? null : 'stockholm')}
                    >
                        Target Sweden 🇸🇪
                    </button>
                    <button
                        className={`tm-scenario-btn ${scenario === 'dc' ? 'tm-scenario-active' : ''}`}
                        onClick={() => setScenario(scenario === 'dc' ? null : 'dc')}
                    >
                        Target USA 🇺🇸
                    </button>
                    <button
                        className={`tm-scenario-btn ${scenario === 'financial' ? 'tm-scenario-active' : ''}`}
                        onClick={() => setScenario(scenario === 'financial' ? null : 'financial')}
                    >
                        Target Finance 🇬🇧
                    </button>
                </div>

                <div className="tm-header-right">
                    <motion.button
                        className={`tm-pause-btn ${paused ? 'tm-pause-btn-paused' : ''}`}
                        onClick={togglePause}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {paused ? '▶ Resume' : '⏸ Pause'}
                    </motion.button>
                </div>
            </div>

            {/* Main Content */}
            <div className="tm-content">
                {/* Map */}
                <div className="tm-map-container">
                    <canvas ref={canvasRef} className="tm-canvas" />
                    {/* Live indicator */}
                    <div className="tm-live">
                        <span className={`tm-live-dot ${paused ? 'tm-live-dot-paused' : ''}`} />
                        {paused ? 'PAUSED' : 'LIVE'}
                    </div>

                    {/* Active Scenario Banner */}
                    <AnimatePresence>
                        {scenario && (
                            <motion.div
                                className="tm-scenario-banner"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <span className="tm-scenario-alert">⚠️ ACTIVE THREAT SCENARIO</span>
                                <span className="tm-scenario-name">{SCENARIOS[scenario].label}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar */}
                <div className="tm-sidebar">
                    {/* Stats */}
                    <div className="tm-stats-card">
                        <div className="tm-stats-header">📊 Attack Statistics</div>
                        <div className="tm-stats-total">
                            <span className="tm-stats-number">{stats.total.toLocaleString()}</span>
                            <span className="tm-stats-label">Total Attacks</span>
                        </div>
                        <div className="tm-type-list">
                            {ATTACK_TYPES.map(at => (
                                <div key={at.type} className="tm-type-row">
                                    <span className="tm-type-dot" style={{ background: at.color }} />
                                    <span className="tm-type-name">{at.type}</span>
                                    <span className="tm-type-count">{stats.byType[at.type] || 0}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent */}
                    <div className="tm-recent-card">
                        <div className="tm-recent-header">⚡ Recent Attacks</div>
                        <div className="tm-recent-list">
                            {recentAttacks.map((a, i) => (
                                <motion.div
                                    key={`${a.time.getTime()}-${i}`}
                                    className="tm-recent-item"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <span className="tm-recent-dot" style={{ background: a.color }} />
                                    <div className="tm-recent-info">
                                        <span className="tm-recent-route">{a.src} → {a.dst}</span>
                                        <span className="tm-recent-type">{a.type}</span>
                                    </div>
                                </motion.div>
                            ))}
                            {recentAttacks.length === 0 && (
                                <div className="tm-recent-empty">Waiting for attacks...</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
