import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import CampaignMap from './pages/CampaignMap'
import ThreatMap from './pages/ThreatMap'
import About from './pages/About'
import LessonPage from './pages/LessonPage'
import NmapLesson from './lessons/NmapLesson'
import PhishingLesson from './lessons/PhishingLesson'
import DdosLesson from './lessons/DdosLesson'
import SqliLesson from './lessons/SqliLesson'
import MitmLesson from './lessons/MitmLesson'
import BruteForceLesson from './lessons/BruteForceLesson'
import RansomwareLesson from './lessons/RansomwareLesson'
import SocialEngLesson from './lessons/SocialEngLesson'
import SessionHijackLesson from './lessons/SessionHijackLesson'
import PrivEscLesson from './lessons/PrivEscLesson'
import GoBusterLesson from './lessons/GoBusterLesson'
import ShellLesson from './lessons/ShellLesson'
import BurpLesson from './lessons/BurpLesson'
import FirewallLesson from './lessons/FirewallLesson'
import LogAnalysisLesson from './lessons/LogAnalysisLesson'
import CryptoLesson from './lessons/CryptoLesson'
import XssLesson from './lessons/XssLesson'
import SteganographyLesson from './lessons/SteganographyLesson'
import MalwareLesson from './lessons/MalwareLesson'
import JohnLesson from './lessons/JohnLesson'
import GlobalTerminal from './components/GlobalTerminal'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/campaign" element={<CampaignMap />} />
            <Route path="/threat-map" element={<ThreatMap />} />
            <Route path="/about" element={<About />} />
            <Route path="/lesson/nmap" element={<LessonPage title="Nmap — Port Scanning" subtitle="Discover how hackers find open doors into systems"><NmapLesson /></LessonPage>} />
            <Route path="/lesson/phishing" element={<LessonPage title="Phishing" subtitle="How fake emails trick people into giving away their secrets"><PhishingLesson /></LessonPage>} />
            <Route path="/lesson/ddos" element={<LessonPage title="DDoS Attack" subtitle="When millions of requests bring a server to its knees"><DdosLesson /></LessonPage>} />
            <Route path="/lesson/sqli" element={<LessonPage title="SQL Injection" subtitle="How hackers trick databases into revealing their secrets"><SqliLesson /></LessonPage>} />
            <Route path="/lesson/mitm" element={<LessonPage title="Man-in-the-Middle" subtitle="When someone secretly listens to your private conversations"><MitmLesson /></LessonPage>} />
            <Route path="/lesson/bruteforce" element={<LessonPage title="Brute Force" subtitle="Trying every single key until one fits the lock"><BruteForceLesson /></LessonPage>} />
            <Route path="/lesson/ransomware" element={<LessonPage title="Ransomware" subtitle="When your files become hostages"><RansomwareLesson /></LessonPage>} />
            <Route path="/lesson/social-engineering" element={<LessonPage title="Social Engineering" subtitle="The art of hacking humans instead of computers"><SocialEngLesson /></LessonPage>} />
            <Route path="/lesson/session-hijacking" element={<LessonPage title="Session Hijacking" subtitle="When someone steals your VIP wristband"><SessionHijackLesson /></LessonPage>} />
            <Route path="/lesson/privesc" element={<LessonPage title="Privilege Escalation" subtitle="How attackers find the master key by sneaking through the building"><PrivEscLesson /></LessonPage>} />
            <Route path="/lesson/gobuster" element={<LessonPage title="GoBuster" subtitle="Finding hidden doors that aren't on the building directory"><GoBusterLesson /></LessonPage>} />
            <Route path="/lesson/shells" element={<LessonPage title="Reverse Shell" subtitle="The phone call from inside the building"><ShellLesson /></LessonPage>} />
            <Route path="/lesson/burp" element={<LessonPage title="Burp Suite" subtitle="The courier who opens your letters"><BurpLesson /></LessonPage>} />
            <Route path="/lesson/firewall" element={<LessonPage title="Firewall Logic" subtitle="The bouncer that decides who gets in"><FirewallLesson /></LessonPage>} />
            <Route path="/lesson/log-analysis" element={<LessonPage title="Log Analysis" subtitle="The detective who reads the server's diary"><LogAnalysisLesson /></LessonPage>} />
            <Route path="/lesson/crypto" element={<LessonPage title="Cryptography" subtitle="Crack the hash — and learn why salting saves lives"><CryptoLesson /></LessonPage>} />
            <Route path="/lesson/xss" element={<LessonPage title="Cross-Site Scripting" subtitle="When the guestbook fights back"><XssLesson /></LessonPage>} />
            <Route path="/lesson/steganography" element={<LessonPage title="Steganography" subtitle="Secrets hiding in plain sight"><SteganographyLesson /></LessonPage>} />
            <Route path="/lesson/malware" element={<LessonPage title="Malware Analysis" subtitle="Dissect the virus — safely"><MalwareLesson /></LessonPage>} />
            <Route path="/lesson/john" element={<LessonPage title="John the Ripper" subtitle="Crack the hashes with rockyou.txt"><JohnLesson /></LessonPage>} />
          </Routes>
        </AnimatePresence>
        <Footer />
        <GlobalTerminal />
      </div>
    </Router>
  )
}

export default App

