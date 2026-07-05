import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../hooks/useAuth'

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe minimum 6 caractères'),
})

type LoginFormData = z.infer<typeof loginSchema>

export const LoginPage: React.FC = () => {
  const { login, isLoading, isAuthenticated } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@makonon.com',
      password: 'admin123',
    },
  })

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/dashboard'
    }
  }, [isAuthenticated])

  const onSubmit = (data: LoginFormData) => {
    setError(null)
    login(data, {
      onError: (err: any) => {
        setError(err.response?.data?.message || 'Identifiants incorrects')
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 border border-border">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-primary tracking-wider">MAKONON</h1>
          <p className="text-text-secondary text-sm font-medium tracking-widest mt-1">TRANSFERT</p>
          <p className="text-text-secondary text-xs mt-4">Connexion sécurisée</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-danger/10 border border-danger rounded-lg text-danger text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Adresse email</label>
            <input
              type="email"
              {...register('email')}
              className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-gray-900 transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="exemple@email.com"
            />
            {errors.email && <p className="mt-1 text-sm text-danger">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              {...register('password')}
              className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-gray-900 transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-sm text-danger">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full font-bold text-white py-2.5 transition-all duration-200 bg-primary hover:bg-primary-dark disabled:bg-primary/70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-text-secondary">v2.0.0 © 2026</div>
      </div>
    </div>
  )
}

export default LoginPage
