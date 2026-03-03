"use client"

import type React from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(provider)
    try {
      await signIn(provider, { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("Sign in error:", error)
      setIsLoading(null)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading("email")
    setError(null)

    try {
      const response = await fetch("/api/azure/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json()

      if (result.error) {
        setError(result.error)
        setIsLoading(null)
        return
      }

      router.push("/dashboard")
    } catch {
      setError("An error occurred. Please try again.")
      setIsLoading(null)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex justify-center mb-4">
            <Image
              src="/crowe-logic-logo.png"
              alt="Crowe Logic"
              width={80}
              height={80}
              className="rounded-full shadow-lg"
            />
          </div>
          <Card className="shadow-2xl border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Welcome</CardTitle>
              <CardDescription className="text-center">
                Sign in to access Crowe Logic
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email / Password */}
              <form onSubmit={handleEmailSignIn} className="space-y-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading !== null}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading !== null}
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" size="lg" disabled={isLoading !== null}>
                  {isLoading === "email" ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or continue with</span>
                </div>
              </div>

              {/* OAuth Providers */}
              <div className="grid grid-cols-3 gap-2">
                {/* Microsoft */}
                <Button
                  onClick={() => handleOAuthSignIn("microsoft-entra-id")}
                  disabled={isLoading !== null}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <svg className="h-5 w-5" viewBox="0 0 21 21" fill="currentColor">
                    <rect x="1" y="1" width="9" height="9" />
                    <rect x="11" y="1" width="9" height="9" />
                    <rect x="1" y="11" width="9" height="9" />
                    <rect x="11" y="11" width="9" height="9" />
                  </svg>
                </Button>

                {/* GitHub */}
                <Button
                  onClick={() => handleOAuthSignIn("github")}
                  disabled={isLoading !== null}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </Button>

                {/* Google */}
                <Button
                  onClick={() => handleOAuthSignIn("google")}
                  disabled={isLoading !== null}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </Button>
              </div>

              <div className="text-center text-sm pt-2">
                Don&apos;t have an account?{" "}
                <Link href="/auth/sign-up" className="underline underline-offset-4 text-primary hover:text-primary/80">
                  Sign up
                </Link>
              </div>

              <div className="text-center text-xs text-muted-foreground">
                By signing in, you agree to our Terms of Service and Privacy Policy.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
