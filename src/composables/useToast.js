import { ref } from 'vue'

export const useToast = () => {
  // Will be injected via the app
  const addToast = (message, type = 'success') => {
    // Use the global toast store
    if (typeof window !== 'undefined' && window.__toast) {
      window.__toast(message, type)
    }
  }
  return { addToast }
}