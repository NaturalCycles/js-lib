const UNIQUE_VALUE = Symbol('unique')

/**
 * Returns the state of the Promise, one of:
 * - pending
 * - resolved
 * - rejected
 *
 * Based on: https://makandracards.com/makandra/46681-javascript-how-to-query-the-state-of-a-native-promise
 */
export async function pState (p: Promise<any>): Promise<'resolved' | 'rejected' | 'pending'> {
  return Promise.race([p, Promise.resolve(UNIQUE_VALUE)]).then(
    v => {
      return v === UNIQUE_VALUE ? 'pending' : 'resolved'
    },
    () => 'rejected' as const,
  )
}
