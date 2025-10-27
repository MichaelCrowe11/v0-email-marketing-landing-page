"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Cloud, CloudRain, Sun, Wind, Snowflake, Command, MapPin } from "lucide-react"
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
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
          <div
            className={`relative flex items-center transition-all ${
              searchFocused ? "ring-2 ring-primary/20" : ""
            } rounded-lg`}
          >
            <Search className="absolute left-2 sm:left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="pl-8 sm:pl-10 pr-2 sm:pr-20 h-9 sm:h-10 text-sm bg-muted/50 border-border/50 focus-visible:ring-primary/20"
            />
            <div className="absolute right-2 hidden sm:flex items-center gap-1">
              <Badge variant="outline" className="text-xs font-mono h-6 px-2">
                <Command className="w-3 h-3 mr-1" />K
              </Badge>
            </div>
          </div>
        </form>

        {/* Weather Display */}
        {weather && (
          <div className="hidden lg:flex items-center gap-3 ml-6 px-4 py-2 rounded-lg bg-muted/50 border border-border/50">
            {weather.needsLocation ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Enable location for weather</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm">
                  {getWeatherIcon(weather.condition)}
                  <span className="font-semibold">{weather.temp}°F</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="text-sm text-muted-foreground">{weather.location}</div>
              </>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4">
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="hidden xl:flex h-9" asChild>
            <a href="/docs">Docs</a>
          </Button>
          <Button variant="ghost" size="sm" className="hidden xl:flex h-9" asChild>
            <a href="/chat">AI Chat</a>
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90 h-9 px-3 sm:px-4 text-xs sm:text-sm" asChild>
            <a href="/crowe-vision">Vision</a>
          </Button>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
