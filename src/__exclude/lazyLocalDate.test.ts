import { LazyLocalDate } from './lazyLocalDate'

test('basic', () => {
  const s = '1984-06-21'
  const d = new LazyLocalDate(s)
  console.log(d.add(1, 'd').toString())
})
