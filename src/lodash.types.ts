export type NotVoid = unknown
export type PropertyName = string | number | symbol
export type PartialShallow<T> = {
  [P in keyof T]?: T[P] extends object ? object : T[P]
}
export type IterateeShorthand<T> = PropertyName | [PropertyName, any] | PartialShallow<T>
export type ValueIteratee<T> = ((value: T) => NotVoid) | IterateeShorthand<T>
export type StringIteratee<T> = ((value: T) => string | undefined) | PropertyName
export type ObjectIterator<TObject, TResult> = (
  value: TObject[keyof TObject],
  key: string,
  obj: TObject,
) => TResult
export type ObjectKVIterator<TObject, TResult> = (
  key: string,
  value: TObject[keyof TObject],
  obj: TObject,
) => TResult

export interface RecursiveArray<T> extends Array<T | RecursiveArray<T>> {}

export type Many<T> = T | ReadonlyArray<T>
export type PropertyPath = Many<PropertyName>
