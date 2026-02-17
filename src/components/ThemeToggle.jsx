import { useState, useEffect } from 'react'
import styles from './ThemeToggle.module.css'

export default function ThemeToggle() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('cst-theme') || 'dark'
    })

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('cst-theme', theme)
    }, [theme])

    const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

    return (
        <button
            className={styles.toggle}
            onClick={toggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            <span className={`${styles.knob} ${theme === 'light' ? styles.knobLight : ''}`}>
                {theme === 'dark' ? '🌙' : '☀️'}
            </span>
        </button>
    )
}
