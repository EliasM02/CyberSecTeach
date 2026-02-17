import { useProgress } from '../context/ProgressContext'
import styles from './Footer.module.css'

export default function Footer() {
    const { resetProgress, xp, totalCompleted } = useProgress()

    const handleReset = () => {
        if (window.confirm('⚠️ Are you sure you want to reset all progress?\n\nThis will delete your XP, badges, and campaign history. This cannot be undone.')) {
            resetProgress()
            window.location.reload()
        }
    }

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerContent}`}>
                <div className={styles.left}>
                    <p>© 2026 CyberSecTeach. Built for educational purposes.</p>
                    <p className={styles.credit}>Made by <a href="https://eliasmahler.vercel.app" target="_blank" rel="noopener noreferrer" className={styles.creditLink}>Elias M</a></p>
                </div>

                <div className={styles.right}>
                    {(xp > 0 || totalCompleted > 0) && (
                        <button onClick={handleReset} className={styles.resetBtn}>
                            🔄 Reset Progress
                        </button>
                    )}
                </div>
            </div>
        </footer>
    )
}
