"use client"

import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, LogIn, ChevronLeft, ChevronRight } from "lucide-react"

const carouselImages = [
  "/mountain-sunset-vista.png",
  "/tropical-beach-palms.png",
  "/forest-waterfall-nature.jpg",
  "/desert-sand-dunes-sunset.jpg",
  "/snowy-mountain-peaks.png",
]

export function LoginPage({ onSwitch }: { onSwitch?: (page: 'login' | 'register') => void }) {
  type FormValues = { email: string; password: string }
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const router = useRouter()
  const mutation = useMutation({
    mutationFn: async (vals: FormValues) => {
      const res = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(vals),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        const msg = err && (err.error || (err.errors && err.errors.join(', '))) ? (err.error || err.errors.join(', ')) : `Request failed: ${res.status}`
        throw new Error(msg)
      }

      return res.json()
    },
    onSuccess: () => {
      router.push('/home')
    }
  })
  
  const handleLogin = async (e?: React.FormEvent) => {
    // placeholder; actual submit handled by react-query mutation via onSubmit below
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/beautiful-nature-landscape-forest-mountains-clouds.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative w-full max-w-7xl grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
        {/* Left Card - Image Carousel (Larger) */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-8 shadow-2xl overflow-hidden">
            {/* Carousel Container */}
            <div className="relative w-full h-96 rounded-2xl overflow-hidden mb-4">
              <img
                src={carouselImages[currentImageIndex] || "/placeholder.svg"}
                alt={`Carousel image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 transition z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 transition z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Carousel Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Title Section */}
            <div className="text-center">
              <h2 className="text-white text-3xl font-bold mb-2">Explore the World</h2>
              <p className="text-white/80 text-sm">Travel to beautiful destinations with ease</p>
            </div>
          </div>
        </div>

        {/* Right Card - Login Form (Smaller) */}
        <div className="w-full lg:col-span-2">
          <div className="bg-blue-900/50 backdrop-blur-md border border-white/30 rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <h2 className="text-white text-3xl font-bold mb-2 text-balance">Log in to start your journey.</h2>

            {/* Form Title */}
            <h3 className="text-white/80 text-xs font-semibold mb-8 uppercase tracking-wider">UX UI Components</h3>

            <form onSubmit={handleSubmit((vals) => mutation.mutate(vals))} className="space-y-6">
              {/* Email/Phone Input */}
              <div>
                <label className="block text-white text-sm font-medium mb-3">Email / Phone number</label>
                <input
                  type="text"
                  placeholder="Email"
                  {...register('email', { required: 'Please enter your email' })}
                  className="w-full bg-white/90 text-gray-900 placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition"
                />
                {errors.email ? <p className="text-red-300 text-sm mt-1">{errors.email.message}</p> : null}
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-white text-sm font-medium mb-3">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register('password', { required: 'Please enter your password' })}
                    
                    className="w-full bg-white/90 text-gray-900 placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {errors.password ? <p className="text-red-300 text-sm mt-1">{errors.password.message}</p> : null}
                </div>
              </div>

              {/* login-only: no confirm password here */}

              {/* Remember Login & Forgot Password */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-5 h-5 rounded cursor-pointer accent-orange-400"
                  />
                  <span className="text-white/80 text-sm">Remember login</span>
                </label>
                <button
                  type="button"
                  className="text-white/80 hover:text-white text-sm transition flex items-center gap-2"
                >
                  Forgot password
                </button>
              </div>

              {/* Auth Button */}
              <button
                type="submit"
                disabled={mutation.status === 'pending'}
                className="w-full bg-gradient-to-r from-blue-500 to-orange-400 hover:from-blue-600 hover:to-orange-500 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 flex items-center justify-center gap-2 mt-8 disabled:opacity-60"
              >
                <LogIn className="w-5 h-5" />
                {mutation.status === 'pending' ? 'Logging in...' : 'Login'}
              </button>

              {mutation.status === 'error' ? (
                <div className="text-center text-red-300 mt-3">{(mutation.error as any)?.message || 'Login failed'}</div>
              ) : null}

              {/* Social Login */}
              <button
                type="button"
                className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Login with Google / Facebook
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-white/80 text-sm">
                <>Don't have an account yet?{' '}
                  {onSwitch ? (
                    <button type="button" onClick={() => onSwitch('register')} className="text-white font-semibold hover:underline">
                      Create now!
                    </button>
                  ) : (
                    <Link href="/register" className="text-white font-semibold hover:underline">
                      Create now!
                    </Link>
                  )}
                </>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
