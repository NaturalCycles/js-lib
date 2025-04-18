import type { AnyObject } from './types.js'

/**
 * Convert any object to FormData.
 * Please note that every key and value of FormData is `string`.
 * Even if you pass a number - it'll be converted to string.
 * Think URLSearchParams.
 */
export function objectToFormData(obj: AnyObject = {}): FormData {
  const fd = new FormData()
  for (const [k, v] of Object.entries(obj)) {
    fd.append(k, v)
  }
  return fd
}

export function formDataToObject<T extends AnyObject>(formData: FormData): T {
  return Object.fromEntries(formData) as T
}
