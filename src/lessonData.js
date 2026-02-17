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
    {
        to: '/lesson/xss',
        icon: '💉',
        title: 'Cross-Site Scripting',
        description:
            'Inject JavaScript into a guestbook — steal cookies, redirect visitors, and deface the page.',
        difficulty: 'Medium',
        tags: ['web', 'injection', 'XSS', 'OWASP'],
        color: 'red',
        category: 'attacks',
    },
    {
        to: '/lesson/privesc',
        icon: '🏢',
        title: 'Privilege Escalation',
        description:
            'From guest to admin — see how attackers sneak through a building and find the master key.',
        difficulty: 'Hard',
        tags: ['lateral movement', 'escalation', 'post-exploitation'],
        color: 'red',
        category: 'attacks',
    },
    {
        to: '/lesson/gobuster',
        icon: '🔍',
        title: 'GoBuster',
        description:
            'Find hidden directories and files by scanning every corridor in the building.',
        difficulty: 'Medium',
        tags: ['enumeration', 'directories', 'recon'],
        color: 'blue',
        category: 'tools',
    },
    {
        to: '/lesson/shells',
        icon: '📞',
        title: 'Reverse Shell',
        description:
            'The phone call from inside — how a hacked server calls back to the attacker.',
        difficulty: 'Hard',
        tags: ['shells', 'remote access', 'post-exploitation'],
        color: 'red',
        category: 'tools',
    },
    {
        to: '/lesson/burp',
        icon: '✉️',
        title: 'Burp Suite',
        description:
            'The intercepting courier — open, read, and modify web requests before they arrive.',
        difficulty: 'Medium',
        tags: ['proxy', 'HTTP', 'web testing'],
        color: 'purple',
        category: 'tools',
    },
    {
        to: '/lesson/john',
        icon: '🔨',
        title: 'John the Ripper',
        description:
            'Crack password hashes using the rockyou.txt wordlist — the pentester\'s favourite tool.',
        difficulty: 'Medium',
        tags: ['password', 'hash cracking', 'wordlist'],
        color: 'orange',
        category: 'tools',
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

    // ── Cryptography ────────────────────────────────────────
    {
        to: '/lesson/crypto',
        icon: '🔐',
        title: 'Cryptography',
        description:
            'Crack hashed passwords with a rainbow table — and learn why salting saves the day.',
        difficulty: 'Medium',
        tags: ['hashing', 'encryption', 'passwords', 'rainbow-table'],
        color: 'yellow',
        category: 'attacks',
    },
    {
        to: '/lesson/steganography',
        icon: '🖼️',
        title: 'Steganography',
        description:
            'Find hidden messages inside innocent-looking images — secrets hiding in plain sight.',
        difficulty: 'Medium',
        tags: ['forensics', 'steganography', 'CTF'],
        color: 'teal',
        category: 'attacks',
    },
    {
        to: '/lesson/malware',
        icon: '🦠',
        title: 'Malware Analysis',
        description:
            'Dissect a virus in a sandbox — static analysis, dynamic detonation, and IOC extraction.',
        difficulty: 'Hard',
        tags: ['malware', 'forensics', 'reverse-engineering'],
        color: 'red',
        category: 'attacks',
    },

    // ── Defense ──────────────────────────────────────────────
    {
        to: '/lesson/firewall',
        icon: '🛡️',
        title: 'Firewall Logic',
        description:
            'Be the bouncer — set rules, watch packets arrive, and decide who gets in and who gets blocked.',
        difficulty: 'Easy',
        tags: ['defense', 'firewall', 'blue-team'],
        color: 'blue',
        category: 'defense',
    },
    {
        to: '/lesson/log-analysis',
        icon: '🕵️',
        title: 'Log Analysis',
        description:
            'Read the server\'s diary — hunt through log entries to find port scans, brute-force attacks, and reverse shells.',
        difficulty: 'Easy',
        tags: ['defense', 'logs', 'blue-team', 'soc'],
        color: 'purple',
        category: 'defense',
    },
]

export const categories = [
    { id: 'reconnaissance', label: '🔍 Reconnaissance', description: 'Mapping and discovering targets' },
    { id: 'attacks', label: '⚔️ Attacks', description: 'How attackers exploit vulnerabilities' },
    { id: 'tools', label: '🛠️ Toolkit', description: 'Essential tools for every hacker' },
    { id: 'social-engineering', label: '🎭 Social Engineering', description: 'Hacking the human mind' },
    { id: 'defense', label: '🛡️ Defense', description: 'How to protect and defend systems' },
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
