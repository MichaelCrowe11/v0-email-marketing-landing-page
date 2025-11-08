"use client"

interface CroweLogic3DWordmarkProps {
  size?: "sm" | "md" | "lg"
  className?: string
  showTagline?: boolean
}

export function CroweLogic3DWordmark({ size = "md", className = "", showTagline = true }: CroweLogic3DWordmarkProps) {
  const sizes = {
    sm: { word: "text-xl", tracking: "tracking-[0.3em]", tag: "text-[10px]", gap: "gap-1" },
    md: { word: "text-3xl", tracking: "tracking-[0.35em]", tag: "text-xs", gap: "gap-2" },
    lg: { word: "text-5xl", tracking: "tracking-[0.4em]", tag: "text-sm", gap: "gap-3" },
  }

  const currentSize = sizes[size]

  return (
    <div className={`flex flex-col items-center justify-center ${currentSize.gap} ${className}`}>
      <style jsx>{`
        .crowe-logic-3d-technical {
          font-family: var(--font-mono);
          font-variant-numeric: tabular-nums;
        }
        
        .wordmark-container {
          display: inline-flex;
          align-items: baseline;
          gap: 0.75rem;
        }
        
        .crowe-3d {
          display: inline-block;
          position: relative;
          text-transform: uppercase;
          font-weight: 900;
          color: #d4af37;
          text-shadow: 
            1px 1px 0 rgba(0, 0, 0, 0.3),
            2px 2px 0 rgba(0, 0, 0, 0.2),
            3px 3px 0 rgba(0, 0, 0, 0.1);
          letter-spacing: inherit;
        }
        
        .logic-3d {
          display: inline-block;
          position: relative;
          text-transform: uppercase;
          font-weight: 600;
          color: white;
          text-shadow: 
            1px 1px 0 rgba(0, 0, 0, 0.2),
            2px 2px 0 rgba(0, 0, 0, 0.15);
          letter-spacing: inherit;
        }
        
        .grid-separator {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .grid-dot {
          width: 6px;
          height: 6px;
          background: #4a90e2;
          border-radius: 50%;
        }
        
        .grid-dot-faded {
          width: 6px;
          height: 6px;
          background: #4a90e2;
          opacity: 0.5;
          border-radius: 50%;
        }
        
        .tagline {
          font-family: var(--font-mono);
          text-transform: uppercase;
          color: rgb(var(--muted-foreground) / 0.8);
        }
      `}</style>

      <div className={`crowe-logic-3d-technical ${currentSize.word} ${currentSize.tracking}`}>
        <div className="wordmark-container">
          <span className="crowe-3d">C R O W E</span>
          <div className="grid-separator">
            <div className="grid-dot"></div>
            <div className="grid-dot-faded"></div>
          </div>
          <span className="logic-3d">L O G I C</span>
        </div>
      </div>

      {showTagline && <div className={`tagline ${currentSize.tag} tracking-[0.25em] mt-1`}>CriOS Discovery Engine</div>}
    </div>
  )
}
