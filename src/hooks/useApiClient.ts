import axios from 'axios'
import { useMemo } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const useApiClient = () => {
  return useMemo(
    () =>
      axios.create({
        baseURL: API_BASE_URL,
        withCredentials: true,
      }),
    [],
  )
}
