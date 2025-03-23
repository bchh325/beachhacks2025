"use client"

import React, { useState } from 'react'
import styles from './NavBar.module.css'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

export default function NavBar() {
  const [currentRoute, setCurrentRoute] = useState("dashboard")
  const router = useRouter()


  const handleRoute = (route: string) => {
    setCurrentRoute(route)
    router.push("/" + route)
  }

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.logo}>Logo</div>
        <div className={styles.buttons}>
          <Button style={{ border: "none", boxShadow: "none" }} onClick={() => { handleRoute("dashboard") }} variant={currentRoute == "dashboard" ? undefined : "outline"}>Dashboard</Button>
          <Button style={{ border: "none", boxShadow: "none" }} onClick={() => { handleRoute("productivity") }} variant={currentRoute == "productivity" ? undefined : "outline"}>Productivity</Button>
          <Button style={{ border: "none", boxShadow: "none" }} onClick={() => { handleRoute("calendar") }} variant={currentRoute == "calendar" ? undefined : "outline"}>Calendar</Button>
          <Button style={{ border: "none", boxShadow: "none" }} onClick={() => { handleRoute("insights") }} variant={currentRoute == "insights" ? undefined : "outline"}>Insights</Button>
        </div>
      </div>
      <div className={styles.bottom}>
        <div>Account stuff</div>
        <div>Account stuff</div>
        <div>Account stuff</div>
      </div>
    </div>
  )
}
