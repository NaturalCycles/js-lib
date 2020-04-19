export function _randomInt(minIncl: number, maxIncl: number): number {
  return Math.floor(Math.random() * (maxIncl - minIncl + 1) + minIncl)
}

// todo: _.random to support floats

export function _inRange(x: number, minIncl: number, maxExcl: number): boolean {
  return x >= minIncl && x < maxExcl
}
