import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getLessonsByCategory } from '../lessonData'
import ThemeToggle from './ThemeToggle'
import styles from './Navbar.module.css'

const grouped = getLessonsByCategory()

export default function Navbar() {
    const location = useLocation()
    const isHome = location.pathname === '/'
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    // Close on route change
    useEffect(() => {
        setMenuOpen(false)
    }, [location.pathname])

    return (
        <nav className={styles.navbar}>
            <div className={styles.navContent}>
                <Link to="/" className={styles.logo}>
                    <span className={styles.logoIcon}>🛡️</span>
                    Cyber<span className={styles.logoAccent}>Sec</span>Teach
                </Link>

                <div className={styles.navRight}>
                    <Link
                        to="/"
                        className={`${styles.navLink} ${isHome ? styles.navLinkActive : ''}`}
                    >
                        Home
                    </Link>

                    {/* Lessons Dropdown */}
                    <div className={styles.dropdown} ref={menuRef}>
                        <button
                            className={`${styles.navLink} ${styles.dropdownToggle} ${!isHome ? styles.navLinkActive : ''}`}
                            onClick={() => setMenuOpen((v) => !v)}
                        >
                            Lessons
                            <span className={`${styles.dropdownArrow} ${menuOpen ? styles.dropdownArrowOpen : ''}`}>▾</span>
                        </button>

                        {menuOpen && (
                            <div className={styles.dropdownMenu}>
                                {grouped.map((cat) => (
                                    <div key={cat.id} className={styles.dropdownCategory}>
                                        <div className={styles.dropdownCategoryLabel}>{cat.label}</div>
                                        {cat.lessons.map((lesson) => (
                                            <Link
                                                key={lesson.to}
                                                to={lesson.to}
                                                className={`${styles.dropdownItem} ${location.pathname === lesson.to ? styles.dropdownItemActive : ''}`}
                                            >
                                                <span className={styles.dropdownItemIcon}>{lesson.icon}</span>
                                                {lesson.title}
                                            </Link>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <ThemeToggle />
                </div>
            </div>
        </nav>
    )
}
