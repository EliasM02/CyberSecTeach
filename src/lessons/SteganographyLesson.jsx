import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LessonLayout from '../components/LessonLayout'
import StepExplainer from '../components/StepExplainer'
import './SteganographyLesson.css'

/* — The "image" data — a simulated pixel grid where one row contains a hidden message */
const IMAGE_WIDTH = 16
const IMAGE_HEIGHT = 12

// Generate a fake pixel grid (nature scene colors)
function generatePixels() {
    const palette = [
        [34, 139, 34],   // forest green
        [46, 139, 87],   // sea green
        [85, 107, 47],   // dark olive
        [107, 142, 35],  // olive drab
        [60, 179, 113],  // medium sea green
        [50, 205, 50],   // lime green
        [0, 128, 0],     // green
        [34, 120, 60],   // dark green
    ]
    const pixels = []
    for (let y = 0; y < IMAGE_HEIGHT; y++) {
        const row = []
        for (let x = 0; x < IMAGE_WIDTH; x++) {
            const base = palette[Math.floor(Math.random() * palette.length)]
            row.push([...base])
        }
        pixels.push(row)
    }
    return pixels
}

// The secret message encoded in LSBs
const SECRET = 'FLAG{h1dd3n}'

// Encode the message in the LSBs of a specific row
function encodeMessage(pixels, message, row) {
    const encoded = pixels.map(r => r.map(p => [...p]))
    const bits = []
    for (const char of message) {
        const code = char.charCodeAt(0)
        for (let i = 7; i >= 0; i--) {
            bits.push((code >> i) & 1)
        }
    }
    // Spread bits across the row's R channel LSBs
    for (let i = 0; i < Math.min(bits.length, IMAGE_WIDTH * 3); i++) {
        const px = Math.floor(i / 3)
        const ch = i % 3
        if (px < IMAGE_WIDTH) {
            encoded[row][px][ch] = (encoded[row][px][ch] & 0xFE) | bits[i]
        }
    }
    return encoded
}

const HIDDEN_ROW = 7

const steps = [
    {
        title: 'What is Steganography?',
        description: 'Steganography is the art of hiding information inside something innocent — like a message inside an image. Unlike encryption (which scrambles data), steganography hides the fact that a message even exists.',
    },
    {
        title: 'The image analogy',
        description: 'Imagine a painting in a museum. To the naked eye, it\'s just a landscape. But under UV light, you see a hidden message painted in invisible ink. Digital steganography works the same way — data hides in the "invisible ink" of pixel values.',
    },
    {
        title: 'How LSB encoding works',
        description: 'Each pixel has Red, Green, Blue values (0-255). The Least Significant Bit (LSB) of each value barely changes the color — green "34" vs "35" looks identical. By replacing LSBs with message bits, we hide data in plain sight.',
    },
    {
        title: 'Find the hidden flag!',
        description: 'This image contains a hidden flag encoded in Row 8. Use the tools below to examine pixel LSBs and decode the message. Toggle "Show LSBs" to reveal the binary layer!',
    },
    {
        title: 'Real-world usage',
        description: 'Steganography is used by spies (hiding messages in photos), malware (hiding payloads in images), and whistleblowers (embedding documents in innocent files). Tools like steghide, zsteg, and binwalk can detect and extract hidden data.',
    },
]

