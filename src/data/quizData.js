// Quiz data for all lessons — 3 questions each
// Each question has: question, options[], correct (index)

const quizData = {
    '/lesson/nmap': [
        {
            question: 'What does Nmap primarily do?',
            options: ['Sends emails', 'Scans for open ports on a target', 'Encrypts files', 'Blocks hackers'],
            correct: 1,
        },
        {
            question: 'What is an "open port" comparable to?',
            options: ['A locked door', 'An open door into a building', 'A security camera', 'A password'],
            correct: 1,
        },
        {
            question: 'Why do hackers scan for open ports?',
            options: [
                'To find services they can try to exploit',
                'To make the server faster',
                'To install antivirus',
                'To send emails',
            ],
            correct: 0,
        },
    ],
    '/lesson/phishing': [
        {
            question: 'What is phishing?',
            options: [
                'A type of fishing sport',
                'A fake message designed to steal your information',
                'A way to encrypt data',
                'A firewall technique',
            ],
            correct: 1,
        },
        {
            question: 'What is the best way to spot a phishing email?',
            options: [
                'Check if it has a subject line',
                'Look at the sender address carefully',
                'See if it has attachments',
                'Check the font size',
            ],
            correct: 1,
        },
        {
            question: 'Why does phishing work so well?',
            options: [
                'It uses advanced hacking tools',
                'It exploits human trust and urgency',
                'It breaks encryption',
                'It bypasses all firewalls',
            ],
            correct: 1,
        },
    ],
    '/lesson/ddos': [
        {
            question: 'What does DDoS stand for?',
            options: [
                'Direct Download of Software',
                'Distributed Denial of Service',
                'Data Destruction on Servers',
                'Digital Device Operating System',
            ],
            correct: 1,
        },
        {
            question: 'What is a DDoS attack similar to?',
            options: [
                'Picking a lock',
                'Flooding a highway with so many cars it stops',
                'Stealing a password',
                'Reading someone\'s email',
            ],
            correct: 1,
        },
        {
            question: 'How can you defend against DDoS?',
            options: [
                'Change your password',
                'Use rate limiting and traffic filtering',
                'Delete all files',
                'Turn off the internet',
            ],
            correct: 1,
        },
    ],
    '/lesson/sqli': [
        {
            question: 'What does SQL Injection target?',
            options: ['The user\'s keyboard', 'The database behind a website', 'The network cable', 'The CPU'],
            correct: 1,
        },
        {
            question: 'What is the main defense against SQL Injection?',
            options: [
                'Stronger passwords',
                'Parameterized queries / input validation',
                'A bigger server',
                'More RAM',
            ],
            correct: 1,
        },
        {
            question: 'Why is SQL Injection dangerous?',
            options: [
                'It can read, modify, or delete all data in the database',
                'It makes the website slower',
                'It changes the website\'s colors',
                'It only affects the attacker',
            ],
            correct: 0,
        },
    ],
    '/lesson/mitm': [
        {
            question: 'What is a Man-in-the-Middle attack?',
            options: [
                'A physical break-in',
                'Someone secretly intercepting communication between two parties',
                'A type of virus',
                'A brute force attack',
            ],
            correct: 1,
        },
        {
            question: 'Where does MITM commonly happen?',
            options: ['On encrypted networks', 'On public WiFi without encryption', 'Inside a firewall', 'On a USB drive'],
            correct: 1,
        },
        {
            question: 'What protects against MITM attacks?',
            options: ['Using HTTP', 'Using HTTPS / encrypted connections', 'Deleting cookies', 'Using a bigger monitor'],
            correct: 1,
        },
    ],
    '/lesson/bruteforce': [
        {
            question: 'What is a brute force attack?',
            options: [
                'Guessing every possible password until one works',
                'Tricking someone into giving their password',
                'Scanning for open ports',
                'Encrypting files',
            ],
            correct: 0,
        },
        {
            question: 'What makes a password resistant to brute force?',
            options: ['Using your name', 'Length and complexity', 'Writing it on a sticky note', 'Using "password123"'],
            correct: 1,
        },
        {
            question: 'What is an effective defense against brute force?',
            options: [
                'Allowing unlimited login attempts',
                'Account lockout after failed attempts + MFA',
                'Using the same password everywhere',
                'Making the login page harder to find',
            ],
            correct: 1,
        },
    ],
    '/lesson/ransomware': [
        {
            question: 'What does ransomware do?',
            options: [
                'Speeds up your computer',
                'Encrypts your files and demands payment to unlock them',
                'Installs antivirus software',
                'Scans for open ports',
            ],
            correct: 1,
        },
        {
            question: 'What is the best defense against ransomware?',
            options: [
                'Paying the ransom immediately',
                'Regular backups stored offline',
                'Using a bigger hard drive',
                'Turning off the firewall',
            ],
            correct: 1,
        },
        {
            question: 'How does ransomware typically spread?',
            options: [
                'Through Bluetooth',
                'Through phishing emails and malicious downloads',
                'Through charging cables',
                'Through social media likes',
            ],
            correct: 1,
        },
    ],
    '/lesson/social-engineering': [
        {
            question: 'What is social engineering?',
            options: [
                'Building social media platforms',
                'Manipulating people into revealing confidential information',
                'Engineering new software',
                'Setting up a network',
            ],
            correct: 1,
        },
        {
            question: 'Which tactic is commonly used in social engineering?',
            options: [
                'Creating a sense of urgency',
                'Sending encrypted files',
                'Scanning ports',
                'Installing updates',
            ],
            correct: 0,
        },
        {
            question: 'How do you defend against social engineering?',
            options: [
                'Install more RAM',
                'Security awareness training and verifying requests',
                'Use a VPN',
                'Change your wallpaper',
            ],
            correct: 1,
        },
    ],
    '/lesson/session-hijacking': [
        {
            question: 'What does session hijacking steal?',
            options: ['Your password', 'Your session cookie (your "wristband")', 'Your IP address', 'Your email'],
            correct: 1,
        },
        {
            question: 'What can an attacker do with a stolen session?',
            options: [
                'Nothing useful',
                'Impersonate you without knowing your password',
                'Only read your email subject lines',
                'Change your WiFi password',
            ],
            correct: 1,
        },
        {
            question: 'What protects sessions from hijacking?',
            options: [
                'Using HTTP everywhere',
                'HTTPS, HttpOnly cookies, and session timeouts',
                'Sharing cookies with friends',
                'Using the same session forever',
            ],
            correct: 1,
        },
    ],
    '/lesson/privesc': [
        {
            question: 'What is privilege escalation?',
            options: [
                'Getting a promotion at work',
                'Going from a low-level user to admin/root access',
                'Installing new software',
                'Connecting to WiFi',
            ],
            correct: 1,
        },
        {
            question: 'What makes privilege escalation possible?',
            options: [
                'Misconfigured permissions and weak passwords',
                'Fast internet',
                'Large hard drives',
                'Multiple monitors',
            ],
            correct: 0,
        },
        {
            question: 'How do you defend against privilege escalation?',
            options: [
                'Give everyone admin rights',
                'Least privilege principle — only give necessary access',
                'Never update software',
                'Use public WiFi',
            ],
            correct: 1,
        },
    ],
    '/lesson/gobuster': [
        {
            question: 'What does GoBuster do?',
            options: [
                'Sends phishing emails',
                'Finds hidden directories and files on a web server',
                'Cracks passwords',
                'Encrypts files',
            ],
            correct: 1,
        },
        {
            question: 'Why are hidden directories dangerous?',
            options: [
                'They slow down the server',
                'They might contain admin panels, backups, or sensitive config files',
                'They use too much disk space',
                'They make the website ugly',
            ],
            correct: 1,
        },
        {
            question: 'How do you defend against directory enumeration?',
            options: [
                'Make more directories',
                'Disable directory listing and restrict access to sensitive paths',
                'Use a faster server',
                'Add more images',
            ],
            correct: 1,
        },
    ],
    '/lesson/shells': [
        {
            question: 'Why does a reverse shell call OUT instead of IN?',
            options: [
                'Because it\'s faster',
                'Because firewalls block incoming but allow outgoing connections',
                'Because the attacker prefers it',
                'Because incoming connections don\'t exist',
            ],
            correct: 1,
        },
        {
            question: 'What can an attacker do with a reverse shell?',
            options: [
                'Only view the desktop wallpaper',
                'Run any command on the victim as if sitting at the keyboard',
                'Send emails from the victim\'s account',
                'Change the victim\'s WiFi password',
            ],
            correct: 1,
        },
        {
            question: 'How do you defend against reverse shells?',
            options: [
                'Allow all outgoing traffic',
                'Restrict outgoing connections and use EDR to detect shell spawning',
                'Turn off the server',
                'Install more RAM',
            ],
            correct: 1,
        },
    ],
    '/lesson/burp': [
        {
            question: 'What is Burp Suite used for?',
            options: [
                'Sending emails',
                'Intercepting and modifying web requests between browser and server',
                'Playing games',
                'Compressing files',
            ],
            correct: 1,
        },
        {
            question: 'Why is client-side validation alone not enough?',
            options: [
                'It\'s too slow',
                'Attackers can intercept and change the request after validation',
                'It uses too much memory',
                'It only works on mobile',
            ],
            correct: 1,
        },
        {
            question: 'How do you defend against request tampering?',
            options: [
                'Only validate on the client',
                'Always validate and enforce rules on the server side',
                'Use bigger buttons',
                'Hide the price from the user',
            ],
            correct: 1,
        },
    ],
    '/lesson/firewall': [
        {
            question: 'What is a firewall most similar to?',
            options: [
                'A lock on a single door',
                'A bouncer checking a guest list at every entrance',
                'A security camera',
                'An antivirus program',
            ],
            correct: 1,
        },
        {
            question: 'What happens to a packet that matches a DENY rule?',
            options: [
                'It gets redirected',
                'It gets blocked and cannot reach the server',
                'It gets encrypted',
                'It gets flagged but still passes through',
            ],
            correct: 1,
        },
        {
            question: 'Why is a firewall alone not enough to protect a system?',
            options: [
                'Firewalls are too expensive',
                'Attackers can use ports that are allowed (like port 80) to launch attacks',
                'Firewalls only work on Wednesdays',
                'Firewalls block all traffic by default',
            ],
            correct: 1,
        },
    ],
    '/lesson/log-analysis': [
        {
            question: 'What are server logs most similar to?',
            options: [
                'A shopping list',
                'Security camera footage for your network',
                'A video game scoreboard',
                'An email inbox',
            ],
            correct: 1,
        },
        {
            question: 'What is a sign of a port scan in server logs?',
            options: [
                'A single successful login',
                'Many rapid connection attempts to different ports from the same IP',
                'A large file download',
                'A slow website',
            ],
            correct: 1,
        },
        {
            question: 'What tool do SOC analysts use to automate log analysis?',
            options: [
                'Photoshop',
                'SIEM tools like Splunk or ELK Stack',
                'A calculator',
                'Microsoft Word',
            ],
            correct: 1,
        },
    ],
    '/lesson/crypto': [
        {
            question: 'What is the key difference between encryption and hashing?',
            options: [
                'They are the same thing',
                'Encryption is reversible, hashing is one-way',
                'Hashing is faster than encryption',
                'Encryption only works on passwords',
            ],
            correct: 1,
        },
        {
            question: 'What is a rainbow table?',
            options: [
                'A colorful spreadsheet',
                'A pre-computed table of password hashes used to crack passwords',
                'A type of firewall',
                'A network monitoring tool',
            ],
            correct: 1,
        },
        {
            question: 'How does salting defend against rainbow tables?',
            options: [
                'It makes passwords longer',
                'It adds random data before hashing, making pre-computed tables useless',
                'It encrypts the hash',
                'It blocks network access',
            ],
            correct: 1,
        },
    ],
    '/lesson/xss': [
        {
            question: 'What does XSS stand for?',
            options: [
                'Extra Secure System',
                'Cross-Site Scripting',
                'Cross-Server Exchange',
                'eXternal Script Source',
            ],
            correct: 1,
        },
        {
            question: 'What can an XSS attack do?',
            options: [
                'Only change colors on a webpage',
                'Steal cookies, redirect users, log keystrokes, and deface pages',
                'Only show alert boxes',
                'Crash the server',
            ],
            correct: 1,
        },
        {
            question: 'What is the primary defense against XSS?',
            options: [
                'Using a VPN',
                'Output encoding — converting < and > to safe characters before rendering',
                'Using a longer password',
                'Turning off JavaScript in all browsers',
            ],
            correct: 1,
        },
    ],

    '/lesson/steganography': [
        {
            question: 'What is steganography?',
            options: [
                'A type of encryption algorithm',
                'Hiding information inside innocent-looking data (like images)',
                'A malware detection technique',
                'A network scanning tool',
            ],
            correct: 1,
        },
        {
            question: 'What does LSB stand for in the context of image steganography?',
            options: [
                'Large Scale Binary',
                'Least Significant Bit — the last bit of each color value',
                'Low Security Baseline',
                'Linear Search Buffer',
            ],
            correct: 1,
        },
        {
            question: 'Which tool is commonly used to detect hidden data in images?',
            options: [
                'Nmap',
                'Wireshark',
                'steghide / zsteg / binwalk',
                'Burp Suite',
            ],
            correct: 2,
        },
    ],

    '/lesson/malware': [
        {
            question: 'What is the difference between static and dynamic malware analysis?',
            options: [
                'There is no difference',
                'Static examines code without running it; dynamic runs it in a sandbox',
                'Static uses a sandbox; dynamic reads the source code',
                'Static is faster; dynamic is slower',
            ],
            correct: 1,
        },
        {
            question: 'What are Indicators of Compromise (IOCs)?',
            options: [
                'Types of firewalls',
                'Fingerprints of malware — hashes, IPs, domains, file paths',
                'Programming languages used by hackers',
                'Operating system vulnerabilities',
            ],
            correct: 1,
        },
        {
            question: 'Why would malware use a packer like UPX?',
            options: [
                'To make the file larger',
                'To improve performance',
                'To compress/obfuscate the binary and evade static analysis',
                'To add a digital signature',
            ],
            correct: 2,
        },
    ],

    '/lesson/john': [
        {
            question: 'What is rockyou.txt?',
            options: [
                'A music playlist',
                'A list of ~14 million real leaked passwords used for dictionary attacks',
                'An encryption algorithm',
                'A Linux configuration file',
            ],
            correct: 1,
        },
        {
            question: 'Why is bcrypt more secure than MD5 for storing passwords?',
            options: [
                'bcrypt produces shorter hashes',
                'bcrypt is designed to be slow, making cracking exponentially harder',
                'bcrypt doesn\'t use salt',
                'MD5 is newer than bcrypt',
            ],
            correct: 1,
        },
        {
            question: 'What does "salting" a password mean?',
            options: [
                'Adding special characters to your password manually',
                'Adding random data to each password before hashing to prevent rainbow table attacks',
                'Encrypting the hash with a second key',
                'Storing the password in plain text with a label',
            ],
            correct: 1,
        },
    ],
}

export default quizData
