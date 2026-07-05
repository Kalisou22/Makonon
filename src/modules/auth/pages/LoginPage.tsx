import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../hooks/useAuth'
import { agenceService } from '../../agences/services/agenceService'
import type { Agence } from '../../agences/types'

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe minimum 6 caractères'),
})

type LoginFormData = z.infer<typeof loginSchema>

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [agences, setAgences] = useState<Agence[]>([])
  const [selectedAgenceId, setSelectedAgenceId] = useState<number | null>(null)
  const [isLoadingAgences, setIsLoadingAgences] = useState(true)

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
    const loadAgences = async () => {
      try {
        setIsLoadingAgences(true)
        const response = await agenceService.getAgences({ per_page: 100 })
        const agencesList = response.data.data || []
        // Filtrer les agences système (FRAIS, SYSTEM, CAISSE)
        const filtered = agencesList.filter((a: Agence) => 
          !['FRAIS', 'SYSTEM', 'CAISSE'].includes(a.code)
        )
        setAgences(filtered)
        if (filtered.length > 0) {
          setSelectedAgenceId(filtered[0].id)
        }
      } catch (e) {
        console.error('Erreur chargement agences:', e)
      } finally {
        setIsLoadingAgences(false)
      }
    }
    loadAgences()
  }, [])

  const onSubmit = (data: LoginFormData) => {
    setError(null)

    // Si une agence est sélectionnée, on ajoute l'info à l'utilisateur
    // Le backend utilisera l'agence_id de l'utilisateur
    login(data, {
      onError: (err: any) => {
        setError(err.response?.data?.message || 'Identifiants incorrects')
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 border border-border">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-primary tracking-wider">
            MAKONON
          </h1>
          <p className="text-text-secondary text-sm font-medium tracking-widest mt-1">
            TRANSFERT
          </p>
          <p className="text-text-secondary text-xs mt-4">Connexion sécurisée</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-danger/10 border border-danger rounded-lg text-danger text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Adresse email
            </label>
            <input
              type="email"
              {...register('email')}
              className={`
                w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 transition-all duration-200
                focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
                ${errors.email ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-border'}
              `}
              placeholder="exemple@email.com"
            />
            {errors.email && <p className="mt-1 text-sm text-danger">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              {...register('password')}
              className={`
                w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 transition-all duration-200
                focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
                ${errors.password ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-border'}
              `}
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-sm text-danger">{errors.password.message}</p>}
          </div>

          {/* Sélecteur d'agence */}
          {!isLoadingAgences && agences.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Agence
              </label>
              <select
                value={selectedAgenceId || ''}
                onChange={(e) => setSelectedAgenceId(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-gray-900 transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {agences.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.code} - {a.nom}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-text-secondary">
                Sélectionnez l'agence avec laquelle vous voulez travailler.
              </p>
            </div>
          )}

          {isLoadingAgences && (
            <div className="text-center text-sm text-text-secondary">
              Chargement des agences...
            </div>
          )}

          <div className="text-right">
            <button
              type="button"
              className="text-sm text-primary-light hover:text-primary-dark transition-colors font-medium"
              onClick={() => alert('Contactez votre administrateur.')}
            >
              Mot de passe oublié ?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`
              w-full rounded-full font-bold text-white py-2.5 transition-all duration-200
              ${isLoading
                ? 'bg-primary/70 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-dark'
              }
            `}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-text-secondary">
          v2.0.0 © 2026
        </div>
      </div>
    </div>
  )
}

export default LoginPage
