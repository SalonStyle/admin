"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function LoginPage() {

  const handleSignIn = async (e) => {
    e.preventDefault()
    // router.push("/")
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-sm">
        <Card className="border-none shadow-none text-center">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold mb-0">Sign in</CardTitle>
            <CardDescription className="text-slate-600">Enter your email and password to continue</CardDescription>
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
                    // value={email}
                    // onChange={(e) => setEmail(e.target.value)}
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
                    // value={password}
                    // onChange={(e) => setPassword(e.target.value)}
                    className="h-11"
                    autoComplete="current-password"
                  />
                </div>
                <Button type="submit" className="w-full h-11 bg-indigo-600 text-white hover:bg-indigo-700">
                  Sign in
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
