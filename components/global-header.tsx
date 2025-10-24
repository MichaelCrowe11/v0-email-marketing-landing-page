"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Cloud, CloudRain, Sun, Wind, Snowflake, Command, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserMenu } from "@/components/user-menu"

interface WeatherData {
  temp: number | null
  condition: string
  location: string
  needsLocation?: boolean
}

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
            .catch((err) => console.error("[v0] Weather fetch failed:", err))
        },
        (error) => {
          console.error("[v0] Geolocation error:", error)
          setLocationPermission("denied")
          // Fetch weather without location (will return demo data)
          fetch("/api/weather")
            .then((res) => res.json())
            .then((data) => setWeather(data))
            .catch((err) => console.error("[v0] Weather fetch failed:", err))
        },
      )
    } else {
      // Geolocation not supported
      fetch("/api/weather")
        .then((res) => res.json())
        .then((data) => setWeather(data))
        .catch((err) => console.error("[v0] Weather fetch failed:", err))
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
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-16 px-4 md:px-6 max-w-screen-2xl mx-auto">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
          <div
            className={`relative flex items-center transition-all ${
              searchFocused ? "ring-2 ring-primary/20" : ""
            } rounded-lg`}
          >
            <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search documentation, species, SOPs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="pl-10 pr-20 h-10 bg-muted/50 border-border/50 focus-visible:ring-primary/20"
            />
            <div className="absolute right-2 flex items-center gap-1">
              <Badge variant="outline" className="text-xs font-mono h-6 px-2">
                <Command className="w-3 h-3 mr-1" />K
              </Badge>
            </div>
          </div>
        </form>

        {/* Weather Display */}
        {weather && (
          <div className="hidden md:flex items-center gap-3 ml-6 px-4 py-2 rounded-lg bg-muted/50 border border-border/50">
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
        <div className="flex items-center gap-2 ml-4">
          <Button variant="ghost" size="sm" className="hidden lg:flex" asChild>
            <a href="/docs">Docs</a>
          </Button>
          <Button variant="ghost" size="sm" className="hidden lg:flex" asChild>
            <a href="/chat">AI Chat</a>
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
            <a href="/crowe-vision">Crowe Vision</a>
          </Button>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
