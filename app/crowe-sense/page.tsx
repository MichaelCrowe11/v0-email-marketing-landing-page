"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Wifi,
  Battery,
  Shield,
  Zap,
  CheckCircle2,
  ChevronRight,
  Package,
  Globe,
  Activity,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const hardwareProducts = [
  {
    id: "cs-pro",
    name: "Crowe-Sense Pro",
    tagline: "Enterprise Environmental Monitoring System",
    description:
      "Industrial-grade IoT sensor array for real-time monitoring of temperature, humidity, CO2, and air quality in cultivation facilities",
    price: "$2,499",
    image: "/iot-sensor-device-industrial-black.jpg",
    status: "In Stock",
    specs: {
      sensors: "8 sensor types",
      accuracy: "±0.1°C, ±1% RH",
      connectivity: "WiFi, Ethernet, LoRa",
      battery: "72 hour backup",
      range: "100m wireless",
      certification: "IP67 rated",
    },
    features: [
      "Real-time environmental monitoring",
      "Automated alert system",
      "Cloud data synchronization",
      "Mobile app integration",
      "Contamination risk prediction",
      "Energy usage optimization",
      "Multi-facility management",
      "API access for custom integrations",
    ],
  },
  {
    id: "cs-lite",
    name: "Crowe-Sense Lite",
    tagline: "Compact Monitoring Solution",
    description:
      "Affordable sensor system for small-scale operations with essential environmental monitoring capabilities",
    price: "$499",
    image: "/compact-sensor-device-white-minimalist.jpg",
    status: "In Stock",
    specs: {
      sensors: "4 sensor types",
      accuracy: "±0.3°C, ±2% RH",
      connectivity: "WiFi",
      battery: "24 hour backup",
      range: "50m wireless",
      certification: "IP54 rated",
    },
    features: [
      "Temperature and humidity tracking",
      "Mobile notifications",
      "Cloud dashboard",
      "Battery backup",
      "Easy installation",
      "Data export",
    ],
  },
  {
    id: "cs-vision",
    name: "Crowe-Sense Vision",
    tagline: "AI-Powered Visual Monitoring",
    description: "Smart camera system with integrated AI for automated contamination detection and growth monitoring",
    price: "$1,899",
    image: "/ai-camera-surveillance-black-professional.jpg",
    status: "Pre-Order",
    specs: {
      resolution: "4K UHD",
      fps: "60 FPS",
      ai: "Edge AI processing",
      storage: "1TB local + cloud",
      nightVision: "IR illumination",
      connectivity: "WiFi, Ethernet",
    },
    features: [
      "Real-time contamination detection",
      "Growth stage tracking",
      "Time-lapse recording",
      "Automated alerts",
      "Cloud storage",
      "Mobile viewing",
      "Integration with Contamination Classifier AI",
    ],
  },
]

