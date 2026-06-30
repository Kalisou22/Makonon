import { create } from 'zustand';

interface AgencyState {
  agencyId: number | null;
  agencyName: string | null;
  setAgency: (id: number, name: string) => void;
  clearAgency: () => void;
}

export const useAgencyStore = create<AgencyState>((set) => ({
  agencyId: null,
  agencyName: null,
  setAgency: (id, name) => set({ agencyId: id, agencyName: name }),
  clearAgency: () => set({ agencyId: null, agencyName: null }),
}));
