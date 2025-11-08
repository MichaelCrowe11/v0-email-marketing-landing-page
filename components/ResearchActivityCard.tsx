"use client"

import React from "react"
import Link from "next/link"

export interface ResearchActivityCardProps {
  title: string
  status: "active" | "paused" | "error" | "completed"
  progress?: number
  eta?: string
  items?: string[]
  cta?: { label: string; href: string }
  onPrimary?: () => void
  onSecondary?: () => void
}

const statusLabels: Record<string, string> = {
  active: "Active",
  paused: "Paused",
  error: "Error",
  completed: "Completed"
}

export function ResearchActivityCard({
  title,
  status,
  progress = 0,
  eta,
  items = [],
  cta,
  onPrimary,
  onSecondary
}: ResearchActivityCardProps) {
  const clamped = Math.min(100, Math.max(0, Number(progress || 0)))

  return (
    <article className="research-card" aria-labelledby={title.replace(/\s+/g, "-") + "-heading"}>
      <header className="research-card-header">
        <h3 id={title.replace(/\s+/g, "-") + "-heading"} className="research-card-title">{title}</h3>
        <span className="status-badge" data-status={status}>
          <StatusIcon status={status} /> {statusLabels[status]}
        </span>
      </header>
      <div className="progress-wrap" aria-label="Progress" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-bar" style={{ width: clamped + "%" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--small-size)", color: "var(--text-tertiary)" }}>
        <span>{clamped}%</span>
        {eta && <span>ETA: {eta}</span>}
      </div>
      {items.length > 0 && (
        <ul className="research-list" aria-label="Recent outputs">
          {items.slice(0, 5).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
      <div className="card-actions">
        {cta && (
          <Link href={cta.href} className="card-button primary" aria-label={cta.label}>{cta.label} →</Link>
        )}
        {status === "paused" && (
          <button className="card-button" onClick={onPrimary} aria-label="Resume processing">Resume</button>
        )}
        {status === "error" && (
          <button className="card-button" onClick={onSecondary} aria-label="Retry task">Retry</button>
        )}
      </div>
    </article>
  )
}

function StatusIcon({ status }: { status: string }) {
  const size = 8
  const colorMap: Record<string, string> = {
    active: "var(--success)",
    paused: "var(--warning)",
    error: "var(--error)",
    completed: "var(--success)"
  }
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: colorMap[status] || "var(--text-tertiary)"
      }}
    />
  )
}

export default ResearchActivityCard
