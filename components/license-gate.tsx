"use client"

import { useState } from "react"
import Image from "next/image"

interface LicenseGateProps {
  onActivated: () => void
}

export function LicenseGate({ onActivated }: LicenseGateProps) {
  const [licenseKey, setLicenseKey] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleActivate(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/license/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey: licenseKey.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Invalid license key")
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(onActivated, 1500)
    } catch {
      setError("Connection error. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#1a1916" }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div
              className="absolute inset-0 rounded-full blur-2xl animate-pulse"
              style={{
                background: "radial-gradient(circle, rgba(61,154,154,0.3) 0%, transparent 70%)",
              }}
            />
            <Image
              src="/crowe-avatar.png"
              alt="Crowe Logic AI"
              width={80}
              height={80}
              className="relative rounded-full border-2"
              style={{ borderColor: "rgba(61,154,154,0.5)" }}
            />
          </div>
          <h1
            className="text-2xl font-bold bg-clip-text text-transparent mb-1"
            style={{ backgroundImage: "linear-gradient(135deg, #3d9a9a, #4db8b8, #d4a843)" }}
          >
            Crowe Logic AI V 1.0
          </h1>
          <p className="text-sm" style={{ color: "#6b6560" }}>
            by Michael Crowe — Mycology Intelligence
          </p>
        </div>

        {/* Activation Card */}
        <div
          className="rounded-xl border-2 p-6"
          style={{
            backgroundColor: "rgba(45,42,38,0.5)",
            borderColor: success ? "rgba(61,154,154,0.6)" : "rgba(61,154,154,0.3)",
          }}
        >
          {success ? (
            <div className="text-center py-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "rgba(61,154,154,0.2)" }}
              >
                <svg className="w-8 h-8" style={{ color: "#4db8b8" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold mb-1" style={{ color: "#f5f0e8" }}>
                License Activated
              </h2>
              <p className="text-sm" style={{ color: "#6b6560" }}>
                Welcome to CroweLM. Loading your AI assistant...
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-1" style={{ color: "#f5f0e8" }}>
                Activate Your License
              </h2>
              <p className="text-sm mb-6" style={{ color: "#6b6560" }}>
                Enter the license key from your book purchase to access CroweLM AI.
              </p>

              <form onSubmit={handleActivate}>
                <div className="mb-4">
                  <input
                    type="text"
                    value={licenseKey}
                    onChange={(e) => {
                      setLicenseKey(e.target.value.toUpperCase())
                      setError("")
                    }}
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    className="w-full px-4 py-3 rounded-lg font-mono text-sm tracking-wider text-center outline-none transition-colors"
                    style={{
                      backgroundColor: "#1a1916",
                      border: error ? "2px solid #c44" : "2px solid rgba(61,154,154,0.3)",
                      color: "#f5f0e8",
                    }}
                    onFocus={(e) => {
                      if (!error) e.target.style.borderColor = "rgba(61,154,154,0.6)"
                    }}
                    onBlur={(e) => {
                      if (!error) e.target.style.borderColor = "rgba(61,154,154,0.3)"
                    }}
                    disabled={loading}
                    autoFocus
                  />
                  {error && (
                    <p className="text-sm mt-2" style={{ color: "#c44" }}>
                      {error}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !licenseKey.trim()}
                  className="w-full py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #3d9a9a, #4db8b8, #d4a843)",
                    color: "#1a1916",
                  }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    "Activate CroweLM"
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer links */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-xs" style={{ color: "#6b6560" }}>
            Don't have a license key?{" "}
            <a
              href="https://themushroomgrower.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80 transition-opacity"
              style={{ color: "#4db8b8" }}
            >
              Get The Mushroom Grower
            </a>
          </p>
          <p className="text-xs" style={{ color: "#504b47" }}>
            by Michael Crowe / Southwest Mushrooms — 18+ years of cultivation expertise
          </p>
        </div>
      </div>
    </div>
  )
}
