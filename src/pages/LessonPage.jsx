import LessonLayout from '../components/LessonLayout'

export default function LessonPage({ title, subtitle, children }) {
    return (
        <>
            {children && typeof children === 'object'
                ? children
                : <LessonLayout title={title} subtitle={subtitle}>{children}</LessonLayout>
            }
        </>
    )
}
