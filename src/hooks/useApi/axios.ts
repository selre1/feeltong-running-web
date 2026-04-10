import axios from 'axios'
import { APP_BACK_URL } from '@/tools/loadenv'

const apiClient = axios.create({
  baseURL: APP_BACK_URL,
  withCredentials: true,
})

export default apiClient
