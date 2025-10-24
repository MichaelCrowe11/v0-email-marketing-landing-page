import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Suspense } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { GlobalHeader } from "@/components/global-header"

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

export const metadata: Metadata = {
  title: "Crowe Logic AI - Master Mushroom Growing with AI",
  description:
    "AI-powered mushroom cultivation guidance. Optimize yields, prevent contamination, and grow with confidence.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <SidebarNav />
        <div className="md:ml-64">
          <GlobalHeader />
          <Suspense fallback={null}>{children}</Suspense>
        </div>
      </body>
    </html>
  )
}
