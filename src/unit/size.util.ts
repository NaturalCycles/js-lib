export function _gb(b: number): number {
  return Math.round(b / (1024 * 1024 * 1024))
}

export function _mb(b: number): number {
  return Math.round(b / (1024 * 1024))
}

export function _kb(b: number): number {
  return Math.round(b / 1024)
}

/**
 * Byte size to Human byte size string
 */
export function _hb(b = 0): string {
  if (b < 800) return `${Math.round(b)} byte(s)`
  if (b < 800 * 1024) return `${Math.round(b / 1024)} Kb`
  if (b < 800 * 1024 * 1024) return `${Math.round(b / 1024 / 1024)} Mb`
  return `${Math.round(b / 1024 / 1024 / 1024)} Gb`
}
