"use client"

interface CroweLogic3DWordmarkProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function CroweLogic3DWordmark({ size = "md", className = "" }: CroweLogic3DWordmarkProps) {
  const sizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  }

  return (
    <div className={`crowe-logic-3d ${className}`}>
      <style jsx>{`
        .crowe-logic-3d {
          font-family: var(--font-sans);
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        
        .crowe-3d,
        .logic-3d {
          display: inline-block;
          position: relative;
          text-transform: uppercase;
          color: #d4af37; /* Gold */
          text-shadow: 
            1px 1px 0 #b8941f,
            2px 2px 0 #9c7a19,
            3px 3px 0 #806013,
            4px 4px 0 #64460d,
            5px 5px 8px rgba(0, 0, 0, 0.3);
        }
        
        .logic-3d {
          margin-left: 0.25em;
        }
        
        @media (prefers-color-scheme: dark) {
          .crowe-3d,
          .logic-3d {
            color: #f5e6c8; /* Light gold */
            text-shadow: 
              1px 1px 0 #d4af37,
              2px 2px 0 #b8941f,
              3px 3px 0 #9c7a19,
              4px 4px 0 #806013,
              5px 5px 10px rgba(0, 0, 0, 0.5);
          }
        }
      `}</style>
      <div className={sizes[size]}>
        <span className="crowe-3d">Crowe</span>
        <span className="logic-3d">Logic</span>
      </div>
    </div>
  )
}
