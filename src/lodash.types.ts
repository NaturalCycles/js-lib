export type PropertyName = string | number | symbol

export type RecursiveArray<T> = (T | RecursiveArray<T>)[]

export type Many<T> = T | readonly T[]
export type PropertyPath = Many<PropertyName>
