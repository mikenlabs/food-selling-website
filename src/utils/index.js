// Format currency in Naira
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₦0'
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Debounce utility
export const debounce = (fn, delay = 300) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// Check if running in browser
export const isBrowser = () => typeof window !== 'undefined'

// Generate random ID for mock data
export const generateId = () => Math.random().toString(36).substr(2, 9)

// Truncate text
export const truncateText = (text, length = 100) => {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}