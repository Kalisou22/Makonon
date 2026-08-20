import React, { useState, useEffect, useRef } from 'react'
import { useClients } from '../../modules/clients/hooks/useClients'
import { useCreateClient } from '../../modules/clients/hooks/useClients'
import { toast } from 'react-hot-toast'

interface ClientSearchProps {
  value?: string
  onChange: (clientId: number, clientName: string, clientData?: any) => void
  placeholder?: string
  label?: string
  required?: boolean
  className?: string
}

export const ClientSearch: React.FC<ClientSearchProps> = ({
  value: externalValue,
  onChange,
  placeholder = "Rechercher un client...",
  label,
  required,
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState(externalValue || '')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newClientData, setNewClientData] = useState({ nom: '', telephone: '', email: '' })
  const wrapperRef = useRef<HTMLDivElement>(null)

  const { data, isLoading } = useClients({ search: searchTerm, per_page: 10 })
  const createClient = useCreateClient()

  // ✅ Utilisation de any pour éviter les problèmes de typage
  const clients: any[] = (data as any)?.data || []

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (externalValue && externalValue !== searchTerm) {
      setSearchTerm(externalValue)
    }
  }, [externalValue])

  const handleSelect = (client: any) => {
    setSelectedClient(client)
    setSearchTerm(client.nom)
    setIsOpen(false)
    onChange(client.id, client.nom, client)
  }

  const handleCreate = () => {
    if (!newClientData.nom || !newClientData.telephone) {
      toast.error('Veuillez remplir le nom et le téléphone')
      return
    }
    createClient.mutate(newClientData, {
      onSuccess: (data: any) => {
        const client = data.data || data
        setSelectedClient(client)
        setSearchTerm(client.nom)
        setIsOpen(false)
        setShowCreateModal(false)
        setNewClientData({ nom: '', telephone: '', email: '' })
        onChange(client.id, client.nom, client)
        toast.success('Client créé avec succès')
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Erreur lors de la création')
      }
    })
  }

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value)
          setIsOpen(true)
          if (e.target.value === '') {
            setSelectedClient(null)
            onChange(0, '', null)
          }
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        autoComplete="off"
      />

      {isOpen && searchTerm.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="p-3 text-center text-sm text-gray-500">Chargement...</div>
          ) : clients.length > 0 ? (
            <>
              {clients.map((client: any) => (
                <div
                  key={client.id}
                  className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-0"
                  onClick={() => handleSelect(client)}
                >
                  <div className="font-medium">{client.nom}</div>
                  <div className="text-sm text-gray-500">
                    {client.telephone} {client.email && `· ${client.email}`}
                  </div>
                </div>
              ))}
              <div
                className="p-3 hover:bg-green-50 cursor-pointer border-t border-green-200 text-green-600 text-center font-medium"
                onClick={() => setShowCreateModal(true)}
              >
                + Créer un nouveau client "{searchTerm}"
              </div>
            </>
          ) : (
            <div className="p-3 text-center">
              <p className="text-gray-500 mb-2">Aucun client trouvé</p>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => setShowCreateModal(true)}
              >
                + Créer "{searchTerm}"
              </button>
            </div>
          )}
        </div>
      )}

      {selectedClient && (
        <div className="mt-1 text-xs text-green-600">
          ✓ Client sélectionné: {selectedClient.nom} ({selectedClient.telephone})
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Nouveau client</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Nom complet *</label>
                <input
                  type="text"
                  value={newClientData.nom}
                  onChange={(e) => setNewClientData({ ...newClientData, nom: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Mamadou Diallo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Téléphone *</label>
                <input
                  type="text"
                  value={newClientData.telephone}
                  onChange={(e) => setNewClientData({ ...newClientData, telephone: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 620000001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={newClientData.email}
                  onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: client@email.com"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 border rounded hover:bg-gray-50"
                onClick={() => setShowCreateModal(false)}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handleCreate}
                disabled={createClient.isPending}
              >
                {createClient.isPending ? 'Création...' : 'Créer le client'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientSearch
