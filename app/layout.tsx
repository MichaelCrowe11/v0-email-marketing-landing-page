import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { PlatformSidebar } from "@/components/platform-sidebar"
import { PlatformHeader } from "@/components/platform-header"

export const metadata: Metadata = {
  title: "Crowe Logic - CriOS Discovery Engine",
  description: "Pharmaceutical-grade agricultural research platform",
  generator: "v0.app",
  icons: {
    icon: "/icon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable}`}>
        <SidebarProvider defaultOpen={true}>
          <PlatformSidebar />
          <SidebarInset>
            <PlatformHeader />
            <main className="flex-1">{children}</main>
          </SidebarInset>
        </SidebarProvider>
        <Analytics />
      </body>
    </html>
  )
}
