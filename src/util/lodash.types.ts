export type NotVoid = unknown
export type PropertyName = string | number | symbol
export type PartialShallow<T> = {
  [P in keyof T]?: T[P] extends object ? object : T[P]
}
export type IterateeShorthand<T> = PropertyName | [PropertyName, any] | PartialShallow<T>
export type ValueIteratee<T> = ((value: T) => NotVoid) | IterateeShorthand<T>

export interface RecursiveArray<T> extends Array<T | RecursiveArray<T>> {}

export type Many<T> = T | ReadonlyArray<T>
export type PropertyPath = Many<PropertyName>
