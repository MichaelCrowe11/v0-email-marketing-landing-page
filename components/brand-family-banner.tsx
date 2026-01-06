"use client"

import Image from "next/image"

export function BrandFamilyBanner() {
  const brands = [
    {
      name: "Southwest Mushrooms",
      logo: "/southwest-mushrooms-logo.png",
      tagline: "Premium Gourmet Mushrooms",
      isPrimary: true,
    },
    {
      name: "Crowe Mycology",
      logo: "/crowe-avatar.png",
      tagline: "AI-Powered Cultivation Intelligence",
    },
    {
      name: "Mycology Research Pipeline",
      logo: "/mycology-research-pipeline-logo.png",
      tagline: "Scientific Research & Development",
      needsWhiteBg: true,
    },
    {
      name: "CroweOS Systems",
      logo: "/croweos-systems-logo.png",
      tagline: "Intelligent Operating Systems",
    },
    {
      name: "DeepParallel",
      logo: "/deepparallel-logo.png",
      tagline: "Advanced AI Model Family",
    },
  ]

  // Duplicate brands for seamless infinite scroll
  const duplicatedBrands = [...brands, ...brands, ...brands]

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-background via-primary/5 to-background py-12 backdrop-blur-sm border-y border-border/50">
      <div className="absolute left-0 top-0 bottom-0 w-48 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />

      {/* Scrolling content */}
      <div className="flex animate-scroll-brands items-center">
        {duplicatedBrands.map((brand, index) => (
          <div key={`${brand.name}-${index}`} className="flex items-center gap-6 mx-16 min-w-[350px] group">
            <div
              className={`relative w-20 h-20 rounded-2xl overflow-hidden backdrop-blur-md border-2 flex items-center justify-center p-2 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${
                brand.isPrimary
                  ? "border-primary/50 bg-[#f5f0e8] group-hover:border-primary"
                  : brand.needsWhiteBg
                    ? "border-border/50 bg-white group-hover:border-primary/50"
                    : "border-border/50 bg-card/60 group-hover:border-primary/50"
              }`}
            >
              <Image
                src={brand.logo || "/placeholder.svg"}
                alt={brand.name}
                width={80}
                height={80}
                className={`object-contain ${brand.isPrimary ? "rounded-xl" : ""}`}
              />
            </div>
            <div className="flex flex-col gap-1">
              <h3
                className={`text-xl font-bold tracking-tight transition-colors ${
                  brand.isPrimary
                    ? "text-primary group-hover:text-primary/80"
                    : "text-foreground group-hover:text-primary"
                }`}
              >
                {brand.name}
              </h3>
              <p className="text-sm text-muted-foreground font-medium">{brand.tagline}</p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll-brands {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        .animate-scroll-brands {
          animation: scroll-brands 20s linear infinite;
        }

        .animate-scroll-brands:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
