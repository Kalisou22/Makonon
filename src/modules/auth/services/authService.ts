import axiosInstance from '../../../core/api/axiosInstance'

export const authService = {
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post('/login', { email, password })
    return response.data
  },
  logout: async () => {
    const response = await axiosInstance.post('/logout')
    return response.data
  },
  me: async () => {
    const response = await axiosInstance.get('/me')
    return response.data
  }
}

export default authService
