import { motion, AnimatePresence } from 'framer-motion'
import styles from './StepExplainer.module.css'

export default function StepExplainer({ steps, currentStep }) {
    const progress = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0

    return (
        <div className={styles.container}>
            {steps.map((step, index) => {
                const isActive = index === currentStep
                const isCompleted = index < currentStep
                const stepClass = `${styles.step} ${isActive ? styles.stepActive : ''} ${isCompleted ? styles.stepCompleted : ''}`

                return (
                    <motion.div
                        key={index}
                        className={stepClass}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className={styles.stepHeader}>
                            <span className={styles.stepNumber}>
                                {isCompleted ? '✓' : index + 1}
                            </span>
                            <span className={styles.stepTitle}>{step.title}</span>
                        </div>
                        <AnimatePresence>
                            {(isActive || isCompleted) && (
                                <motion.p
                                    className={styles.stepDescription}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    {step.description}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )
            })}
            <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
        </div>
    )
}
