import { Badge } from "@/components/ui/badge"

export default function HeaderSection() {
  return (
    <header className="flex flex-col items-center justify-center pb-6 px-4 space-y-3">
      <div className="relative">
        <img src="/Logo1.png" alt="ScriptX Logo" className="h-16 w-16 object-contain rounded-xl shadow-sm" />
        <div className="absolute -bottom-2 -right-2">
          <Badge variant="secondary" className="text-xs font-medium font-inter">
            Beta
          </Badge>
        </div>
      </div>

      <div className="space-y-1 text-center font-inter">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent font-inter">
          ScriptX
        </h1>
        <p className="text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Transform viral YouTube content into your personal script style
        </p>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
          [currently supports videos under 20 minutes in length]
        </p>
      </div>
    </header>
  )
}

