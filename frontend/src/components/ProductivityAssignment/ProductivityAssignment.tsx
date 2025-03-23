import React, { useState } from 'react'
import styles from './styles.module.css'
import { Button } from "@/components/ui/button"

export default function ProductivityAssignment() {
    const [isActive, setIsActive] = useState(false)

    const toggleElapsedTime = () => {
        setIsActive(prev => !prev)
        console.log("toggling")
    }

    return (
        <div className={styles.assignmentContainer}>
            <div className={styles.assignmentLeft}>
                <div>
                    <div className={styles.assignmentTitle}>Asssignment Title</div>
                    <div>Course Title</div>
                </div>
                <div>
                    <div>Started</div>
                    <div>Duration</div>
                    <div>Status</div>
                </div>
            </div>
            <div className={styles.assignmentRight}>
                <div>
                    <Button onClick={toggleElapsedTime}>Start/Stop</Button>
                </div>
                <div>
                    <Button>Mark as Completed</Button>
                </div>
            </div>
        </div>
    )
}
