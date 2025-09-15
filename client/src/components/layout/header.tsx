'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LoginButton } from '@/components/auth/login-button'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Create Campaign', href: '/campaigns/new' },
  { name: 'Campaign History', href: '/campaigns' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">X</span>
              </div>
              <span className="font-bold text-xl">Xeno CRM</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? 'default' : 'ghost'}
                  asChild
                >
                  <Link href={item.href}>{item.name}</Link>
                </Button>
              ))}
            </nav>
          </div>

          <LoginButton />
        </div>
      </div>
    </header>
  )
}