// Central lesson registry — single source of truth for Home page + Navbar
// Last updated: 2026-02-17
// Categories: reconnaissance, attacks, social-engineering  (+ 'defense' reserved for future)

const lessons = [
    // ── Reconnaissance ──────────────────────────────────────
    {
        to: '/lesson/nmap',
        icon: '🏠',
        title: 'Nmap — Port Scanning',
        description:
            'Watch how hackers find open doors into a server — like someone walking around a house trying every entrance.',
        difficulty: 'Easy',
        tags: ['reconnaissance', 'ports', 'scanning'],
        color: 'green',
        category: 'reconnaissance',
    },

    // ── Attacks ─────────────────────────────────────────────
    {
        to: '/lesson/phishing',
        icon: '📬',
        title: 'Phishing Attacks',
        description:
            'A fake email that looks real — learn how attackers trick people into handing over their credentials.',
        difficulty: 'Easy',
        tags: ['social engineering', 'email', 'fraud'],
        color: 'blue',
        category: 'attacks',
    },
    {
        to: '/lesson/ddos',
        icon: '🚗',
        title: 'DDoS Attack',
        description:
            'Thousands of cars flooding a highway — see how too many requests can take down a server.',
        difficulty: 'Medium',
        tags: ['denial of service', 'traffic', 'defense'],
        color: 'red',
        category: 'attacks',
    },
    {
        to: '/lesson/sqli',
        icon: '💉',
        title: 'SQL Injection',
        description:
            'When a login form becomes a weapon — see how attackers manipulate databases with a single input.',
        difficulty: 'Medium',
        tags: ['web', 'databases', 'injection'],
        color: 'purple',
        category: 'attacks',
    },
    {
        to: '/lesson/mitm',
        icon: '📡',
        title: 'Man-in-the-Middle',
        description:
            'Someone is secretly reading your messages at the café — see how attackers intercept network traffic.',
        difficulty: 'Medium',
        tags: ['network', 'WiFi', 'interception'],
        color: 'red',
        category: 'attacks',
    },
    {
        to: '/lesson/bruteforce',
        icon: '🔑',
        title: 'Brute Force',
        description:
            'Trying millions of passwords per second — watch an attacker crack a weak password in real time.',
        difficulty: 'Easy',
        tags: ['passwords', 'cracking', 'defense'],
        color: 'green',
        category: 'attacks',
    },
    {
        to: '/lesson/ransomware',
        icon: '🔒',
        title: 'Ransomware',
        description:
            'Your files just got encrypted and someone wants Bitcoin — experience a ransomware attack firsthand.',
        difficulty: 'Medium',
        tags: ['malware', 'encryption', 'bitcoin'],
        color: 'red',
        category: 'attacks',
    },
    {
        to: '/lesson/session-hijacking',
        icon: '🎟️',
        title: 'Session Hijacking',
        description:
            'Someone stole your VIP wristband — see how attackers steal cookies to take over your session.',
        difficulty: 'Medium',
        tags: ['cookies', 'sessions', 'HTTPS'],
        color: 'purple',
        category: 'attacks',
    },

    // ── Social Engineering ──────────────────────────────────
    {
        to: '/lesson/social-engineering',
        icon: '🎭',
        title: 'Social Engineering',
        description:
            'The art of hacking humans — see how attackers use psychology to trick people into giving up secrets.',
        difficulty: 'Easy',
        tags: ['manipulation', 'psychology', 'awareness'],
        color: 'blue',
        category: 'social-engineering',
    },
]

export const categories = [
    { id: 'reconnaissance', label: '🔍 Reconnaissance', description: 'Mapping and discovering targets' },
    { id: 'attacks', label: '⚔️ Attacks', description: 'How attackers exploit vulnerabilities' },
    { id: 'social-engineering', label: '🎭 Social Engineering', description: 'Hacking the human mind' },
    // { id: 'defense', label: '🛡️ Defense', description: 'How to protect yourself' },  // future
]

export function getLessonsByCategory() {
    return categories
        .map((cat) => ({
            ...cat,
            lessons: lessons.filter((l) => l.category === cat.id),
        }))
        .filter((cat) => cat.lessons.length > 0)
}

export default lessons
