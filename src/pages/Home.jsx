import { motion } from 'framer-motion'
import LessonCard from '../components/LessonCard'
import { getLessonsByCategory } from '../lessonData'
import lessons from '../lessonData'
import styles from './Home.module.css'

const grouped = getLessonsByCategory()

export default function Home() {
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
                            <div className={styles.statNumber}>0</div>
                            <div className={styles.statLabel}>Prerequisites</div>
                        </div>
                        <div className={styles.stat}>
                            <div className={styles.statNumber}>100%</div>
                            <div className={styles.statLabel}>Visual Learning</div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Lessons by Category */}
            <section className={styles.lessonsSection}>
                <div className="container">
                    {grouped.map((cat, catIdx) => (
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
