"use client"
import { Github, MessageSquare, Sparkles, Zap } from "lucide-react"

interface EmptyStateProps {
  backendConnected: boolean | null
}

export default function EmptyState({ backendConnected }: EmptyStateProps) {
  const features = [
    {
      icon: <Github className="w-6 h-6" />,
      title: "Repository Analysis",
      description: "Explore codebases, understand structure, and find insights"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Code Discussions",
      description: "Ask questions about specific code patterns and implementations"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Powered Insights",
      description: "Get intelligent analysis and recommendations from AI"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Quick Research",
      description: "Fast answers to your GitHub and development questions"
    }
  ]

  if (backendConnected === false) {
    return (
      <div className="text-center py-12 px-6">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500/20 to-red-500/20 
                        rounded-full flex items-center justify-center border border-orange-500/30">
            <Github className="w-10 h-10 text-orange-400" />
          </div>
          <h3 className="text-2xl font-bold text-[#f0f6fc] mb-3">
            Backend Setup Required
          </h3>
          <p className="text-[#8b949e] mb-8 leading-relaxed">
            To use the full GitHub Research Assistant, you need to set up the backend server. 
            Currently running in demo mode with limited functionality.
          </p>
          <div className="space-y-3">
            <div className="p-4 bg-[#161b22] rounded-lg border border-[#30363d]">
              <h4 className="font-semibold text-[#f0f6fc] mb-2">Setup Instructions:</h4>
              <ol className="text-sm text-[#8b949e] space-y-1 list-decimal list-inside">
                <li>Start the backend server on localhost:3000</li>
                <li>Configure GitHub OAuth credentials</li>
                <li>Set up environment variables</li>
                <li>Restart the frontend application</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-[#2188ff]/20 to-[#1f6feb]/20 
                      rounded-full flex items-center justify-center border border-[#2188ff]/30">
          <Github className="w-12 h-12 text-[#2188ff]" />
        </div>
        
        <h3 className="text-3xl font-bold text-[#f0f6fc] mb-4">
          Welcome to GitHub Research Assistant
        </h3>
        <p className="text-lg text-[#8b949e] mb-12 leading-relaxed max-w-lg mx-auto">
          Your AI-powered companion for exploring GitHub repositories, understanding codebases, 
          and getting intelligent insights about your development projects.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-[#161b22] rounded-xl border border-[#30363d] hover:border-[#2188ff]/30 
                       transition-all duration-300 hover:bg-[#21262d] group"
            >
              <div className="w-12 h-12 bg-[#2188ff]/10 rounded-lg flex items-center justify-center 
                            mb-4 group-hover:bg-[#2188ff]/20 transition-colors duration-300">
                <div className="text-[#2188ff]">
                  {feature.icon}
                </div>
              </div>
              <h4 className="text-lg font-semibold text-[#f0f6fc] mb-2">
                {feature.title}
              </h4>
              <p className="text-[#8b949e] text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-[#2188ff]/10 to-[#1f6feb]/10 rounded-xl p-6 border border-[#2188ff]/20">
          <h4 className="font-semibold text-[#f0f6fc] mb-3">Ready to get started?</h4>
          <p className="text-[#8b949e] text-sm mb-4">
            Try asking questions like:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="p-3 bg-[#21262d] rounded-lg border border-[#30363d]">
              <p className="text-sm text-[#f0f6fc]">"Analyze the React repository structure"</p>
            </div>
            <div className="p-3 bg-[#21262d] rounded-lg border border-[#30363d]">
              <p className="text-sm text-[#f0f6fc]">"What are the main features of Next.js?"</p>
            </div>
            <div className="p-3 bg-[#21262d] rounded-lg border border-[#30363d]">
              <p className="text-sm text-[#f0f6fc]">"Find popular TypeScript projects"</p>
            </div>
            <div className="p-3 bg-[#21262d] rounded-lg border border-[#30363d]">
              <p className="text-sm text-[#f0f6fc]">"Explain this code pattern..."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
