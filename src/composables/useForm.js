import { ref, computed } from 'vue'

export const useForm = (initialState = {}) => {
  const form = ref({ ...initialState })
  const errors = ref({})

  const isDirty = computed(() => Object.keys(form.value).some((key) => form.value[key] !== initialState[key]))
  const isValid = computed(() => Object.keys(errors.value).length === 0)

  const reset = () => {
    form.value = { ...initialState }
    errors.value = {}
  }

  const setErrors = (errorObj) => {
    errors.value = { ...errorObj }
  }

  const clearErrors = () => {
    errors.value = {}
  }

  return {
    form,
    errors,
    isDirty,
    isValid,
    reset,
    setErrors,
    clearErrors,
  }
}

export const validators = {
  required: (value) => !value || value === '' ? 'This field is required' : '',
  email: (value) => value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email address' : '',
  phone: (value) => value && !/^[\d\s\-\+\(\)]{7,}$/.test(value) ? 'Invalid phone number' : '',
  minLength: (length) => (value) => value && value.length < length ? `Must be at least ${length} characters` : '',
  maxLength: (length) => (value) => value && value.length > length ? `Must be at most ${length} characters` : '',
}
