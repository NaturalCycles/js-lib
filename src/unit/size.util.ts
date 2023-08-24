export function _gb(b: number): number {
  return Math.round(b / 1024 ** 3)
}

export function _mb(b: number): number {
  return Math.round(b / 1024 ** 2)
}

export function _kb(b: number): number {
  return Math.round(b / 1024)
}

/**
 * Byte size to Human byte size string
 */
export function _hb(b = 0): string {
  if (b < 1024) return `${Math.round(b)} byte(s)`
  if (b < 1024 ** 2) return `${(b / 1024).toPrecision(3)} Kb`
  if (b < 1024 ** 3) return `${(b / 1024 ** 2).toPrecision(3)} Mb`
  if (b < 1024 ** 4) return `${(b / 1024 ** 3).toPrecision(3)} Gb`
  if (b < 1024 ** 5) return `${(b / 1024 ** 4).toPrecision(3)} Tb`
  return `${Math.round(b / 1024 ** 4)} Tb`
}

/**
 * hc stands for "human count", similar to "human bytes" `_hb` function.
 * Helpful to print big numbers, as it adds `K` (kilo), `M` (mega), etc to make
 * them more readable.
 */
export function _hc(c = 0): string {
  if (c < 10 ** 4) return String(c)
  if (c < 10 ** 6) return (c / 10 ** 3).toPrecision(3) + ' K'
  if (c < 10 ** 9) return (c / 10 ** 6).toPrecision(3) + ' M' // million
  if (c < 10 ** 12) return (c / 10 ** 9).toPrecision(3) + ' B' // billion
  if (c < 10 ** 15) return (c / 10 ** 12).toPrecision(3) + ' T' // trillion
  return Math.round(c / 10 ** 12) + ' T'
}
