"use client"

interface CroweLogic3DWordmarkProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function CroweLogic3DWordmark({ size = "md", className = "" }: CroweLogic3DWordmarkProps) {
  const sizes = {
    sm: "text-sm tracking-[0.3em]",
    md: "text-lg tracking-[0.35em]",
    lg: "text-2xl tracking-[0.4em]",
  }

  return (
    <div className={`crowe-logic-3d-technical ${className}`}>
      <style jsx>{`
        .crowe-logic-3d-technical {
          font-family: var(--font-mono);
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }
        
        .wordmark-container {
          display: inline-flex;
          align-items: center;
          gap: 0.5em;
        }
        
        .crowe-3d,
        .logic-3d {
          display: inline-block;
          position: relative;
          text-transform: uppercase;
          color: #d4af37; /* Gold */
          /* Grid-aligned 3D depth effect */
          text-shadow: 
            1px 1px 0 #b8941f,
            2px 2px 0 #9c7a19,
            3px 3px 0 #806013,
            4px 4px 10px rgba(0, 0, 0, 0.4);
          /* Technical grid alignment */
          letter-spacing: inherit;
        }
        
        /* Grid indicator dots for technical feel */
        .grid-dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          background: #4a90e2;
          border-radius: 50%;
          margin: 0 0.2em;
          opacity: 0.6;
        }
        
        @media (prefers-color-scheme: dark) {
          .crowe-3d,
          .logic-3d {
            color: #f5e6c8; /* Light gold */
            text-shadow: 
              1px 1px 0 #d4af37,
              2px 2px 0 #b8941f,
              3px 3px 0 #9c7a19,
              4px 4px 12px rgba(0, 0, 0, 0.6);
          }
        }
      `}</style>
      <div className={sizes[size]}>
        <div className="wordmark-container">
          <span className="crowe-3d">CROWE</span>
          <span className="grid-dot"></span>
          <span className="logic-3d">LOGIC</span>
        </div>
      </div>
    </div>
  )
}
