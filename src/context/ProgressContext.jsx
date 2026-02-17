import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'cybersecteach_progress'
const XP_PER_LESSON = 100

const badges = [
    { id: 'first-step', label: '🐣 First Step', description: 'Complete your first lesson', threshold: 1 },
    { id: 'script-kiddie', label: '📜 Script Kiddie', description: 'Complete 3 lessons', threshold: 3 },
    { id: 'hacker', label: '💻 Hacker', description: 'Complete 7 lessons', threshold: 7 },
    { id: 'pentester', label: '🔓 Pentester', description: 'Complete 10 lessons', threshold: 10 },
    { id: 'elite', label: '👑 Elite', description: 'Complete all lessons', threshold: 20 },
    { id: 'apt-actor', label: '🎯 APT Actor', description: 'Complete a full attack chain campaign', threshold: Infinity },
    { id: 'guardian', label: '🛡️ Guardian', description: 'Complete the defensive campaign', threshold: Infinity },
]

function loadProgress() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) return JSON.parse(raw)
    } catch { }
    return { completed: [], xp: 0, completedCampaigns: [] }
}

function saveProgress(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch { }
}

const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
    const [progress, setProgress] = useState(loadProgress)

    // Persist every change
    useEffect(() => {
        saveProgress(progress)
    }, [progress])

    const completeLesson = useCallback((lessonPath) => {
        setProgress((prev) => {
            if (prev.completed.includes(lessonPath)) return prev
            return {
                ...prev,
                completed: [...prev.completed, lessonPath],
                xp: prev.xp + XP_PER_LESSON,
            }
        })
    }, [])

    const completeCampaign = useCallback((campaignId, bonusXp) => {
        setProgress((prev) => {
            const campaigns = prev.completedCampaigns || []
            if (campaigns.includes(campaignId)) return prev
            return {
                ...prev,
                completedCampaigns: [...campaigns, campaignId],
                xp: prev.xp + bonusXp,
            }
        })
    }, [])

    const isCampaignDone = useCallback(
        (campaignId) => (progress.completedCampaigns || []).includes(campaignId),
        [progress.completedCampaigns]
    )

    const isCompleted = useCallback(
        (lessonPath) => progress.completed.includes(lessonPath),
        [progress.completed]
    )

    const resetProgress = useCallback(() => {
        setProgress({ completed: [], xp: 0, completedCampaigns: [] })
    }, [])

    const campaignsDone = (progress.completedCampaigns || []).length
    const unlockedBadges = badges.filter((b) => {
        if (b.id === 'apt-actor') return campaignsDone > 0
        return progress.completed.length >= b.threshold
    })
    const nextBadge = badges.find((b) => {
        if (b.id === 'apt-actor') return campaignsDone === 0
        return progress.completed.length < b.threshold
    }) || null

    const value = {
        xp: progress.xp,
        completed: progress.completed,
        totalCompleted: progress.completed.length,
        completeLesson,
        completeCampaign,
        isCampaignDone,
        isCompleted,
        resetProgress,
        unlockedBadges,
        nextBadge,
        allBadges: badges,
        xpPerLesson: XP_PER_LESSON,
    }

    return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
    const ctx = useContext(ProgressContext)
    if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
    return ctx
}
