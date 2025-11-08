"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<{ id?: number; email?: string } | null>(null)
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

  useEffect(() => {
    const check = async () => {
      try {
        // Cookie-based token will be sent automatically when credentials: 'include' is set
        const res = await fetch(`${API_BASE}/api/me`, {
          credentials: 'include',
        })

        if (!res.ok) {
          // invalid token or other error -> redirect to login
          router.push('/')
          return
        }

        const data = await res.json().catch(() => ({}))
        if (data && data.user) setUser(data.user)
      } catch (e) {
        router.push('/')
      }
    }

    check()
  }, [router])

  function handleLogout() {
    const doLogout = async () => {
      try {
  await fetch(`${API_BASE}/api/logout`, { method: 'POST', credentials: 'include' })
      } catch (e) {
        console.error('Logout failed', e)
      }
      router.push('/')
    }
    doLogout()
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/beautiful-nature-landscape-forest-mountains-clouds.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative w-full max-w-3xl grid grid-cols-1 gap-8 items-center">
        <div className="w-full lg:col-span-2 mx-auto">
          <div className="bg-blue-900/50 backdrop-blur-md border border-white/30 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-white text-3xl font-bold mb-2">Welcome back</h2>
            <p className="text-white/80 mb-6">You are logged in.</p>

            {user ? (
              <div className="text-white/90 mb-6">Logged in as <strong>{user.email}</strong></div>
            ) : null}

            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