export default function CroweSensePage() {
  const [selectedProduct, setSelectedProduct] = useState(hardwareProducts[0])

  return (
    <div className="min-h-screen bg-background pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Crowe-Sense Hardware</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Industrial IoT sensors and monitoring systems designed for biological cultivation environments. Real-time
            data collection, AI integration, and automated quality control.
          </p>
        </div>

        {/* Featured Product Hero */}
        <div className="enterprise-card p-8 md:p-12 mb-12 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <Badge className="mb-4 bg-secondary/20 text-secondary border-secondary/30">Featured Product</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{selectedProduct.name}</h2>
              <p className="text-xl text-muted-foreground mb-6">{selectedProduct.tagline}</p>
              <p className="text-base text-muted-foreground leading-relaxed mb-8">{selectedProduct.description}</p>

              <div className="flex items-baseline gap-4 mb-8">
                <div className="text-4xl font-bold text-foreground">{selectedProduct.price}</div>
                <Badge className="bg-secondary/20 text-secondary border-secondary/30">{selectedProduct.status}</Badge>
              </div>

              <div className="flex gap-4 mb-8">
                <Button size="lg" className="btn-primary">
                  <Package className="w-4 h-4 mr-2" />
                  Order Now
                </Button>
                <Button size="lg" variant="outline">
                  Request Demo
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(selectedProduct.specs).map(([key, value]) => (
                  <div key={key} className="p-4 bg-background/50 rounded-lg border border-border">
                    <div className="text-xs text-muted-foreground mb-1 capitalize">{key.replace(/_/g, " ")}</div>
                    <div className="text-sm font-semibold text-foreground">{value as string}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <Image
                  src={selectedProduct.image || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Product Lineup</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {hardwareProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={`enterprise-card p-6 cursor-pointer transition-all ${
                  selectedProduct.id === product.id ? "border-primary/50 shadow-lg" : "hover:border-primary/30"
                }`}
              >
                <div className="relative w-full aspect-square mb-4 bg-muted/20 rounded-lg overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                  />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{product.tagline}</p>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-foreground">{product.price}</div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="enterprise-card p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Thermometer className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Precision Sensing</h3>
              <p className="text-sm text-muted-foreground">Industrial-grade sensors with ±0.1°C accuracy</p>
            </div>

            <div className="enterprise-card p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Wifi className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Real-Time Sync</h3>
              <p className="text-sm text-muted-foreground">Instant data synchronization to cloud platform</p>
            </div>

            <div className="enterprise-card p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">AI Integration</h3>
              <p className="text-sm text-muted-foreground">Seamless connection with AI models</p>
            </div>

            <div className="enterprise-card p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Enterprise Grade</h3>
              <p className="text-sm text-muted-foreground">IP67 rated with 72-hour battery backup</p>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="enterprise-card p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Technical Specifications</h2>
          <Tabs defaultValue="sensors" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sensors">Sensors</TabsTrigger>
              <TabsTrigger value="connectivity">Connectivity</TabsTrigger>
              <TabsTrigger value="power">Power</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
            </TabsList>

            <TabsContent value="sensors" className="space-y-4 mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Thermometer className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-foreground">Temperature</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Range: -40°C to 85°C | Accuracy: ±0.1°C</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Droplets className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-foreground">Humidity</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Range: 0-100% RH | Accuracy: ±1%</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Wind className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-foreground">CO2 Levels</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Range: 0-10,000 ppm | Accuracy: ±30 ppm</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Gauge className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-foreground">Air Pressure</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Range: 300-1100 hPa | Accuracy: ±0.12 hPa</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="connectivity" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">WiFi 6 (802.11ax)</h4>
                    <p className="text-sm text-muted-foreground">Dual-band 2.4GHz and 5GHz support</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Gigabit Ethernet</h4>
                    <p className="text-sm text-muted-foreground">Wired connection for maximum reliability</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">LoRaWAN</h4>
                    <p className="text-sm text-muted-foreground">Long-range wireless for large facilities</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Bluetooth 5.2</h4>
                    <p className="text-sm text-muted-foreground">Local configuration and diagnostics</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="power" className="mt-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 bg-muted/30 rounded-lg text-center">
                  <Battery className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-foreground mb-2">72 Hours</div>
                  <p className="text-sm text-muted-foreground">Battery backup duration</p>
                </div>
                <div className="p-6 bg-muted/30 rounded-lg text-center">
                  <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-foreground mb-2">5W</div>
                  <p className="text-sm text-muted-foreground">Average power consumption</p>
                </div>
                <div className="p-6 bg-muted/30 rounded-lg text-center">
                  <Globe className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-foreground mb-2">100-240V</div>
                  <p className="text-sm text-muted-foreground">Universal power input</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="integration" className="mt-6">
              <div className="space-y-4">
                <p className="text-muted-foreground mb-6">
                  Crowe-Sense hardware integrates seamlessly with the entire Crowe Logic ecosystem:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">AI Models</h4>
                    <p className="text-sm text-muted-foreground">
                      Real-time data feeds into contamination detection and yield prediction models
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Research IDE</h4>
                    <p className="text-sm text-muted-foreground">
                      Access sensor data directly in Synapse-lang for experimental protocols
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Datasets</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically contribute to training datasets for model improvement
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">REST API</h4>
                    <p className="text-sm text-muted-foreground">
                      Full API access for custom integrations and automation
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* CTA */}
        <div className="enterprise-card p-8 md:p-12 text-center bg-gradient-to-br from-primary/5 to-secondary/5">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Ready to Deploy?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Contact our team for volume pricing, custom configurations, and enterprise deployment support.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="btn-primary" asChild>
              <Link href="/consultations">Contact Sales</Link>
            </Button>
            <Button size="lg" variant="outline">
              Download Spec Sheet
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
