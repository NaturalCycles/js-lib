export function gb(b: number): number {
  return Math.round(b / (1024 * 1024 * 1024))
}

export function mb(b: number): number {
  return Math.round(b / (1024 * 1024))
}

export function kb(b: number): number {
  return Math.round(b / 1024)
}

/**
 * Byte size to Human byte size string
 */
export function hb(b = 0): string {
  if (b < 800) return `${Math.round(b)} byte(s)`
  if (b < 800 * 1024) return `${Math.round(b / 1024)} Kb`
  if (b < 800 * 1024 * 1024) return `${Math.round(b / 1024 / 1024)} Mb`
  return `${Math.round(b / 1024 / 1024 / 1024)} Gb`
}
