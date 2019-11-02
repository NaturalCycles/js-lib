/**
 * Allows to define error-controlling behaviour for batch operations.
 *
 * @default is THROW_IMMEDIATELY in most cases
 */
export enum ErrorMode {
  /**
   * Usually a default behaviour, similar as "exit early".
   */
  THROW_IMMEDIATELY = 'THROW_IMMEDIATELY',

  /**
   * Don't throw on errors, but collect them and throw as AggregatedError in the end.
   */
  THROW_AGGREGATED = 'THROW_AGGREGATED',

  /**
   * Completely suppress errors, do not aggregate nor throw anything. Resilient mode.
   */
  SUPPRESS = 'SUPPRESS',
}
