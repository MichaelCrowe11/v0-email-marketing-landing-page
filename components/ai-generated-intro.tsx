"use client"

import { useState, useEffect, useMemo, useCallback } from "react"

export function AIGeneratedIntro({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [codeStreams, setCodeStreams] = useState<
    Array<{ id: number; code: string; color: string; x: number; delay: number }>
  >([])
  const [statusText, setStatusText] = useState("Initializing AI Systems...")

  const codeSnippets = useMemo(
    () => [
      { code: "import { TensorFlow, PyTorch } from '@ai/frameworks'", color: "text-purple-400" },
      { code: "const model = await loadTransformerModel('mycology-gpt-4')", color: "text-blue-400" },
      { code: "neural_network.train(epochs=10000, batch_size=256)", color: "text-green-400" },
      { code: "if (contamination.confidence > 0.99) quarantine()", color: "text-red-400" },
      { code: "const dna_sequence = CRISPR.analyze(genome_data)", color: "text-cyan-400" },
      { code: "vision_model.detect_species(image, threshold=0.98)", color: "text-yellow-400" },
      { code: "class QuantumMycologyAI extends DeepLearning {", color: "text-pink-400" },
      { code: "  async predict_growth(env: Environment) {", color: "text-orange-400" },
      { code: "const embeddings = transformer.encode(species_data)", color: "text-indigo-400" },
      { code: "await vectorDB.upsert({ id, vector, metadata })", color: "text-teal-400" },
      { code: "reinforcement_learning.optimize(reward_function)", color: "text-lime-400" },
      { code: "const yield = genetic_algorithm.maximize(params)", color: "text-fuchsia-400" },
      { code: "interface NeuralArchitecture { layers: Layer[] }", color: "text-violet-400" },
      { code: "return { accuracy: 99.8%, latency: 12ms }", color: "text-emerald-400" },
      { code: "attention_mechanism.focus(key_features)", color: "text-sky-400" },
      { code: "export const cultivate = quantum_optimize()", color: "text-rose-400" },
      { code: "federated_learning.aggregate_models(clients)", color: "text-amber-400" },
      { code: "const prediction = ensemble.vote([rf, xgb, nn])", color: "text-purple-300" },
      { code: "graph_neural_network.propagate(mycelium_network)", color: "text-blue-300" },
      { code: "automl.search_architecture(search_space)", color: "text-green-300" },
      { code: "edge_ai.deploy(model, device='raspberry-pi')", color: "text-red-300" },
      { code: "blockchain.verify_cultivation_data(hash)", color: "text-cyan-300" },
      { code: "iot_sensors.stream(temperature, humidity, co2)", color: "text-yellow-300" },
      { code: "knowledge_graph.query('optimal_substrate')", color: "text-pink-300" },
    ],
    [],
  )

  const statusMessages = useMemo(
    () => [
      "⚡ Initializing Quantum Neural Networks...",
      "🧠 Loading Deep Learning Models (GPT-4 Architecture)...",
      "🔬 Indexing 15,000+ Species in Vector Database...",
      "👁️ Training Computer Vision with 2M+ Images...",
      "🧬 Analyzing DNA Sequences with CRISPR Technology...",
      "📊 Optimizing Growth Parameters via Reinforcement Learning...",
      "🌐 Deploying Edge AI to IoT Sensor Network...",
      "🔐 Securing Data with Blockchain Verification...",
      "🚀 Finalizing Platform Deployment...",
    ],
    [],
  )

  const updateStatus = useCallback(
    (newProgress: number) => {
      const statusIndex = Math.floor((newProgress / 100) * statusMessages.length)
      if (statusIndex < statusMessages.length) {
        setStatusText(statusMessages[statusIndex])
      }
    },
    [statusMessages],
  )

  useEffect(() => {
    const streamInterval = setInterval(() => {
      const randomSnippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)]
      const newStream = {
        id: Date.now() + Math.random(),
        code: randomSnippet.code,
        color: randomSnippet.color,
        x: Math.random() * 95,
        delay: Math.random() * 0.3,
      }
      setCodeStreams((prev) => [...prev.slice(-30), newStream])
    }, 100)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 1
        updateStatus(newProgress)

        if (newProgress >= 100) {
          clearInterval(progressInterval)
          clearInterval(streamInterval)
          setTimeout(onComplete, 800)
          return 100
        }
        return newProgress
      })
    }, 50)

    return () => {
      clearInterval(streamInterval)
      clearInterval(progressInterval)
    }
  }, [onComplete, codeSnippets, updateStatus])

  if (progress >= 100) return null

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      <div className="absolute inset-0">
        {codeStreams.map((stream) => (
          <div
            key={stream.id}
            className={`absolute font-mono text-sm font-bold ${stream.color} whitespace-nowrap animate-stream`}
            style={{
              left: `${stream.x}%`,
              top: "-50px",
              animation: `stream 3.5s linear forwards`,
              animationDelay: `${stream.delay}s`,
              textShadow: "0 0 15px currentColor, 0 0 30px currentColor",
              letterSpacing: "0.05em",
            }}
          >
            {stream.code}
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/70 to-black pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        <div
          className="relative mb-8 will-change-transform"
          style={{
            filter: `drop-shadow(0 0 ${30 + progress / 3}px rgba(139,92,246,${0.5 + progress / 200})) drop-shadow(0 0 ${20 + progress / 5}px rgba(59,130,246,${0.3 + progress / 200}))`,
          }}
        >
          <img
            src="/crowe-logic-logo.png"
            alt="Crowe Logic"
            className="h-40 w-40 rounded-full mx-auto ring-4 ring-purple-500/30"
            style={{
              transform: `scale(${1 + progress / 800}) rotate(${progress * 0.5}deg)`,
              transition: "transform 0.3s ease-out",
            }}
          />

          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className="absolute h-2 w-2 rounded-full will-change-transform"
              style={{
                background: `hsl(${(i * 45 + progress * 2) % 360}, 80%, 60%)`,
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) rotate(${i * 45 + progress * 4}deg) translateY(-${80 + (i % 3) * 10}px)`,
                opacity: 0.7 + Math.sin((progress + i * 45) * 0.1) * 0.3,
                boxShadow: `0 0 10px currentColor`,
                transition: "all 0.1s linear",
              }}
            />
          ))}
        </div>

        <h1 className="text-7xl font-bold text-white mb-3 tracking-tight">Crowe Logic</h1>
        <p className="text-3xl text-white/90 mb-12 font-light">AI-Powered Mycology Intelligence</p>

        <p
          className="text-xl text-white/90 mb-8 font-mono font-semibold"
          style={{ textShadow: "0 0 20px rgba(139,92,246,0.5)" }}
        >
          {statusText}
        </p>

        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-between text-sm text-white/70 mb-3 font-mono font-semibold">
            <span>Loading Platform</span>
            <span className="font-bold text-white">{progress}%</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/30 shadow-lg">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-cyan-500 transition-all duration-300 ease-out relative will-change-transform"
              style={{
                width: `${progress}%`,
                boxShadow: `0 0 30px rgba(139, 92, 246, ${progress / 80}), 0 0 50px rgba(59, 130, 246, ${progress / 100})`,
                animation: "shimmer 2s infinite",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center mt-10">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-3 w-3 rounded-full will-change-transform"
              style={{
                background: `hsl(${(progress * 3 + i * 120) % 360}, 80%, 60%)`,
                opacity: 0.4 + (Math.sin(progress * 0.15 + i * 1.2) + 1) * 0.3,
                transform: `scale(${1 + (Math.sin(progress * 0.15 + i * 1.2) + 1) * 0.2})`,
                boxShadow: `0 0 15px currentColor`,
                transition: "all 0.1s ease-out",
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes stream {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(calc(100vh + 100px));
            opacity: 0;
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}
