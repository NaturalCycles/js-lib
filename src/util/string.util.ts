export function capitalizeFirstLetter (s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function lowercaseFirstLetter (s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1)
}

export function removeWhitespace (s: string): string {
  return s.replace(/\s/g, '')
}
