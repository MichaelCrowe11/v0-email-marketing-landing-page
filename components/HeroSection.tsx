"use client"

import Image from "next/image"
import Link from "next/link"
import React from "react"

export const HeroSection: React.FC = () => {
  return (
    <section className="hero-section" aria-labelledby="platform-title">
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <Image
            src="/crowe-avatar.png"
            alt="Michael Crowe"
            width={120}
            height={120}
            className="profile-photo"
            priority
          />

          <h1 id="platform-title" className="platform-title">Crowe Logic Platform</h1>
          <p className="platform-subtitle" style={{ color: "var(--text-secondary)" }}>Advanced Mycology Intelligence</p>

          <div className="metrics-grid" role="list" aria-label="Key platform metrics">
            <Metric label="Active Research Modules" value={47} />
            <Metric label="Compounds Analyzed" value="12,847" />
            <Metric label="Studies in Progress" value={23} />
            <Metric label="System Status" value="Optimal" />
          </div>

          <div className="creator-credit">
            Created by Michael Crowe • 20+ Years Experience
            <br />
            Powered by Southwest Mushrooms
          </div>

          <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
            <Link href="/pricing" className="card-button primary">Get Started</Link>
            <Link href="/contact" className="card-button">Contact Sales</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

interface MetricProps {
  label: string
  value: number | string
}

function Metric({ label, value }: MetricProps) {
  return (
    <div className="metric-card" role="figure" aria-label={label}>
      <div className="metric-label" aria-hidden="true">{label}</div>
      <div className="metric-value" aria-live="polite">{value}</div>
    </div>
  )
}
