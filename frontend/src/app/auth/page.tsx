"use client"

import { useState } from "react"
import { LoginForm, RegisterForm } from "@/app/auth/components"
import type { userData } from "./types"
import axios from "axios"
import { settings } from "@/lib/settings"
import { useRouter } from "next/navigation"
import { AxiosError } from "axios"

export default function AuthPage() {
  
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    setError("")
    
    try {
       const response = await axios.post(`${settings.backendUrl}/auth/login`, { email, password })
       const jwt = response.data.access_token
       console.log("Received JWT:", jwt)
       localStorage.setItem("token", jwt)
      // Redirect to dashboard
       router.push("/dashboard")
       console.log("Login successful")
    } catch (err) {
      const error = err as AxiosError
      if (error.response && error.response.status === 401) {  
        setError("Invalid email or password")
      } else {
        setError(error.message)
        console.error("Login error:", err)
      }
    } finally {
      console.log(`${settings.backendUrl}/auth/login`, { email, password })
      setIsLoading(false)
    }
  }

  const handleRegister = async (userData: userData) => {
    setIsLoading(true)
    setError("")
    
    try {
        const response = await axios.post(`${settings.backendUrl}/auth/register`, userData)
        console.log("Registration successful:", response.data)
        setIsLogin(true) 
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating account")
      console.error("Registration error:", err) 
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginForm
            onLogin={handleLogin}
            onRegisterClick={() => {
              setError("");  
              setIsLogin(false);
            }}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <RegisterForm
            onRegister={handleRegister}
            onLoginClick={() => {  
              setError("");      
              setIsLogin(true);
            }}
            isLoading={isLoading}
            error={error}
          />
        )}
      </div>
    </div>
  )
}