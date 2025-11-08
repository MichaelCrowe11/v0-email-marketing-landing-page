"use client"

export function CroweWordmark({
  variant = "full",
  className = "",
}: { variant?: "full" | "compact"; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official Crowe Logic Logo */}
      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0059-uidEXFLqOMKCV8KKSQzX49Du7xOv3w.png"
        alt="Crowe Logic"
        className="size-10 rounded-full object-cover"
        style={{
          background: "transparent",
          mixBlendMode: "multiply",
        }}
      />

      {variant === "full" && (
        <div className="flex items-baseline gap-2 font-mono">
          {/* CROWE in heavy gold */}
          <span className="text-2xl font-black tracking-[0.3em] text-[#C4A05C]">CROWE</span>

          {/* Grid separator dots */}
          <span className="text-blue-400 text-xs">••</span>

          {/* LOGIC in white */}
          <span className="text-2xl font-semibold tracking-[0.3em] text-white">LOGIC</span>
        </div>
      )}

      {variant === "compact" && (
        <div className="flex flex-col font-mono text-xs leading-tight">
          <span className="font-black tracking-[0.2em] text-[#C4A05C]">CROWE</span>
          <span className="font-semibold tracking-[0.2em] text-white">LOGIC</span>
        </div>
      )}
    </div>
  )
}
