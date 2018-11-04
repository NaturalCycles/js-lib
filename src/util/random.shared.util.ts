class RandomSharedUtil {
  randomInt (minIncl: number, maxIncl: number): number {
    return Math.floor(Math.random() * (maxIncl - minIncl + 1) + minIncl)
  }
}

export const randomSharedUtil = new RandomSharedUtil()
