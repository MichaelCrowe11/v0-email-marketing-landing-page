"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Cloud, CloudRain, Sun, Wind, Snowflake, Command, MapPin } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserMenu } from "@/components/user-menu"
import { ThemeToggle } from "@/components/theme-toggle"

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
  const [locationPermission, setLocationPermission] = useState<"prompt" | "granted" | "denied">("prompt")

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

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
          console.log("[v0] Location access not available:", error.message)
          setLocationPermission("denied")
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
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>

      <header
        className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-xl shadow-sm"
        style={{ height: `${HEADER_HEIGHT}px` }}
        role="banner"
      >
        <div className="flex items-center justify-between h-full px-3 sm:px-4 md:px-6 max-w-screen-2xl mx-auto gap-2 sm:gap-3 md:gap-4">
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <div className="relative w-11 h-11 shrink-0 rounded-full overflow-hidden bg-background">
              <Image
                src="/crowe-logic-logo.png"
                alt="Crowe Logic"
                fill
                className="object-contain mix-blend-multiply dark:mix-blend-screen"
                priority
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-base font-bold text-foreground tracking-wide leading-tight font-mono">
                CROWE LOGIC
              </div>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground leading-tight">
                Discovery Platform
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md md:max-w-2xl" role="search">
            <div
              className={`relative flex items-center transition-all ${
                searchFocused ? "ring-2 ring-primary/30" : ""
              } rounded-lg`}
            >
              <Search
                className="absolute left-2 sm:left-3 w-4 h-4 text-muted-foreground pointer-events-none"
                aria-hidden="true"
              />
              <Input
                type="search"
                placeholder="Search datasets, analyses, strains..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="pl-8 sm:pl-10 pr-2 sm:pr-20 h-9 sm:h-10 text-sm sm:text-base bg-muted/70 border-border focus-visible:ring-primary/30 focus-visible:border-primary/50"
                aria-label="Search the platform"
              />
              <div className="absolute right-2 hidden sm:flex items-center gap-1">
                <Badge
                  variant="outline"
                  className="text-xs font-mono h-6 px-2"
                  aria-label="Keyboard shortcut: Command K"
                >
                  <Command className="w-3 h-3 mr-1" aria-hidden="true" />K
                </Badge>
              </div>
            </div>
          </form>

          {/* Weather Display */}
          {weather && (
            <div
              className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-lg bg-muted/70 border border-border/50"
              role="status"
              aria-live="polite"
            >
              {weather.needsLocation ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                  <span>Enable location for weather</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    {getWeatherIcon(weather.condition)}
                    <span className="font-semibold tabular-nums">{weather.temp}°F</span>
                  </div>
                  <div className="h-4 w-px bg-border" aria-hidden="true" />
                  <div className="text-sm text-muted-foreground">{weather.location}</div>
                </>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <nav className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-3 md:ml-4" aria-label="Quick actions">
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="hidden xl:flex h-9 px-2 sm:px-3" asChild>
              <a href="/docs">Docs</a>
            </Button>
            <Button variant="ghost" size="sm" className="hidden xl:flex h-9 px-2 sm:px-3" asChild>
              <a href="/chat">AI Chat</a>
            </Button>
            <Button variant="ghost" size="sm" className="hidden xl:flex h-9 px-2 sm:px-3" asChild>
              <a href="/consultations">Consult</a>
            </Button>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 h-9 px-2 sm:px-3 md:px-4 text-xs sm:text-sm whitespace-nowrap"
              asChild
            >
              <a href="/crowe-vision">Vision</a>
            </Button>
            <UserMenu />
          </nav>
        </div>
      </header>
    </>
  )
}
