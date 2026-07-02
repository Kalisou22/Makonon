import { axiosInstance } from '../../../core/api/axiosInstance';

export const utilisateurService = {
  getUtilisateurs: (page, size, search, role) => {
    const params = { page, size };
    if (search) params.search = search;
    if (role && role !== 'Tous') params.role = role;
    return axiosInstance.get('/utilisateurs/paginated', { params });
  },
  getUtilisateur: (id) => axiosInstance.get(`/utilisateurs/${id}`),
  createUtilisateur: (data) => axiosInstance.post('/utilisateurs', data),
  updateUtilisateur: (id, data) => axiosInstance.put(`/utilisateurs/${id}`, data),
  deleteUtilisateur: (id) => axiosInstance.delete(`/utilisateurs/${id}`),
};
