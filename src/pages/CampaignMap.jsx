import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useProgress } from '../context/ProgressContext'
import campaigns from '../data/campaignData'
import './CampaignMap.css'

export default function CampaignMap() {
    const [campaignIdx, setCampaignIdx] = useState(0)
    const campaign = campaigns[campaignIdx]
    const { isCompleted, completeCampaign, isCampaignDone } = useProgress()
    const navigate = useNavigate()
    const [selectedMission, setSelectedMission] = useState(null)

    const campaignDone = isCampaignDone(campaign.id)

    // Determine which missions are unlocked
    const missionStates = campaign.missions.map((m, i) => {
        const done = isCompleted(m.lessonPath)
        const prevDone = i === 0 ? true : isCompleted(campaign.missions[i - 1].lessonPath)
        const unlocked = prevDone
        const active = unlocked && !done
        return { ...m, done, unlocked, active }
    })

    const completedCount = missionStates.filter((m) => m.done).length
    const allDone = completedCount === campaign.missions.length

    // Award campaign bonus when all missions complete
    if (allDone && !campaignDone) {
        completeCampaign(campaign.id, campaign.xpBonus)
    }

    return (
        <motion.div
            className="cm-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Campaign Selector Tabs */}
            {campaigns.length > 1 && (
                <div className="cm-tabs">
                    {campaigns.map((c, i) => (
                        <button
                            key={c.id}
                            className={`cm-tab ${i === campaignIdx ? 'cm-tab-active' : ''}`}
                            style={{ '--tab-color': c.color }}
                            onClick={() => { setCampaignIdx(i); setSelectedMission(null); }}
                        >
                            <span className="cm-tab-icon">{c.icon}</span>
                            <span className="cm-tab-label">{c.title}</span>
                            {isCampaignDone(c.id) && <span className="cm-tab-done">✅</span>}
                        </button>
                    ))}
                </div>
            )}

            <div className="cm-header">
                <Link to="/" className="cm-back">← Back to lessons</Link>
                <div className="cm-header-content">
                    <span className="cm-icon">{campaign.icon}</span>
                    <div>
                        <h1 className="cm-title">{campaign.title}</h1>
                        <p className="cm-subtitle">{campaign.subtitle}</p>
                    </div>
                </div>
                <div className="cm-progress-row">
                    <div className="cm-progress-bar">
                        <motion.div
                            className="cm-progress-fill"
                            style={{ background: campaign.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(completedCount / campaign.missions.length) * 100}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                    </div>
                    <span className="cm-progress-label">
                        {completedCount}/{campaign.missions.length} missions
                    </span>
                </div>
            </div>

            {/* Kill chain timeline */}
            <div className="cm-timeline">
                {missionStates.map((mission, i) => (
                    <div key={mission.id} className="cm-mission-wrapper">
                        {/* Connector line */}
                        {i > 0 && (
                            <div className={`cm-connector ${mission.unlocked ? 'cm-connector-active' : ''}`}>
                                <div className="cm-connector-line" />
                                <span className="cm-connector-arrow">▼</span>
                            </div>
                        )}

                        {/* Mission node */}
                        <motion.button
                            className={`cm-node ${mission.done ? 'cm-node-done' : mission.active ? 'cm-node-active' : mission.unlocked ? 'cm-node-unlocked' : 'cm-node-locked'}`}
                            style={{ '--campaign-color': campaign.color }}
                            onClick={() => mission.unlocked && setSelectedMission(mission)}
                            disabled={!mission.unlocked}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.12 }}
                            whileHover={mission.unlocked ? { scale: 1.03 } : {}}
                        >
                            <div className="cm-node-header">
                                <span className="cm-node-phase">{mission.phase}</span>
                                {mission.done && <span className="cm-node-check">✅</span>}
                                {!mission.unlocked && <span className="cm-node-lock">🔒</span>}
                            </div>
                            <div className="cm-node-icon">{mission.icon}</div>
                            <h3 className="cm-node-title">{mission.title}</h3>
                            <p className="cm-node-desc">{mission.description}</p>
                            {mission.active && (
                                <span className="cm-node-cta">▶ Start Mission</span>
                            )}
                            {mission.done && (
                                <span className="cm-node-status">Mission Complete</span>
                            )}
                        </motion.button>
                    </div>
                ))}
            </div>

            {/* Mission briefing modal */}
            <AnimatePresence>
                {selectedMission && (
                    <motion.div
                        className="cm-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedMission(null)}
                    >
                        <motion.div
                            className="cm-briefing"
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="cm-briefing-header">
                                <span className="cm-briefing-phase">{selectedMission.phase}</span>
                                <button className="cm-briefing-close" onClick={() => setSelectedMission(null)}>✕</button>
                            </div>
                            <div className="cm-briefing-icon">{selectedMission.icon}</div>
                            <h2 className="cm-briefing-title">{selectedMission.title}</h2>
                            <div className="cm-briefing-text">
                                <div className="cm-briefing-label">📋 Mission Briefing</div>
                                <p>{selectedMission.briefing}</p>
                            </div>
                            {selectedMission.done ? (
                                <div className="cm-briefing-done">✅ Mission accomplished</div>
                            ) : (
                                <button
                                    className="cm-briefing-go"
                                    style={{ background: campaign.color }}
                                    onClick={() => navigate(selectedMission.lessonPath)}
                                >
                                    ▶ Launch Mission
                                </button>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Campaign complete celebration */}
            {allDone && (
                <motion.div
                    className="cm-complete"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{ borderColor: campaign.color }}
                >
                    <div className="cm-complete-icon">{campaign.badge.label.split(' ')[0]}</div>
                    <h2 className="cm-complete-title">Campaign Complete!</h2>
                    <p className="cm-complete-text">
                        {campaign.id === 'corporate-breach'
                            ? 'You successfully executed a full attack chain — from reconnaissance to impact.'
                            : 'You successfully defended the network — firewall configured, intruder found, and phishing understood.'}
                        {!campaignDone ? ` +${campaign.xpBonus} bonus XP earned!` : ''}
                    </p>
                    <div className="cm-complete-badge" style={{ borderColor: campaign.color, color: campaign.color }}>
                        {campaign.badge.label} Badge Unlocked
                    </div>
                </motion.div>
            )}
        </motion.div>
    )
}
