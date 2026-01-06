import type React from "react"
import type { Metadata, Viewport } from "next"

import "./globals.css"
import { Suspense } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { GlobalHeader } from "@/components/global-header"
import { ThemeProvider } from "@/components/theme-provider"
import { HEADER_HEIGHT } from "@/components/global-header"
import { PerformanceMonitorInit } from "@/components/performance-monitor-init"

import { Inter, Fira_Code, Geist_Mono as V0_Font_Geist_Mono, Space_Grotesk, JetBrains_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ConfirmationProvider } from "@/hooks/use-confirmation"
import { GlobalConfirmationDialog } from "@/components/global-confirmation-dialog"

// Initialize fonts
const _geistMono = V0_Font_Geist_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "sans-serif"],
  adjustFontFallback: true,
  weight: ["400", "500", "600", "700"],
})

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-code",
  display: "swap",
  preload: false,
  fallback: ["Courier New", "monospace"],
  weight: ["400", "500", "600"],
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
  weight: ["400", "500", "600", "700"],
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export const metadata: Metadata = {
  title: "Crowe Mycology by Southwest Mushrooms - AI-Powered Cultivation Platform",
  description:
    "Professional mushroom cultivation platform by Southwest Mushrooms. AI-powered contamination detection, real-time monitoring, and comprehensive growing resources.",
  generator: "v0.app",
  applicationName: "Crowe Mycology",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Crowe Mycology",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.jpg", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon.jpg", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.variable} ${firaCode.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ConfirmationProvider>
            <SidebarNav />
            <GlobalHeader />
            <div className="md:ml-64" style={{ paddingTop: `${HEADER_HEIGHT}px` }}>
              <Suspense fallback={null}>{children}</Suspense>
            </div>
            <PerformanceMonitorInit />
            <Toaster />
            <GlobalConfirmationDialog />
          </ConfirmationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
