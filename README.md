# Crowe Mycology Platform

![Crowe Mycology Banner](/crowe-hero-banner.png)

**Crowe Mycology** is an advanced, AI-powered platform designed to revolutionize mushroom cultivation for both home growers and commercial facilities. We leverage cutting-edge computer vision, machine learning, and environmental monitoring to ensure optimal growth conditions and maximize yield.

## 🚀 Features

- **AI Contamination Detection**: Real-time analysis of substrate and fruiting blocks to detect competitors (Trichoderma, Cobweb mold, etc.) before they spread.
- **Smart Environmental Monitoring**: Integration with IoT sensors to track Temperature, Humidity, and CO2 levels, with automated alerts.
- **Yield Prediction**: Machine learning models that analyze colonization rates and fruit body density to predict harvest weight and timing.
- **Automated Cultivation Pipelines**: Step-by-step guidance tracking from substrate sterilization to harvest.
- **Interactive Mycology Assistant**: A specialized AI chatbot trained on vast mycology literature to answer cultivation questions instantly.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a custom "Biotech" theme
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)
- **State Management**: React Hooks & Context
- **AI Integration**: Custom ML models via Python backend (connected via API)
- **Database**: Supabase (PostgreSQL)

## 📂 Project Structure

\`\`\`bash
├── app/                  # Next.js App Router pages
│   ├── dashboard/        # User dashboard & metrics
│   ├── chat/            # AI Assistant interface
│   ├── crowe-vision/    # Computer vision analysis tools
│   └── docs/            # Documentation & Knowledge Base
├── components/          # Reusable UI components
│   ├── ui/              # Base UI primitives (buttons, cards, inputs)
│   └── [feature].tsx    # Feature-specific components (e.g., orchestrated-hero.tsx)
├── lib/                 # Utility functions & Supabase client
└── public/              # Static assets
\`\`\`

## 🚦 Getting Started

1.  **Clone the repository**:
    \`\`\`bash
    git clone https://github.com/MichaelCrowe11/v0-email-marketing-landing-page.git
    cd v0-email-marketing-landing-page
    \`\`\`

2.  **Install dependencies**:
    \`\`\`bash
    pnpm install
    # or
    npm install
    \`\`\`

3.  **Run Development Server**:
    \`\`\`bash
    npm run dev
    \`\`\`

4.  **Open in Browser**:
    Navigate to `http://localhost:3000` to see the application.

## 🧪 Deployment

This project is optimized for deployment on Vercel or any containerized environment (e.g., RunPod for AI workloads).

---

*Built with ❤️ by the Crowe Mycology Team*
