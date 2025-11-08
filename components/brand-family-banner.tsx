"use client"

import Image from "next/image"

export function BrandFamilyBanner() {
  const brands = [
    {
      name: "Southwest Mushrooms",
      logo: "/southwest-mushrooms-logo.jpg",
      tagline: "Premium Gourmet Mushrooms",
    },
    {
      name: "Crowe Mycology",
      logo: "/crowe-mycology-logo.png",
      tagline: "Mycological Expertise & Consulting",
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

  const duplicatedBrands = [...brands, ...brands, ...brands]

  return (
    <div className="relative w-full overflow-hidden bg-muted/20 py-12 border-y border-border">
      <div className="absolute left-0 top-0 bottom-0 w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="flex animate-scroll-brands items-center">
        {duplicatedBrands.map((brand, index) => (
          <div key={`${brand.name}-${index}`} className="flex items-center gap-6 mx-16 min-w-[350px] group">
            <div
              className={`relative w-20 h-20 rounded-lg overflow-hidden border border-border flex items-center justify-center p-3 transition-all duration-300 ${
                brand.needsWhiteBg ? "bg-white" : "bg-card"
              }`}
            >
              <Image
                src={brand.logo || "/placeholder.svg"}
                alt={brand.name}
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold text-foreground tracking-tight">{brand.name}</h3>
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
