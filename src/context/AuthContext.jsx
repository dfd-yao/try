import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null) // 'admin' | 'user' | null

  const login = (username) => {
    const userRole = username === 'admin' ? 'admin' : 'user'
    setRole(userRole)
    return userRole
  }

  const logout = () => {
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
