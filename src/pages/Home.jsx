import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import LessonCard from '../components/LessonCard'
import { getLessonsByCategory } from '../lessonData'
import lessons from '../lessonData'
import { useProgress } from '../context/ProgressContext'
import styles from './Home.module.css'

const grouped = getLessonsByCategory()

export default function Home() {
    const { xp, totalCompleted, unlockedBadges, nextBadge, allBadges } = useProgress()
    const percent = Math.round((totalCompleted / lessons.length) * 100)
    const [activeCategory, setActiveCategory] = useState('all')

    const filteredGroups = activeCategory === 'all'
        ? grouped
        : grouped.filter(cat => cat.id === activeCategory)

    return (
        <div className={styles.home}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className="container">
                    <motion.span
                        className={styles.heroTag}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        🛡️ Interactive Learning
                    </motion.span>
                    <motion.h1
                        className={styles.heroTitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        Learn <span className={styles.heroGradient}>Cybersecurity</span> Without the Tech Jargon
                    </motion.h1>
                    <motion.p
                        className={styles.heroSubtitle}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        See how real cyber attacks work through interactive animations and everyday analogies.
                        No technical background needed.
                    </motion.p>
                    <motion.div
                        className={styles.heroStats}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className={styles.stat}>
                            <div className={styles.statNumber}>{lessons.length}</div>
                            <div className={styles.statLabel}>Interactive Lessons</div>
                        </div>
                        <div className={styles.stat}>
                            <div className={styles.statNumber}>{xp}</div>
                            <div className={styles.statLabel}>XP Earned</div>
                        </div>
                        <div className={styles.stat}>
                            <div className={styles.statNumber}>{totalCompleted}/{lessons.length}</div>
                            <div className={styles.statLabel}>Completed</div>
                        </div>
                    </motion.div>

                    {/* Progress bar */}
                    <motion.div
                        className={styles.progressSection}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <div className={styles.progressBar}>
                            <motion.div
                                className={styles.progressFill}
                                initial={{ width: 0 }}
                                animate={{ width: `${percent}%` }}
                                transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
                            />
                        </div>
                        <span className={styles.progressLabel}>{percent}% complete</span>
                    </motion.div>

                    {/* Badge row */}
                    {allBadges.length > 0 && (
                        <motion.div
                            className={styles.badgeRow}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                        >
                            {allBadges.map((badge) => {
                                const unlocked = unlockedBadges.some((b) => b.id === badge.id)
                                return (
                                    <div
                                        key={badge.id}
                                        className={`${styles.badge} ${unlocked ? styles.badgeUnlocked : styles.badgeLocked}`}
                                        title={`${badge.description}${unlocked ? ' ✅' : ` (${badge.threshold} lessons)`}`}
                                    >
                                        <span className={styles.badgeIcon}>{badge.label.split(' ')[0]}</span>
                                        <span className={styles.badgeName}>{badge.label.split(' ').slice(1).join(' ')}</span>
                                    </div>
                                )
                            })}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Campaign CTA */}
            <section className={styles.campaignSection}>
                <div className="container">
                    <Link to="/campaign" className={styles.campaignCard}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={styles.campaignInner}
                        >
                            <div className={styles.campaignLeft}>
                                <span className={styles.campaignTag}>🔗 Story Mode</span>
                                <h2 className={styles.campaignTitle}>The Corporate Breach</h2>
                                <p className={styles.campaignDesc}>Execute a full attack chain — from reconnaissance to ransomware. 5 missions, 1 story.</p>
                            </div>
                            <div className={styles.campaignRight}>
                                <span className={styles.campaignArrow}>→</span>
                            </div>
                        </motion.div>
                    </Link>
                </div>
            </section>

            {/* Lessons by Category */}
            <section className={styles.lessonsSection}>
                <div className="container">
                    {/* Category Tabs */}
                    <div className={styles.categoryTabs}>
                        <button
                            className={`${styles.categoryTab} ${activeCategory === 'all' ? styles.categoryTabActive : ''}`}
                            onClick={() => setActiveCategory('all')}
                        >
                            📚 All ({lessons.length})
                        </button>
                        {grouped.map(cat => (
                            <button
                                key={cat.id}
                                className={`${styles.categoryTab} ${activeCategory === cat.id ? styles.categoryTabActive : ''}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                {cat.label} ({cat.lessons.length})
                            </button>
                        ))}
                    </div>

                    {filteredGroups.map((cat, catIdx) => (
                        <div key={cat.id} className={styles.categoryBlock}>
                            <motion.div
                                className={styles.categoryHeader}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: catIdx * 0.1 }}
                            >
                                <span className={styles.categoryLabel}>{cat.label}</span>
                                <span className={styles.categoryDesc}>{cat.description}</span>
                            </motion.div>
                            <div className={styles.grid}>
                                {cat.lessons.map((lesson, i) => (
                                    <LessonCard key={lesson.to} {...lesson} index={i} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className={styles.howSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionTag}>// how-it-works</span>
                        <h2 className={styles.sectionTitle}>How It Works</h2>
                    </div>
                    <div className={styles.howGrid}>
                        <motion.div
                            className={styles.howCard}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0 }}
                        >
                            <div className={styles.howIcon}>🎯</div>
                            <h3 className={styles.howTitle}>Pick a Topic</h3>
                            <p className={styles.howDesc}>Choose from attacks, defenses, and tools — each explained with a real-world analogy you already understand.</p>
                        </motion.div>
                        <motion.div
                            className={styles.howCard}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.15 }}
                        >
                            <div className={styles.howIcon}>▶️</div>
                            <h3 className={styles.howTitle}>Watch & Interact</h3>
                            <p className={styles.howDesc}>Press play and watch the attack or defense unfold step by step with animated visuals.</p>
                        </motion.div>
                        <motion.div
                            className={styles.howCard}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className={styles.howIcon}>🧠</div>
                            <h3 className={styles.howTitle}>Understand It</h3>
                            <p className={styles.howDesc}>Read the plain-language explanation alongside the animation. No jargon, no confusion.</p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    )
}
