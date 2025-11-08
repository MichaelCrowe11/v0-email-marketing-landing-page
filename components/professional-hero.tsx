"use client"

import type React from "react"

import { BarChart3, Microscope, Flag as Flask, Zap } from "lucide-react"

interface MetricProps {
  icon: React.ReactNode
  label: string
  value: string | number
}

function Metric({ icon, label, value }: MetricProps) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
      <div className="text-accent-blue">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-lg font-bold text-foreground">{value}</p>
      </div>
    </div>
  )
}

export function ProfessionalHero() {
  return (
    <section className="max-w-[1080px] mx-auto px-6 py-20">
      {/* Profile Section */}
      <div className="text-center mb-12">
        <div className="inline-block relative mb-6">
          <img
            src="/crowe-avatar.png"
            alt="Michael Crowe"
            className="w-32 h-32 rounded-full object-cover border-4 border-border"
          />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-3">Crowe Logic Platform</h1>
        <p className="text-xl text-muted-foreground max-w-[70ch] mx-auto">Advanced Mycology Intelligence</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Metric icon={<BarChart3 className="w-6 h-6" />} label="Active Research Modules" value={47} />
        <Metric icon={<Microscope className="w-6 h-6" />} label="Compounds Analyzed" value="12,847" />
        <Metric icon={<Flask className="w-6 h-6" />} label="Studies in Progress" value={23} />
        <Metric icon={<Zap className="w-6 h-6" />} label="System Status" value="Optimal" />
      </div>

      {/* Creator Credit */}
      <div className="text-center pt-8 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Created by Michael Crowe • 20+ Years Experience
          <br />
          Powered by Southwest Mushrooms
        </p>
      </div>
    </section>
  )
}
