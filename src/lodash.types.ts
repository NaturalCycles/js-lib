export type PropertyName = string | number | symbol

export type ObjectMapper<OBJ, OUT> = (key: string, value: OBJ[keyof OBJ], obj: OBJ) => OUT

export type ObjectPredicate<OBJ> = (key: keyof OBJ, value: OBJ[keyof OBJ], obj: OBJ) => boolean

export type RecursiveArray<T> = (T | RecursiveArray<T>)[]

export type Many<T> = T | readonly T[]
export type PropertyPath = Many<PropertyName>

export type KeyValueTuple<K, V> = [K, V]
