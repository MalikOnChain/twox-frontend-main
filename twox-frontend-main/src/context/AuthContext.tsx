'use client'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated on mount
    const auth = Cookies.get('isAuthenticated')
    setIsAuthenticated(auth === 'true')
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    try {
      // This is a simple example. In a real application, you would validate against a backend
      if (username === 'admin' && password === 'password') {
        setIsAuthenticated(true)
        Cookies.set('isAuthenticated', 'true', { expires: 7 }) // Cookie expires in 7 days
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    Cookies.remove('isAuthenticated')
    router.push('/login')
  }

  if (isLoading) {
    return null // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
