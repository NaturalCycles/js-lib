import { pDelay } from './pDelay'
import { FilterFn, pFilter } from './pFilter'

const input = [10, 20, 30]
const filterFn: FilterFn<number> = ms => pDelay(ms).then(() => ms > 15)

test('pFilter', async () => {
  const r = await pFilter(input, filterFn)
  // console.log(r)
  expect(r).toEqual([20, 30])
})
