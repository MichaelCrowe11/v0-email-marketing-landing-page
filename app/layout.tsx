import type React from "react"
import type { Metadata, Viewport } from "next"

import "./globals.css"
import { Suspense } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { GlobalHeader } from "@/components/global-header"
import { ThemeProvider } from "@/components/theme-provider"

import { Inter, JetBrains_Mono, Fira_Code } from "next/font/google"

import { Inter, JetBrains_Mono, Fira_Code, Geist as V0_Font_Geist, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _geist = V0_Font_Geist({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"] })

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-code",
  display: "swap",
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
      <body className={`font-sans ${inter.variable} ${jetbrainsMono.variable} ${firaCode.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SidebarNav />
          <div className="md:ml-64">
            <GlobalHeader />
            <Suspense fallback={null}>{children}</Suspense>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
