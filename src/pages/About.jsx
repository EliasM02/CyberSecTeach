import { motion } from 'framer-motion'
import './About.css'

export default function About() {
    return (
        <div className="about-page">
            <div className="container">
                <motion.div
                    className="about-hero"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="about-tag">// about</span>
                    <h1 className="about-title">
                        About <span className="about-gradient">CyberSecTeach</span>
                    </h1>
                </motion.div>

                {/* Creator Section */}
                <motion.section
                    className="about-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="about-card about-creator-card">
                        <div className="about-avatar">👨‍💻</div>
                        <div className="about-creator-info">
                            <h2 className="about-name">Elias M</h2>
                            <p className="about-role">Cybersecurity Student & Developer</p>
                            <a
                                href="https://eliasmahler.vercel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="about-portfolio-link"
                            >
                                🌐 eliasmahler.vercel.app →
                            </a>
                        </div>
                    </div>
                </motion.section>

                {/* Why Section */}
                <motion.section
                    className="about-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="about-section-title">Why CyberSecTeach?</h2>
                    <div className="about-card">
                        <p className="about-text">
                            {/* ── FYLL I DIN TEXT HÄR ── */}
                            I'm building this platform because I believe cybersecurity shouldn't
                            be reserved for experts. Everyone should understand
                            how attacks work — not to become hackers, but to protect
                            themselves and understand the risk they are exposed to.
                        </p>
                        <p className="about-text">
                            {/* ── FYLL I MER OM DIG HÄR ── */}
                            I'm using interactive simulations and simple analogies to make it
                            understandable. No fixed books, no dry lectures — just hands-on learning.
                        </p>
                    </div>
                </motion.section>

                {/* Mission Section */}
                <motion.section
                    className="about-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <h2 className="about-section-title">Mission</h2>
                    <div className="about-mission-grid">
                        <div className="about-mission-card">
                            <div className="about-mission-icon">🎯</div>
                            <h3>Learn by doing</h3>
                            <p>Every lesson is interactive — you see the attack happen, not just read about it.</p>
                        </div>
                        <div className="about-mission-card">
                            <div className="about-mission-icon">🔓</div>
                            <h3>Free & open</h3>
                            <p>Free. No login. No paywall. Learning for everyone.</p>
                        </div>
                        <div className="about-mission-card">
                            <div className="about-mission-icon">🧠</div>
                            <h3>Without jargon</h3>
                            <p>Explained with everyday analogies. No technical background needed.</p>
                        </div>
                    </div>
                </motion.section>

                {/* Tech Stack */}
                <motion.section
                    className="about-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <h2 className="about-section-title">Built with</h2>
                    <div className="about-tech-row">
                        {['React', 'Vite', 'Framer Motion', 'Canvas API', 'CSS Modules'].map(t => (
                            <span key={t} className="about-tech-badge">{t}</span>
                        ))}
                    </div>
                </motion.section>

                {/* Stats */}
                <motion.section
                    className="about-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <div className="about-stats-row">
                        <div className="about-stat">
                            <div className="about-stat-num">20</div>
                            <div className="about-stat-label">Interactive lessons</div>
                        </div>
                        <div className="about-stat">
                            <div className="about-stat-num">60</div>
                            <div className="about-stat-label">Knowledge questions</div>
                        </div>
                        <div className="about-stat">
                            <div className="about-stat-num">2</div>
                            <div className="about-stat-label">Campaigns</div>
                        </div>
                        <div className="about-stat">
                            <div className="about-stat-num">8</div>
                            <div className="about-stat-label">Badges to unlock</div>
                        </div>
                    </div>
                </motion.section>
            </div>
        </div>
    )
}
