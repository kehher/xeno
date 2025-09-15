'use client'

import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LogIn } from 'lucide-react'

export default function SignInPage() {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession()
      if (session) {
        router.push('/')
      }
    }
    checkSession()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign In to Xeno CRM</CardTitle>
          <p className="text-muted-foreground">
            Access your campaign management dashboard
          </p>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full"
            size="lg"
          >
            <LogIn className="h-5 w-5 mr-2" />
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}