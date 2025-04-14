import { Badge } from "@/components/ui/badge"

export default function HeaderSection() {
  return (
    <header className="flex flex-col items-center justify-center pb-6 px-4 space-y-2">
      <div className="relative">
        <img src="/S.png" alt="ScriptX Logo" className="h-16 w-16 object-contain rounded-xl shadow-sm" />
        <div className="absolute -bottom-2 -right-2">
          <Badge variant="secondary" className="text-xs font-medium">
            Beta
          </Badge>
        </div>
      </div>

      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
          ScriptX
        </h1>
        <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
          Transform viral YouTube content into your personal script style
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        <span>AI-powered content transformation</span>
      </div>
    </header>
  )
}

