import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import QuizPanel from './QuizPanel'
import styles from './LessonLayout.module.css'

export default function LessonLayout({ title, subtitle, sidebar, children }) {
    return (
        <motion.div
            className={styles.layout}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className={styles.header}>
                <div className="container">
                    <Link to="/" className={styles.backLink}>← Back to lessons</Link>
                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {title}
                    </motion.h1>
                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        {subtitle}
                    </motion.p>
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.lessonArea}>
                    <div className={styles.animationPanel}>
                        {children}
                        <QuizPanel />
                    </div>
                    <div className={styles.sidePanel}>
                        {sidebar}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

