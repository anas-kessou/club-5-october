import { Camera, Menu, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { navLinks } from '@/lib/content'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const logoSrc = `${import.meta.env.BASE_URL}cafe-logo.svg`
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img src={logoSrc} alt="Club 5 Octobre" className="h-14 w-auto object-contain drop-shadow-sm" />
          <div>
            <p className="font-display text-lg font-bold text-fm6e-dark">Club 5 Octobre</p>
            <p className="text-xs text-muted-foreground">Espace 5 Octobre · Mohammedia</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-sm transition-colors hover:bg-fm6e-mint',
                  isActive && 'bg-fm6e-mint text-fm6e-dark',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <span className="rounded-full border border-primary/30 bg-fm6e-mint px-3 py-1 text-xs font-semibold text-fm6e-dark">
            Partenaire FM6E
          </span>
          <Button asChild size="sm" variant="secondary">
            <a href="https://wa.me/212600000000" target="_blank" rel="noreferrer">
              <MessageCircle className="mr-1 h-4 w-4" /> WhatsApp
            </a>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <Camera className="mr-1 h-4 w-4" /> Instagram
            </a>
          </Button>
        </div>

        <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setOpen((v) => !v)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Ouvrir le menu</span>
        </Button>
      </div>

      {open && (
        <div className="border-t bg-background px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn('rounded-md px-3 py-2 text-sm', isActive ? 'bg-fm6e-mint text-fm6e-dark' : 'hover:bg-muted')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="secondary">
              <a href="https://wa.me/212600000000" target="_blank" rel="noreferrer">
                <MessageCircle className="mr-1 h-4 w-4" /> WhatsApp
              </a>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <Camera className="mr-1 h-4 w-4" /> Instagram
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
