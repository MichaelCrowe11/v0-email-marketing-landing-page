import type React from "react"
import type { Metadata, Viewport } from "next"

import "./globals.css"
import { Suspense } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { GlobalHeader } from "@/components/global-header"
import { ThemeProvider } from "@/components/theme-provider"
import { HEADER_HEIGHT } from "@/components/global-header"
import { PerformanceMonitorInit } from "@/components/performance-monitor-init"

import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

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
  title: "Crowe Logic AI - Master Mushroom Growing with AI",
  description:
    "AI-powered mushroom cultivation guidance. Optimize yields, prevent contamination, and grow with confidence.",
  generator: "v0.app",
  applicationName: "Crowe Logic AI",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Crowe Logic AI",
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
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SidebarNav />
          <GlobalHeader />
          <div className="md:ml-64" style={{ paddingTop: `${HEADER_HEIGHT}px` }}>
            <Suspense fallback={null}>{children}</Suspense>
          </div>
          <PerformanceMonitorInit />
        </ThemeProvider>
      </body>
    </html>
  )
}
