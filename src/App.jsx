import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Home from './pages/Home'
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
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lesson/nmap" element={<LessonPage title="Nmap — Port Scanning" subtitle="Discover how hackers find open doors into systems"><NmapLesson /></LessonPage>} />
            <Route path="/lesson/phishing" element={<LessonPage title="Phishing" subtitle="How fake emails trick people into giving away their secrets"><PhishingLesson /></LessonPage>} />
            <Route path="/lesson/ddos" element={<LessonPage title="DDoS Attack" subtitle="When millions of requests bring a server to its knees"><DdosLesson /></LessonPage>} />
            <Route path="/lesson/sqli" element={<LessonPage title="SQL Injection" subtitle="How hackers trick databases into revealing their secrets"><SqliLesson /></LessonPage>} />
            <Route path="/lesson/mitm" element={<LessonPage title="Man-in-the-Middle" subtitle="When someone secretly listens to your private conversations"><MitmLesson /></LessonPage>} />
            <Route path="/lesson/bruteforce" element={<LessonPage title="Brute Force" subtitle="Trying every single key until one fits the lock"><BruteForceLesson /></LessonPage>} />
            <Route path="/lesson/ransomware" element={<LessonPage title="Ransomware" subtitle="When your files become hostages"><RansomwareLesson /></LessonPage>} />
            <Route path="/lesson/social-engineering" element={<LessonPage title="Social Engineering" subtitle="The art of hacking humans instead of computers"><SocialEngLesson /></LessonPage>} />
            <Route path="/lesson/session-hijacking" element={<LessonPage title="Session Hijacking" subtitle="When someone steals your VIP wristband"><SessionHijackLesson /></LessonPage>} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  )
}

export default App

