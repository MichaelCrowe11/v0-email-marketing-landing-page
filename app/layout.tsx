import type React from "react"
import type { Metadata, Viewport } from "next"

import "./globals.css"
import { Suspense } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { GlobalHeader } from "@/components/global-header"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/components/providers/session-provider"
import { HEADER_HEIGHT } from "@/lib/layout-constants"
import { PerformanceMonitorInit } from "@/components/performance-monitor-init"

import { IBM_Plex_Sans, Fira_Code, Geist_Mono as V0_Font_Geist_Mono, Space_Grotesk, JetBrains_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ConfirmationProvider } from "@/hooks/use-confirmation"
import { ShopifyProvider } from "@/hooks/use-shopify"
import { GlobalConfirmationDialog } from "@/components/global-confirmation-dialog"

// Initialize fonts
const _geistMono = V0_Font_Geist_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "sans-serif"],
  adjustFontFallback: true,
  weight: ["300", "400", "500", "600", "700"],
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
  metadataBase: new URL("https://ai.southwestmushrooms.com"),
  title: "Crowe Logic AI by Michael Crowe — AI-Powered Mushroom Cultivation Platform",
  description:
    "Professional mushroom cultivation platform by Michael Crowe of Southwest Mushrooms. AI-powered contamination detection, real-time monitoring, and comprehensive growing resources built on 18+ years of commercial cultivation expertise.",
  applicationName: "Crowe Logic AI",
  authors: [{ name: "Michael Crowe", url: "https://southwestmushrooms.com" }],
  creator: "Michael Crowe",
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
      { url: "/icon.jpg", type: "image/jpeg", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon.jpg", sizes: "180x180", type: "image/jpeg" }],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ai.southwestmushrooms.com",
    siteName: "Crowe Logic AI",
    title: "Crowe Logic AI by Michael Crowe",
    description:
      "AI-powered mushroom cultivation platform built on 18+ years of commercial expertise. Contamination detection, species identification, and growing intelligence by Michael Crowe of Southwest Mushrooms.",
    images: [
      {
        url: "/crowe-logic-logo.png",
        width: 512,
        height: 512,
        alt: "Crowe Logic AI",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Crowe Logic AI by Michael Crowe",
    description:
      "AI-powered mushroom cultivation platform — 18+ years of expertise from Southwest Mushrooms.",
    images: ["/crowe-logic-logo.png"],
  },
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
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" />
      </head>
      <body
        className={`${ibmPlexSans.variable} ${firaCode.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <ShopifyProvider>
            <ConfirmationProvider>
              <SidebarNav />
              <GlobalHeader />
              <div className="md:ml-60" style={{ paddingTop: `${HEADER_HEIGHT}px` }}>
                <Suspense fallback={null}>{children}</Suspense>
              </div>
              <PerformanceMonitorInit />
              <Toaster />
              <GlobalConfirmationDialog />
            </ConfirmationProvider>
            </ShopifyProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
