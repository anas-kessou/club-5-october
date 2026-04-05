import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface AdminGateProps {
  children: React.ReactNode
}

export function AdminGate({ children }: AdminGateProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(Boolean(supabase))

  const demoMode = useMemo(() => !supabase, [])

  useEffect(() => {
    if (!supabase) {
      setIsAdmin(true)
      setLoading(false)
      return
    }

    void supabase.auth.getUser().then(({ data }) => {
      const role = data.user?.user_metadata?.role
      setIsAdmin(role === 'admin' || data.user?.email?.endsWith('@club5octobre.ma') === true)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <p className="section-container">Vérification de l'accès administrateur...</p>
  }

  if (isAdmin) {
    return <>{children}</>
  }

  async function handleLogin() {
    if (!supabase) return

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success('Connexion admin réussie.')
    setIsAdmin(true)
  }

  return (
    <section className="section-container">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Accès administrateur</CardTitle>
          <CardDescription>
            {demoMode
              ? 'Mode démo actif (Supabase non configuré). L’accès est ouvert.'
              : 'Connectez-vous avec un compte administrateur Supabase.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Mot de passe</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <Button type="button" className="w-full" onClick={handleLogin}>
            Se connecter
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
