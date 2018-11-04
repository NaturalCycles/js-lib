/*
Inspired by Bluebird Promise.props() and https://github.com/sindresorhus/p-props

Improvements:

- Exported as { pProps }, so IDE auto-completion works
- Simpler: no support for Map, Mapper, Options
- Included Typescript typings (no need for @types/p-props)
 */

export async function pProps<T> (input: { [K in keyof T]: T[K] | Promise<T[K]> }): Promise<T> {
  const keys = Object.keys(input)
  const values = await Promise.all(Object.values(input))

  const r = {} as T
  values.forEach((v, i) => {
    r[keys[i]] = v
  })
  return r
}
