"use client"

import { useState } from 'react'
import { LoginPage } from '@/components/login-page'
import { RegisterPage } from '@/components/register-page'

export default function Home() {
  const [view, setView] = useState<'login' | 'register'>('login')

  return view === 'login' ? (
    <LoginPage onSwitch={(p) => setView(p)} />
  ) : (
    <RegisterPage onSwitch={(p) => setView(p)} />
  )
}