export default function SteganographyLesson() {
    const [phase, setPhase] = useState('intro')    // intro | analyzing | found
    const [basePixels] = useState(() => generatePixels())
    const [pixels] = useState(() => encodeMessage(basePixels, SECRET, HIDDEN_ROW))
    const [showLSB, setShowLSB] = useState(false)
    const [selectedRow, setSelectedRow] = useState(null)
    const [extractedBits, setExtractedBits] = useState('')
    const [decodedMsg, setDecodedMsg] = useState('')
    const [currentStep, setCurrentStep] = useState(0)
    const [inspectedPixel, setInspectedPixel] = useState(null)
    const [foundFlag, setFoundFlag] = useState(false)

    const startAnalysis = useCallback(() => {
        setPhase('analyzing')
        setCurrentStep(3)
    }, [])

    const inspectPixel = (y, x) => {
        const px = pixels[y][x]
        setInspectedPixel({
            x, y,
            r: px[0], g: px[1], b: px[2],
            rBin: px[0].toString(2).padStart(8, '0'),
            gBin: px[1].toString(2).padStart(8, '0'),
            bBin: px[2].toString(2).padStart(8, '0'),
            rLSB: px[0] & 1,
            gLSB: px[1] & 1,
            bLSB: px[2] & 1,
        })
    }

    const extractRow = (rowIdx) => {
        setSelectedRow(rowIdx)
        // Extract LSBs from the row
        const bits = []
        for (let x = 0; x < IMAGE_WIDTH; x++) {
            bits.push(pixels[rowIdx][x][0] & 1) // R
            bits.push(pixels[rowIdx][x][1] & 1) // G
            bits.push(pixels[rowIdx][x][2] & 1) // B
        }
        const bitStr = bits.join('')
        setExtractedBits(bitStr)

        // Decode bits to ASCII
        let msg = ''
        for (let i = 0; i + 8 <= bitStr.length; i += 8) {
            const byte = bitStr.slice(i, i + 8)
            const code = parseInt(byte, 2)
            if (code >= 32 && code <= 126) {
                msg += String.fromCharCode(code)
            }
        }
        setDecodedMsg(msg)

        if (msg.includes('FLAG{')) {
            setFoundFlag(true)
            setTimeout(() => {
                setPhase('found')
                setCurrentStep(4)
            }, 1500)
        }
    }

    const reset = () => {
        setPhase('intro')
        setCurrentStep(0)
        setShowLSB(false)
        setSelectedRow(null)
        setExtractedBits('')
        setDecodedMsg('')
        setInspectedPixel(null)
        setFoundFlag(false)
    }

    const sidebar = <StepExplainer steps={steps} currentStep={currentStep} />

    return (
        <LessonLayout
            title="Steganography"
            subtitle="Secrets hiding in plain sight"
            sidebar={sidebar}
        >
            <div className="steg-scene">
                {/* The "Image" */}
                <div className="steg-image-card">
                    <div className="steg-image-header">
                        <span>🖼️ landscape_photo.png</span>
                        <span className="steg-image-size">192 × 144 px (contains hidden data?)</span>
                    </div>
                    <div className="steg-pixel-grid" style={{ gridTemplateColumns: `repeat(${IMAGE_WIDTH}, 1fr)` }}>
                        {pixels.map((row, y) =>
                            row.map((px, x) => (
                                <motion.div
                                    key={`${x}-${y}`}
                                    className={`steg-pixel ${selectedRow === y ? 'steg-pixel-selected-row' : ''} ${inspectedPixel?.x === x && inspectedPixel?.y === y ? 'steg-pixel-inspected' : ''}`}
                                    style={{
                                        background: showLSB
                                            ? `rgb(${(px[0] & 1) * 255}, ${(px[1] & 1) * 255}, ${(px[2] & 1) * 255})`
                                            : `rgb(${px[0]}, ${px[1]}, ${px[2]})`,
                                    }}
                                    onClick={() => phase === 'analyzing' && inspectPixel(y, x)}
                                    whileHover={phase === 'analyzing' ? { scale: 1.3, zIndex: 10 } : {}}
                                />
                            ))
                        )}
                    </div>
                    {/* Row labels */}
                    <div className="steg-row-labels">
                        {Array.from({ length: IMAGE_HEIGHT }, (_, i) => (
                            <button
                                key={i}
                                className={`steg-row-btn ${selectedRow === i ? 'steg-row-btn-active' : ''} ${foundFlag && i === HIDDEN_ROW ? 'steg-row-btn-found' : ''}`}
                                onClick={() => phase === 'analyzing' && extractRow(i)}
                                disabled={phase !== 'analyzing'}
                            >
                                Row {i + 1}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Controls */}
                <div className="steg-tools">
                    {phase === 'intro' && (
                        <motion.button
                            className="steg-btn steg-btn-start"
                            onClick={startAnalysis}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            🔬 Analyze Image
                        </motion.button>
                    )}

                    {phase === 'analyzing' && (
                        <>
                            <div className="steg-tool-bar">
                                <button
                                    className={`steg-toggle ${showLSB ? 'steg-toggle-on' : ''}`}
                                    onClick={() => setShowLSB(v => !v)}
                                >
                                    {showLSB ? '👁️ LSB View ON' : '👁️ Show LSBs'}
                                </button>
                                <span className="steg-hint">Click pixels to inspect • Click row buttons to extract LSBs</span>
                            </div>

                            {/* Pixel Inspector */}
                            <AnimatePresence>
                                {inspectedPixel && (
                                    <motion.div
                                        className="steg-inspector"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className="steg-inspector-header">🔍 Pixel ({inspectedPixel.x}, {inspectedPixel.y})</div>
                                        <div className="steg-inspector-grid">
                                            <div className="steg-channel steg-channel-r">
                                                <span className="steg-channel-label">R</span>
                                                <span className="steg-channel-val">{inspectedPixel.r}</span>
                                                <code className="steg-channel-bin">{inspectedPixel.rBin.slice(0, 7)}<span className="steg-lsb-highlight">{inspectedPixel.rLSB}</span></code>
                                            </div>
                                            <div className="steg-channel steg-channel-g">
                                                <span className="steg-channel-label">G</span>
                                                <span className="steg-channel-val">{inspectedPixel.g}</span>
                                                <code className="steg-channel-bin">{inspectedPixel.gBin.slice(0, 7)}<span className="steg-lsb-highlight">{inspectedPixel.gLSB}</span></code>
                                            </div>
                                            <div className="steg-channel steg-channel-b">
                                                <span className="steg-channel-label">B</span>
                                                <span className="steg-channel-val">{inspectedPixel.b}</span>
                                                <code className="steg-channel-bin">{inspectedPixel.bBin.slice(0, 7)}<span className="steg-lsb-highlight">{inspectedPixel.bLSB}</span></code>
                                            </div>
                                        </div>
                                        <div className="steg-inspector-note">The <span className="steg-lsb-highlight">highlighted bit</span> is the LSB — change it and the color barely changes!</div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Extraction Result */}
                            <AnimatePresence>
                                {selectedRow !== null && (
                                    <motion.div
                                        className={`steg-extract ${foundFlag ? 'steg-extract-found' : ''}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="steg-extract-header">
                                            📡 Extracted LSBs from Row {selectedRow + 1}:
                                        </div>
                                        <code className="steg-bits">{extractedBits}</code>
                                        <div className="steg-decoded-header">Decoded ASCII:</div>
                                        <code className={`steg-decoded ${foundFlag ? 'steg-decoded-flag' : ''}`}>
                                            {decodedMsg || '(no readable text)'}
                                        </code>
                                        {foundFlag && (
                                            <motion.div
                                                className="steg-flag-found"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: 'spring', stiffness: 400 }}
                                            >
                                                🚩 FLAG FOUND!
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </>
                    )}

                    {phase === 'found' && (
                        <motion.div
                            className="steg-defense"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h3 className="steg-defense-title">🛡️ Detection & Defense</h3>
                            <div className="steg-defense-grid">
                                <div className="steg-defense-card">
                                    <div className="steg-defense-label">Detection Tools</div>
                                    <code className="steg-defense-code">steghide, zsteg, binwalk, stegsolve</code>
                                    <p>These tools analyze LSBs, color planes, and file structure to detect hidden data.</p>
                                </div>
                                <div className="steg-defense-card">
                                    <div className="steg-defense-label">Statistical Analysis</div>
                                    <code className="steg-defense-code">Chi-square test on LSB distribution</code>
                                    <p>Random-looking LSB patterns are suspicious — natural images have predictable bit distributions.</p>
                                </div>
                                <div className="steg-defense-card">
                                    <div className="steg-defense-label">Real-World Use</div>
                                    <code className="steg-defense-code">APT groups, data exfiltration, CTF challenges</code>
                                    <p>Used by malware to hide C2 commands in images, and in CTF competitions as forensics challenges.</p>
                                </div>
                            </div>
                            <motion.button
                                className="steg-btn steg-btn-reset"
                                onClick={reset}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                ↻ Try Again
                            </motion.button>
                        </motion.div>
                    )}
                </div>
            </div>
        </LessonLayout>
    )
}
