import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="w-full fixed top-0 z-50 backdrop-blur-md shadow-sm bg-background/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        {/* Logo and Brand Name */}
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md flex items-center justify-center">
            <img src="/S.png" alt="Logo" className="h-8 w-8 rounded-sm" />
          </div>
          <span className="text-lg font-semibold">ScriptX</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          <a
            href="#how-it-works"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </a>
          <a
            href="#feedback"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Feedback
          </a>
          <Button size="sm" asChild>
            <a href="#try-now">Try Now</a>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          isMenuOpen ? "max-h-56" : "max-h-0",
        )}
      >
        <div className="flex flex-col space-y-3 px-4 py-3">
          <a
            href="#how-it-works"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
            onClick={closeMenu}
          >
            How It Works
          </a>
          <a
            href="#feedback"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
            onClick={closeMenu}
          >
            Feedback
          </a>
          <Button size="sm" className="w-full sm:w-auto" asChild>
            <a href="#try-now" onClick={closeMenu}>
              Try Now
            </a>
          </Button>
        </div>
      </div>
    </nav>
  )
}
