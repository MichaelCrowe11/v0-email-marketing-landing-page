import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="relative inline-block">
          <img
            src="/crowe-avatar.png"
            alt="Crowe Logic AI"
            className="w-20 h-20 rounded-full ring-4 ring-primary/30 mx-auto"
          />
        </div>
        <h1 className="text-6xl font-black text-foreground">404</h1>
        <h2 className="text-xl font-semibold text-foreground">Page Not Found</h2>
        <p className="text-muted-foreground">
          This spore didn't land on a viable substrate. The page you're looking for doesn't exist.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/chat"
            className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition-colors"
          >
            Chat with AI
          </Link>
        </div>
      </div>
    </div>
  )
}
