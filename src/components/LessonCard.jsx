import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProgress } from '../context/ProgressContext'
import styles from './LessonCard.module.css'

const colorMap = {
    green: {
        '--glow-color': 'var(--accent-green)',
        '--glow-shadow': 'var(--shadow-glow-green)',
        '--icon-bg': 'var(--accent-green-dim)',
    },
    blue: {
        '--glow-color': 'var(--accent-blue)',
        '--glow-shadow': 'var(--shadow-glow-blue)',
        '--icon-bg': 'var(--accent-blue-dim)',
    },
    red: {
        '--glow-color': 'var(--accent-red)',
        '--glow-shadow': 'var(--shadow-glow-red)',
        '--icon-bg': 'var(--accent-red-dim)',
    },
    purple: {
        '--glow-color': 'var(--accent-purple)',
        '--glow-shadow': '0 0 20px rgba(168, 85, 247, 0.3)',
        '--icon-bg': 'var(--accent-purple-dim)',
    },
}

export default function LessonCard({ to, icon, title, description, difficulty, tags, color = 'green', index = 0 }) {
    const diffClass = difficulty === 'Easy' ? styles.easy : difficulty === 'Medium' ? styles.medium : styles.hard
    const { isCompleted } = useProgress()
    const done = isCompleted(to)

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
        >
            <Link to={to} className={`${styles.card} ${done ? styles.cardDone : ''}`} style={colorMap[color]}>
                {done && <span className={styles.doneBadge}>✅</span>}
                <div className={styles.iconRow}>
                    <div className={styles.icon}>{icon}</div>
                    <span className={`${styles.difficulty} ${diffClass}`}>{difficulty}</span>
                </div>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
                <div className={styles.footer}>
                    <div className={styles.tags}>
                        {tags.map((t, i) => <span key={i} className={styles.tag}>{t}</span>)}
                    </div>
                    <span className={styles.arrow}>→</span>
                </div>
            </Link>
        </motion.div>
    )
}

