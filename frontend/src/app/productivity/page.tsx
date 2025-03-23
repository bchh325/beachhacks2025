"use client"

import React, { useState, useEffect } from "react";
import styles from "./page.module.css"
import { Button } from "@/components/ui/button"
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ProductivityAssignment from "@/components/ProductivityAssignment/ProductivityAssignment";

const page = () => {
  const initialTime = 300;
  const [remainingTime, setRemainingTime] = useState(initialTime);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    let interval: any

    if (!isPaused) {
      interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      console.log("clearing interval")
      return () => clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval); // Clean up interval on unmount
      }
    };
  }, [isPaused]);

  useEffect(() => {
    const progressValue = (remainingTime / initialTime) * 100;
    setProgress(progressValue);
  }, [remainingTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const toggleTimer = () => {
    console.log("toggling")
    setIsPaused(prev => !prev)
  }

  return (
    <div className={`${styles.container}`}>
      <div>
        <div className={styles.header}>Header</div>
        <div className={styles.content}>
          <div className={styles.first}>
            <div className={styles.left}>
              <div className={styles.headerinner}>Pomodo Timer</div>
              <div className={styles.timer}>
                <div className={styles.timerInner}>
                  <CircularProgressbar
                    value={progress}
                    text={formatTime(remainingTime)}
                  />
                </div>
              </div>
              <div className={styles.breaks}>
                <Button style={{ width: "25%" }} variant="outline">Pomodoro</Button>
                <Button style={{ width: "25%" }} variant="ghost">Short Break</Button>
                <Button style={{ width: "25%" }} variant="ghost">Long Break</Button>
              </div>
              <div className={styles.startreset}>
                {isPaused ? <Button onClick={toggleTimer}>Start</Button> : <Button variant="outline" onClick={toggleTimer}>Pause</Button>}

              </div>
              <div className={styles.sessions}>Sessions Completed</div>
            </div>
          </div>
          <div className={styles.second}>
            <div className={styles.right}>
             <ProductivityAssignment />
             <ProductivityAssignment />
             <ProductivityAssignment />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
