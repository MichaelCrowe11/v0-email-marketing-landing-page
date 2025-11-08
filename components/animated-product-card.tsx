"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface AnimatedProductCardProps {
  taskType?: string
  productName: string
}

export function AnimatedProductCard({ taskType = "analyzing-data", productName }: AnimatedProductCardProps) {
  const [displayLines, setDisplayLines] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [currentMetric, setCurrentMetric] = useState(0)

  const getTaskContent = () => {
    switch (taskType) {
      case "analyzing-data":
        return {
          type: "code",
          title: "species-analyzer.ts",
          lines: [
            "const dna = await sequenceMushroom()",
            "const species = identifySpecies(dna)",
            "if (species.confidence > 0.95) {",
            "  return optimizeGrowth(species)",
            "}",
          ],
        }
      case "monitoring-growth":
        return {
          type: "terminal",
          title: "Spawn Monitor",
          lines: [
            "$ Monitoring colonization progress...",
            "✓ Temperature: 75°F (optimal)",
            "✓ Humidity: 95% (optimal)",
            "✓ Colonization: 87% complete",
            "⚡ Estimated completion: 2.3 days",
          ],
        }
      case "mixing-substrate":
        return {
          type: "terminal",
          title: "Substrate Mixer",
          lines: [
            "$ Calculating optimal substrate mix...",
            "✓ Hardwood sawdust: 50%",
            "✓ Wheat bran: 20%",
            "✓ Gypsum: 5%",
            "✓ Water content: 65%",
            "⚡ Mixing protocol ready",
          ],
        }
      case "sterile-inoculation":
        return {
          type: "terminal",
          title: "Inoculation Protocol",
          lines: [
            "$ Preparing sterile environment...",
            "✓ HEPA filtration: Active",
            "✓ UV sterilization: Complete",
            '✓ Pressure differential: +0.05"',
            "✓ Ready for inoculation",
            "⚡ Success rate: 99.2%",
          ],
        }
      case "orchestrating-systems":
        return {
          type: "code",
          title: "system-orchestrator.ts",
          lines: [
            "const modules = await loadAllModules()",
            "modules.forEach(m => m.initialize())",
            "const pipeline = createPipeline([",
            "  spawnMaster, substrateTech,",
            "  inoculationAI, qualityControl",
            "])",
            "return pipeline.execute()",
          ],
        }
      case "command-center":
        return {
          type: "terminal",
          title: "Command Center",
          lines: [
            "$ Initializing command center...",
            "✓ All 4 AI modules online",
            "✓ Real-time monitoring active",
            "✓ Predictive analytics running",
            "✓ 24/7 support connected",
            "⚡ System status: Optimal",
          ],
        }
      case "conducting-research":
        return {
          type: "code",
          title: "research-lab.ts",
          lines: [
            "const experiment = new Experiment({",
            "  species: 'Pleurotus ostreatus',",
            "  variables: ['temp', 'humidity'],",
            "  replicates: 10",
            "})",
            "await experiment.run()",
            "return experiment.analyze()",
          ],
        }
      case "providing-support":
        return {
          type: "terminal",
          title: "Support System",
          lines: [
            "$ Support ticket #1247 received",
            "✓ AI analysis complete",
            "✓ Solution identified",
            "✓ Knowledge base updated",
            "✓ Response sent",
            "⚡ Resolution time: 4.2 min",
          ],
        }
      case "managing-facility":
        return {
          type: "terminal",
          title: "Facility Manager",
          lines: [
            "$ Managing facility operations...",
            "✓ Production: 2,450 lbs/week",
            "✓ Inventory: 98% accuracy",
            "✓ Staff: 12 scheduled",
            "✓ Orders: 47 pending",
            "⚡ Efficiency: 94%",
          ],
        }
      case "lifetime-access":
        return {
          type: "code",
          title: "license-manager.ts",
          lines: [
            "const license = {",
            "  type: 'LIFETIME',",
            "  updates: 'UNLIMITED',",
            "  support: 'PRIORITY',",
            "  expires: null",
            "}",
            "return activateLicense(license)",
          ],
        }
      case "pilot-license":
        return {
          type: "terminal",
          title: "Pilot Program",
          lines: [
            "$ Activating pilot license...",
            "✓ Region: Canada",
            "✓ Compliance: Verified",
            "✓ Features: Full access",
            "✓ Feedback channel: Open",
            "⚡ Status: Active",
          ],
        }
      case "consulting-meeting":
        return {
          type: "terminal",
          title: "Advisory Session",
          lines: [
            "$ Preparing advisory session...",
            "✓ Facility data analyzed",
            "✓ Growth opportunities identified",
            "✓ Action items generated",
            "✓ Meeting scheduled",
            "⚡ ROI projection: +32%",
          ],
        }
      case "writing-business-plan":
        return {
          type: "code",
          title: "business-plan.ts",
          lines: [
            "const plan = {",
            "  market: analyzeMarket(),",
            "  financials: projectRevenue(),",
            "  strategy: defineStrategy(),",
            "  timeline: createRoadmap()",
            "}",
            "return generatePlan(plan)",
          ],
        }
      case "presenting-case-studies":
        return {
          type: "terminal",
          title: "Case Study Analysis",
          lines: [
            "$ Analyzing Southwest Mushrooms...",
            "✓ Revenue growth: 340%",
            "✓ Efficiency gains: 67%",
            "✓ Market expansion: 5 states",
            "✓ Lessons documented",
            "⚡ Success factors: 12",
          ],
        }
      case "reading-digital-book":
        return {
          type: "terminal",
          title: "Digital Reader",
          lines: [
            "$ Loading Journey Into Mycology...",
            "✓ 300+ pages loaded",
            "✓ Full-color images: 150+",
            "✓ Chapters: 12",
            "✓ Bookmarks synced",
            "⚡ Progress: Chapter 3",
          ],
        }
      case "listening-audio":
        return {
          type: "terminal",
          title: "Audio Player",
          lines: [
            "$ Playing audiobook...",
            "♪ Chapter 5: Substrate Preparation",
            "✓ Duration: 10h 23m",
            "✓ Speed: 1.25x",
            "✓ Bookmarks: 7",
            "⚡ Time remaining: 6h 12m",
          ],
        }
      case "mindset-strategies":
        return {
          type: "code",
          title: "mindset-framework.ts",
          lines: [
            "const mindset = {",
            "  growth: cultivateResilience(),",
            "  problem_solving: embraceChallenges(),",
            "  success: defineVision()",
            "}",
            "return transformMindset(mindset)",
          ],
        }
      case "quickstart-guide":
        return {
          type: "terminal",
          title: "Quick Start",
          lines: [
            "$ Initializing quick start...",
            "✓ Step 1: Equipment ready",
            "✓ Step 2: Substrate prepared",
            "✓ Step 3: Inoculation complete",
            "✓ Step 4: Monitoring active",
            "⚡ First harvest: 21 days",
          ],
        }
      case "cultivation-protocol":
        return {
          type: "code",
          title: "lions-mane-protocol.ts",
          lines: [
            "const protocol = {",
            "  substrate: 'hardwood_sawdust',",
            "  temp: { min: 65, max: 75 },",
            "  humidity: { target: 95 },",
            "  co2: { max: 800 }",
            "}",
            "return executeCultivation(protocol)",
          ],
        }
      case "qc-procedures":
        return {
          type: "terminal",
          title: "Quality Control",
          lines: [
            "$ Running QC procedures...",
            "✓ Visual inspection: Pass",
            "✓ Weight verification: Pass",
            "✓ Contamination test: Pass",
            "✓ Documentation: Complete",
            "⚡ Batch approved",
          ],
        }
      case "sanitation-schedule":
        return {
          type: "terminal",
          title: "Sanitation Manager",
          lines: [
            "$ Today's sanitation tasks...",
            "✓ 06:00 - Pre-shift cleaning",
            "✓ 12:00 - Mid-day sanitize",
            "✓ 18:00 - End-of-day deep clean",
            "✓ 22:00 - UV sterilization",
            "⚡ Compliance: 100%",
          ],
        }
      case "handling-sops":
        return {
          type: "terminal",
          title: "Post-Harvest SOP",
          lines: [
            "$ Post-harvest protocol active...",
            "✓ Harvest timing: Optimal",
            "✓ Handling: Gentle",
            "✓ Packaging: Food-grade",
            "✓ Storage: 34°F",
            "⚡ Shelf life: 14 days",
          ],
        }
      case "qc-checklist":
        return {
          type: "terminal",
          title: "Daily QC Checklist",
          lines: [
            "$ Daily checklist for 2025-01-22",
            "☐ Morning inspection",
            "☐ Temperature logs",
            "☐ Humidity verification",
            "☐ Contamination check",
            "☐ Sign-off required",
          ],
        }
      case "substrate-guide":
        return {
          type: "code",
          title: "sawdust-blocks.ts",
          lines: [
            "const recipe = {",
            "  hardwood_sawdust: 5000, // grams",
            "  wheat_bran: 1000,",
            "  gypsum: 250,",
            "  water: calculateWater(65)",
            "}",
            "return mixAndBag(recipe)",
          ],
        }
      case "emergency-response":
        return {
          type: "terminal",
          title: "Emergency Response",
          lines: [
            "⚠ CONTAMINATION DETECTED",
            "$ Initiating emergency protocol...",
            "✓ Affected area isolated",
            "✓ Root cause identified",
            "✓ Corrective action deployed",
            "✓ Prevention measures updated",
            "⚡ Incident resolved",
          ],
        }
      default:
        return {
          type: "code",
          title: "mycology-ai.ts",
          lines: [
            "const ai = new CroweLogicAI()",
            "await ai.initialize()",
            "const result = await ai.process()",
            "return result",
          ],
        }
    }
  }

  useEffect(() => {
    const content = getTaskContent()
    let lineIndex = 0

    const interval = setInterval(() => {
      if (lineIndex < content.lines.length) {
        setDisplayLines((prev) => [...prev, content.lines[lineIndex]])
        lineIndex++
      } else {
        setDisplayLines([])
        lineIndex = 0
      }
    }, 1000)

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 5))
    }, 150)

    const metricInterval = setInterval(() => {
      setCurrentMetric((prev) => (prev >= 99 ? 0 : prev + 1))
    }, 100)

    return () => {
      clearInterval(interval)
      clearInterval(progressInterval)
      clearInterval(metricInterval)
    }
  }, [taskType])

  const content = getTaskContent()

  return (
    <div className="relative w-full h-48 bg-gradient-to-br from-background via-accent/5 to-background overflow-hidden group">
      {/* Main content area */}
      <div className="absolute inset-0 p-4 overflow-hidden">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 h-full border border-accent/20">
          {/* Window header */}
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-accent/20">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-accent ml-2">{content.title}</span>
            <div className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>

          {/* Content */}
          <div className="font-mono text-xs space-y-1 h-[calc(100%-3rem)] overflow-hidden">
            {content.type === "code" ? (
              <>
                {displayLines.map((line, i) => (
                  <div key={i} className="flex gap-2 animate-fade-in">
                    <span className="text-accent/40">{i + 1}</span>
                    <span className="text-green-400">{line}</span>
                  </div>
                ))}
                <div className="flex gap-2">
                  <span className="text-accent/40">{displayLines.length + 1}</span>
                  <span className="text-accent animate-pulse">▊</span>
                </div>
              </>
            ) : (
              <>
                {displayLines.map((line, i) => (
                  <div
                    key={i}
                    className={`animate-fade-in ${
                      line?.startsWith("✓")
                        ? "text-green-400"
                        : line?.startsWith("⚡")
                          ? "text-blue-400"
                          : line?.startsWith("⚠")
                            ? "text-yellow-400"
                            : line?.startsWith("♪")
                              ? "text-purple-400"
                              : line?.startsWith("☐")
                                ? "text-accent/60"
                                : "text-foreground"
                    }`}
                  >
                    {line}
                  </div>
                ))}
                <div className="text-accent animate-pulse">▊</div>
              </>
            )}
          </div>

          {/* Progress indicator */}
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex justify-between text-[10px] text-accent/60 mb-1">
              <span>Processing</span>
              <span>{currentMetric}%</span>
            </div>
            <div className="h-1 bg-accent/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-green-500 transition-all duration-200"
                style={{ width: `${currentMetric}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Crowe Logic Logo in corner */}
      <div className="absolute top-2 left-2 z-20">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 bg-accent/20 rounded-full blur-lg animate-pulse" />
          <Image
            src="/crowe-logic-logo.png"
            alt={productName}
            width={48}
            height={48}
            className="relative z-10 rounded-full"
          />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
        </div>
      </div>
    </div>
  )
}
