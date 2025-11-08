"use client"

interface CLMonogramAnimatedProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function CLMonogramAnimated({ size = "md", className = "" }: CLMonogramAnimatedProps) {
  const sizes = {
    sm: { container: "w-10 h-10", text: "text-xl" },
    md: { container: "w-16 h-16", text: "text-3xl" },
    lg: { container: "w-24 h-24", text: "text-5xl" },
  }

  const currentSize = sizes[size]

  return (
    <div className={`${className} flex items-center justify-center`}>
      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 
              0 0 20px rgba(212, 175, 55, 0.4),
              0 0 40px rgba(212, 175, 55, 0.2),
              inset 0 0 20px rgba(212, 175, 55, 0.1);
          }
          50% { 
            box-shadow: 
              0 0 30px rgba(212, 175, 55, 0.6),
              0 0 60px rgba(212, 175, 55, 0.3),
              inset 0 0 30px rgba(212, 175, 55, 0.2);
          }
        }
        
        @keyframes rotate-border {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .cl-monogram-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
          border: 2px solid #d4af37;
          animation: pulse-glow 3s ease-in-out infinite;
        }
        
        .cl-monogram-container::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            transparent,
            #d4af37,
            transparent 180deg,
            #4a90e2,
            transparent
          );
          animation: rotate-border 8s linear infinite;
          opacity: 0.6;
          z-index: -1;
        }
        
        .cl-text {
          font-family: var(--font-mono);
          font-weight: 900;
          letter-spacing: -0.05em;
          background: linear-gradient(135deg, #d4af37 0%, #f4e4b7 50%, #d4af37 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
        }
      `}</style>

      <div className={`cl-monogram-container ${currentSize.container}`}>
        <span className={`cl-text ${currentSize.text}`}>CL</span>
      </div>
    </div>
  )
}
