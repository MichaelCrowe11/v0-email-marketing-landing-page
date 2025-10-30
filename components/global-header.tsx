"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, Cloud, CloudRain, Sun, Wind, Snowflake, Command, MapPin, ChevronDown, ChevronUp, Camera, Keyboard } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserMenu } from "@/components/user-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { AccessibilitySettings } from "@/components/accessibility-settings"

interface WeatherData {
  temp: number | null
  condition: string
  location: string
  needsLocation?: boolean
}

export const HEADER_HEIGHT = 72 // px

export function GlobalHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [searchFocused, setSearchFocused] = useState(false)
  const [weatherCollapsed, setWeatherCollapsed] = useState(false)
  const [locationPermission, setLocationPermission] = useState<"prompt" | "granted" | "denied">("prompt")
  const [showShortcuts, setShowShortcuts] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission("granted")
          const { latitude, longitude } = position.coords
          fetch(`/api/weather?lat=${latitude}&lon=${longitude}`)
            .then((res) => res.json())
            .then((data) => setWeather(data))
            .catch((err) => {
              console.warn("[v0] Weather fetch failed, using default location:", err.message)
              setWeather({ temp: null, condition: "Unknown", location: "Weather unavailable", needsLocation: true })
            })
        },
        (error) => {
          // User denied location or error occurred - this is expected behavior, not an error
          console.log("[v0] Location access not available:", error.message)
          setLocationPermission("denied")
          // Fetch weather with default location
          fetch("/api/weather")
            .then((res) => res.json())
            .then((data) => setWeather({ ...data, needsLocation: true }))
            .catch((err) => {
              console.warn("[v0] Weather fetch failed:", err.message)
              setWeather({ temp: null, condition: "Unknown", location: "Weather unavailable", needsLocation: true })
            })
        },
      )
    } else {
      // Geolocation not supported - use default location
      console.log("[v0] Geolocation not supported by browser")
      fetch("/api/weather")
        .then((res) => res.json())
        .then((data) => setWeather({ ...data, needsLocation: true }))
        .catch((err) => {
          console.warn("[v0] Weather fetch failed:", err.message)
          setWeather({ temp: null, condition: "Unknown", location: "Weather unavailable", needsLocation: true })
        })
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Search shortcut (Cmd/Ctrl+K)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
      // Show keyboard shortcuts (Shift+?)
      if (e.shiftKey && e.key === "?") {
        e.preventDefault()
        setShowShortcuts(true)
      }
      // Close shortcuts dialog (Escape)
      if (e.key === "Escape" && showShortcuts) {
        setShowShortcuts(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [showShortcuts])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const getWeatherIcon = (condition: string) => {
    const lower = condition.toLowerCase()
    if (lower.includes("rain")) return <CloudRain className="w-4 h-4" />
    if (lower.includes("cloud")) return <Cloud className="w-4 h-4" />
    if (lower.includes("sun") || lower.includes("clear")) return <Sun className="w-4 h-4" />
    if (lower.includes("wind")) return <Wind className="w-4 h-4" />
    if (lower.includes("snow")) return <Snowflake className="w-4 h-4" />
    return <Cloud className="w-4 h-4" />
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-xl shadow-sm"
      style={{ height: `${HEADER_HEIGHT}px` }}
    >
      <div className="flex items-center justify-between h-full px-3 sm:px-4 md:px-6 md:pl-[272px] max-w-screen-2xl mx-auto gap-2 sm:gap-4">
        {/* Search Bar - Enhanced contrast and focus states */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
          <div
            className={`relative flex items-center transition-all ${searchFocused ? "ring-2 ring-primary/50 shadow-lg shadow-primary/10" : ""
              } rounded-lg`}
          >
            <Search className={`absolute left-2 sm:left-3 w-4 h-4 transition-colors pointer-events-none ${searchFocused ? "text-primary" : "text-muted-foreground"
              }`} />
            <Input
              ref={searchInputRef}
              type="search"
              placeholder="Search features, docs, species..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="pl-8 sm:pl-10 pr-2 sm:pr-20 h-9 sm:h-10 text-sm bg-background/80 border-border hover:border-primary/30 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all"
              aria-label="Search the platform"
              aria-describedby="search-shortcut"
            />
            <div className="absolute right-2 hidden sm:flex items-center gap-1 pointer-events-none">
              <Badge variant="outline" className="text-xs font-mono h-6 px-2 bg-muted/50" id="search-shortcut">
                <Command className="w-3 h-3 mr-1" aria-hidden="true" />K
              </Badge>
            </div>
          </div>
        </form>

        {/* Weather Display - Collapsible */}
        {weather && (
          <button
            onClick={() => setWeatherCollapsed(!weatherCollapsed)}
            className="hidden lg:flex items-center gap-3 ml-6 px-4 py-2 rounded-lg bg-muted/50 border border-border/50 hover:bg-muted/70 hover:border-border transition-all cursor-pointer"
            aria-label={weatherCollapsed ? "Expand weather widget" : "Collapse weather widget"}
            aria-expanded={!weatherCollapsed}
          >
            {weatherCollapsed ? (
              <div className="flex items-center gap-2">
                {getWeatherIcon(weather.condition)}
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>
            ) : weather.needsLocation ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Enable location for weather</span>
                <ChevronUp className="w-4 h-4" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm">
                  {getWeatherIcon(weather.condition)}
                  <span className="font-semibold">{weather.temp}°F</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="text-sm text-muted-foreground">{weather.location}</div>
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              </>
            )}
          </button>
        )}

        {/* Quick Actions - Optimized for mobile */}
        <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 px-0 hidden md:flex"
            onClick={() => setShowShortcuts(true)}
            aria-label="Show keyboard shortcuts"
            title="Keyboard shortcuts (Shift+?)"
          >
            <Keyboard className="h-4 w-4" aria-hidden="true" />
          </Button>
          <AccessibilitySettings />
          <ThemeToggle />
          {/* Hide less essential actions on mobile, show only on larger screens */}
          <Button variant="ghost" size="sm" className="hidden xl:flex h-9" asChild>
            <a href="/docs">Docs</a>
          </Button>
          <Button variant="ghost" size="sm" className="hidden lg:flex h-9" asChild>
            <a href="/chat">AI Chat</a>
          </Button>
          {/* Primary CTA - always visible with responsive sizing */}
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 h-9 px-2 sm:px-4 text-xs sm:text-sm min-w-[44px] sm:min-w-0"
            asChild
          >
            <a href="/crowe-vision" aria-label="Crowe Vision">
              <span className="hidden sm:inline">Vision</span>
              <Camera className="w-4 h-4 sm:hidden" />
            </a>
          </Button>
          <UserMenu />
        </div>
      </div>

      {/* Keyboard Shortcuts Dialog */}
      {showShortcuts && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowShortcuts(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
        >
          <div
            className="glass-card w-full max-w-2xl mx-4 p-6 rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Keyboard className="h-6 w-6 text-primary" aria-hidden="true" />
                <h2 id="shortcuts-title" className="text-2xl font-semibold">
                  Keyboard Shortcuts
                </h2>
              </div>
              <button
                onClick={() => setShowShortcuts(false)}
                className="p-2 rounded-lg hover:bg-accent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                aria-label="Close keyboard shortcuts dialog"
              >
                <Command className="h-5 w-5 rotate-45" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid gap-3">
                <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <span className="text-sm text-foreground">Open search</span>
                  <kbd className="px-3 py-1.5 text-xs font-semibold text-foreground bg-muted border border-border rounded-md shadow-sm font-mono">
                    <Command className="inline h-3 w-3 mr-1" aria-hidden="true" />K
                  </kbd>
                </div>
                <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <span className="text-sm text-foreground">Toggle theme</span>
                  <kbd className="px-3 py-1.5 text-xs font-semibold text-foreground bg-muted border border-border rounded-md shadow-sm font-mono">
                    <Command className="inline h-3 w-3 mr-1" aria-hidden="true" />T
                  </kbd>
                </div>
                <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <span className="text-sm text-foreground">Show keyboard shortcuts</span>
                  <kbd className="px-3 py-1.5 text-xs font-semibold text-foreground bg-muted border border-border rounded-md shadow-sm font-mono">
                    Shift+?
                  </kbd>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-semibold mb-2">Navigation</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Navigate through interactive elements</span>
                    <kbd className="px-2 py-1 text-xs font-mono bg-muted border border-border rounded">Tab</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Navigate backwards</span>
                    <kbd className="px-2 py-1 text-xs font-mono bg-muted border border-border rounded">Shift+Tab</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Activate focused element</span>
                    <kbd className="px-2 py-1 text-xs font-mono bg-muted border border-border rounded">Enter</kbd>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border text-center">
              <p className="text-xs text-muted-foreground">
                Press <kbd className="px-2 py-1 text-xs font-mono bg-muted border border-border rounded">Esc</kbd> to close
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
