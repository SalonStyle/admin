"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import { useSignInMutation } from "@/lib/redux/features/auth/auth-api"
import { setCredentials } from "@/lib/redux/features/auth/auth-slice"
import { getPrimaryRoleCode } from "@/lib/auth/permissions"
import { resolvePostLoginRoute } from "@/lib/auth/routes"

function RedirectingView() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        <p className="text-sm font-medium text-slate-500">Redirecting...</p>
      </div>
    </div>
  )
}

function LoginForm() {
  const dispatch = useDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect")
  const { isAuthenticated, user, isInitialized } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const [signIn, { isLoading }] = useSignInMutation()

  const destination = isAuthenticated && user
    ? resolvePostLoginRoute(getPrimaryRoleCode(user), redirectTo)
    : null

  useEffect(() => {
    if (!isInitialized || !destination) return
    setIsRedirecting(true)
    router.replace(destination)
  }, [destination, isInitialized, router])

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      setIsRedirecting(false)
    }
  }, [isAuthenticated, isInitialized])

  if (!isInitialized) {
    return <LoginFallback />
  }

  if (isRedirecting || (isAuthenticated && user)) {
    return <RedirectingView />
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const result = await signIn({ email, password }).unwrap()
      setIsRedirecting(true)
      dispatch(setCredentials(result))
      router.replace(resolvePostLoginRoute(getPrimaryRoleCode(result.user), redirectTo))
    } catch (err) {
      setIsRedirecting(false)
      const message =
        err?.data?.message ||
        err?.data?.detail ||
        (typeof err?.data === "string" ? err.data : null) ||
        "Invalid email or password"
      setError(message)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="border-none text-center shadow-none">
          <CardHeader className="space-y-2">
            <CardTitle className="mb-0 text-2xl font-bold">Sign in</CardTitle>
            <CardDescription className="text-slate-600">
              Enter your email and password to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2 text-left">
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                    autoComplete="email"
                  />
                </div>
                <div className="grid gap-2 text-left">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11"
                    autoComplete="current-password"
                  />
                </div>
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    {error}
                  </div>
                )}
                <Button
                  type="submit"
                  className="h-11 w-full bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg"
                  disabled={isLoading || isRedirecting}
                >
                  {isLoading || isRedirecting ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function LoginFallback() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  )
}
