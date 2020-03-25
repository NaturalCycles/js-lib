/**
 * expectResults(v => JSON.stringify(v), [
 *   1,
 *   2,
 *   3
 * ]).toMatchSnapshot()
 */
export function expectResults(
  fn: (...args: any[]) => any,
  values: any[],
): jest.JestMatchers<Map<any, any>> {
  return expect(new Map(values.map(v => [v, fn(v)])))
}
