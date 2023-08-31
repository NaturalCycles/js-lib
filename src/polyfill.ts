export function polyfillDispose(): void {
  // @ts-expect-error polyfill
  Symbol.dispose ??= Symbol('Symbol.dispose')
  // @ts-expect-error polyfill
  Symbol.asyncDispose ??= Symbol('Symbol.asyncDispose')
}
