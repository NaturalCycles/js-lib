import { _getTargetMethodSignature } from './decorator.util'

export interface PromiseDecoratorCfg<RES = any, PARAMS = any> {
  decoratorName: string

  /**
   * Called BEFORE the original function.
   * Returns void.
   */
  beforeFn?: (r: PromiseDecoratorResp<PARAMS>) => void

  /**
   * Called just AFTER the original function.
   * The output of this hook will be passed further,
   * so, pay attention to pass through (or modify) the result.
   */
  thenFn?: (r: PromiseDecoratorResp<PARAMS> & { res: RES }) => RES

  /**
   * Called on Promise.reject.
   * If `catchFn` is not present - will re-throw the error,
   * which will most likely be "unhandledRejection" (unless there's another higher-level @Decorator that will catch it).
   * If `catchFn` is present - it's responsible for handling or re-throwing the error.
   * Whatever `catchFn` returns - passed to the original output.
   */
  catchFn?: (r: PromiseDecoratorResp<PARAMS> & { err: any }) => RES

  /**
   * Fires AFTER thenFn / catchFn, like a usual Promise.finally().
   * Doesn't have access to neither res nor err (same as Promise.finally).
   */
  finallyFn?: (r: PromiseDecoratorResp<PARAMS>) => any
}

export interface PromiseDecoratorResp<PARAMS> {
  decoratorParams: PARAMS
  args: any[]
  started: number
  target: any
  key: string
  decoratorName: string
}

/**
 * @example
 * // decorators.ts
 * export const BlockingLoader = () => _createPromiseDecorator({
 *   decoratorName: 'BlockingLoader',
 *   beforeFn: () => store.commit('setBlockingLoader'),
 *   finallyFn: () => store.commit('setBlockingLoader', false),
 * })
 *
 * @experimental
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function _createPromiseDecorator<RES = any, PARAMS = any>(
  cfg: PromiseDecoratorCfg<RES, PARAMS>,
  decoratorParams: PARAMS = {} as any,
): MethodDecorator {
  const { decoratorName } = cfg

  return function decoratorFunction(
    target: any,
    propertyKey: string | symbol,
    pd: PropertyDescriptor,
  ): PropertyDescriptor {
    // console.log(`@Decorator.${cfg.decoratorName} called: ` + propertyKey, pd, target)
    const originalMethod = pd.value
    const key = String(propertyKey)
    const methodSignature = _getTargetMethodSignature(target, key)

    pd.value = async function (this: typeof target, ...args: any[]): Promise<any> {
      // console.log(`@${cfg.decoratorName} called inside function`)
      const started = Date.now()

      return (
        Promise.resolve()
          // Before function
          .then(() => {
            // console.log(`@${cfg.decoratorName} Before`)
            if (cfg.beforeFn) {
              return cfg.beforeFn({
                decoratorParams,
                args,
                key,
                target,
                decoratorName,
                started,
              })
            }
          })
          // Original function
          .then(() => originalMethod.apply(this, args))
          .then(res => {
            // console.log(`${cfg.decoratorName} After`)
            const resp: PromiseDecoratorResp<PARAMS> = {
              decoratorParams,
              args,
              key,
              target,
              decoratorName,
              started,
            }

            if (cfg.thenFn) {
              res = cfg.thenFn({
                ...resp,
                res,
              })
            }

            cfg.finallyFn?.(resp)

            return res
          })
          .catch(err => {
            console.error(`@${decoratorName} ${methodSignature} catch:`, err)

            const resp: PromiseDecoratorResp<PARAMS> = {
              decoratorParams,
              args,
              key,
              target,
              decoratorName,
              started,
            }

            let handled = false

            if (cfg.catchFn) {
              cfg.catchFn({
                ...resp,
                err,
              })
              handled = true
            }

            cfg.finallyFn?.(resp)

            if (!handled) {
              throw err // rethrow
            }
          })
        // es2018 only
        // .finally(() => {})
      )
    }

    return pd
  }
}
