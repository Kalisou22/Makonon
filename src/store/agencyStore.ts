import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AgencyState {
  agencyId: number | null
  agencyName: string | null
  setAgency: (id: number, name: string) => void
  clearAgency: () => void
}

export const useAgencyStore = create<AgencyState>()(
  persist(
    (set) => ({
      agencyId: null,
      agencyName: null,
      setAgency: (id, name) => set({ agencyId: id, agencyName: name }),
      clearAgency: () => set({ agencyId: null, agencyName: null }),
    }),
    {
      name: 'agency-storage',
    }
  )
)

export default useAgencyStore
