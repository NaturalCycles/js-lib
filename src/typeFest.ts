/* eslint-disable */

/**
 Matches any [primitive value](https://developer.mozilla.org/en-US/docs/Glossary/Primitive).

 @category Basic
 */
export type Primitive = null | undefined | string | number | boolean | symbol | bigint

/**
 Flatten the type output to improve type hints shown in editors.
 */
export type Simplify<T> = { [KeyType in keyof T]: T[KeyType] }

/**
 Create a type from an object type without certain keys.

 This type is a stricter version of [`Omit`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-5.html#the-omit-helper-type). The `Omit` type does not restrict the omitted keys to be keys present on the given type, while `Except` does. The benefits of a stricter type are avoiding typos and allowing the compiler to pick up on rename refactors automatically.

 This type was proposed to the TypeScript team, which declined it, saying they prefer that libraries implement stricter versions of the built-in types ([microsoft/TypeScript#30825](https://github.com/microsoft/TypeScript/issues/30825#issuecomment-523668235)).

 @example
 ```
 import {Except} from 'type-fest';

 type Foo = {
	a: number;
	b: string;
	c: boolean;
};

 type FooWithoutA = Except<Foo, 'a' | 'c'>;
 //=> {b: string};
 ```

 @category Utilities
 */
export type Except<ObjectType, KeysType extends keyof ObjectType> = Pick<
  ObjectType,
  Exclude<keyof ObjectType, KeysType>
>

/**
 Convert `object`s, `Map`s, `Set`s, and `Array`s and all of their keys/elements into immutable structures recursively.

 This is useful when a deeply nested structure needs to be exposed as completely immutable, for example, an imported JSON module or when receiving an API response that is passed around.

 Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/13923) if you want to have this type as a built-in in TypeScript.

 @example
 ```
 // data.json
 {
	"foo": ["bar"]
}

 // main.ts
 import {ReadonlyDeep} from 'type-fest';
 import dataJson = require('./data.json');

 const data: ReadonlyDeep<typeof dataJson> = dataJson;

 export default data;

 // test.ts
 import data from './main';

 data.foo.push('bar');
 //=> error TS2339: Property 'push' does not exist on type 'readonly string[]'
 ```

 @category Utilities
 */
export type ReadonlyDeep<T> = T extends Primitive | ((...args: any[]) => unknown)
  ? T
  : T extends ReadonlyMap<infer KeyType, infer ValueType>
  ? ReadonlyMapDeep<KeyType, ValueType>
  : T extends ReadonlySet<infer ItemType>
  ? ReadonlySetDeep<ItemType>
  : T extends object
  ? ReadonlyObjectDeep<T>
  : unknown

/**
 Same as `ReadonlyDeep`, but accepts only `ReadonlyMap`s as inputs. Internal helper for `ReadonlyDeep`.
 */
interface ReadonlyMapDeep<KeyType, ValueType>
  extends ReadonlyMap<ReadonlyDeep<KeyType>, ReadonlyDeep<ValueType>> {}

/**
 Same as `ReadonlyDeep`, but accepts only `ReadonlySet`s as inputs. Internal helper for `ReadonlyDeep`.
 */
interface ReadonlySetDeep<ItemType> extends ReadonlySet<ReadonlyDeep<ItemType>> {}

/**
 Same as `ReadonlyDeep`, but accepts only `object`s as inputs. Internal helper for `ReadonlyDeep`.
 */
type ReadonlyObjectDeep<ObjectType extends object> = {
  readonly [KeyType in keyof ObjectType]: ReadonlyDeep<ObjectType[KeyType]>
}

type Merge_<FirstType, SecondType> = Except<FirstType, Extract<keyof FirstType, keyof SecondType>> &
  SecondType

/**
 Merge two types into a new type. Keys of the second type overrides keys of the first type.

 @example
 ```
 import {Merge} from 'type-fest';

 type Foo = {
	a: number;
	b: string;
};

 type Bar = {
	b: number;
};

 const ab: Merge<Foo, Bar> = {a: 1, b: 2};
 ```

 @category Utilities
 */
export type Merge<FirstType, SecondType> = Simplify<Merge_<FirstType, SecondType>>

/**
 Create a type that represents either the value or the value wrapped in `PromiseLike`.

 Use-cases:
 - A function accepts a callback that may either return a value synchronously or may return a promised value.
 - This type could be the return type of `Promise#then()`, `Promise#catch()`, and `Promise#finally()` callbacks.

 Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/31394) if you want to have this type as a built-in in TypeScript.

 @example
 ```
 import {Promisable} from 'type-fest';

 async function logger(getLogEntry: () => Promisable<string>): Promise<void> {
    const entry = await getLogEntry();
    console.log(entry);
}

 logger(() => 'foo');
 logger(() => Promise.resolve('bar'));

 @category Utilities
 ```
 */
export type Promisable<T> = T | PromiseLike<T>

/**
 Returns the type that is wrapped inside a `Promise` type.
 If the type is a nested Promise, it is unwrapped recursively until a non-Promise type is obtained.
 If the type is not a `Promise`, the type itself is returned.

 @example
 ```
 import {PromiseValue} from 'type-fest';

 type AsyncData = Promise<string>;
 let asyncData: PromiseValue<AsyncData> = Promise.resolve('ABC');

 type Data = PromiseValue<AsyncData>;
 let data: Data = await asyncData;

 // Here's an example that shows how this type reacts to non-Promise types.
 type SyncData = PromiseValue<string>;
 let syncData: SyncData = getSyncData();

 // Here's an example that shows how this type reacts to recursive Promise types.
 type RecursiveAsyncData = Promise<Promise<string> >;
 let recursiveAsyncData: PromiseValue<RecursiveAsyncData> = Promise.resolve(Promise.resolve('ABC'));
 ```

 @category Utilities
 */
export type PromiseValue<PromiseType, Otherwise = PromiseType> = PromiseType extends Promise<
  infer Value
>
  ? { 0: PromiseValue<Value>; 1: Value }[PromiseType extends Promise<unknown> ? 0 : 1]
  : Otherwise

/**
 Extract the keys from a type where the value type of the key extends the given `Condition`.
 Internally this is used for the `ConditionalPick` and `ConditionalExcept` types.
 @example
 ```
 import {ConditionalKeys} from 'type-fest';
 interface Example {
	a: string;
	b: string | number;
	c?: string;
	d: {};
}
 type StringKeysOnly = ConditionalKeys<Example, string>;
 //=> 'a'
 ```
 To support partial types, make sure your `Condition` is a union of undefined (for example, `string | undefined`) as demonstrated below.
 @example
 ```
 type StringKeysAndUndefined = ConditionalKeys<Example, string | undefined>;
 //=> 'a' | 'c'
 ```
 @category Utilities
 */
export type ConditionalKeys<Base, Condition> = NonNullable<
  // Wrap in `NonNullable` to strip away the `undefined` type from the produced union.
  {
    // Map through all the keys of the given base type.
    [Key in keyof Base]: Base[Key] extends Condition // Pick only keys with types extending the given `Condition` type.
      ? // Retain this key since the condition passes.
        Key
      : // Discard this key since the condition fails.
        never

    // Convert the produced object into a union type of the keys which passed the conditional test.
  }[keyof Base]
>

/**
 Exclude keys from a shape that matches the given `Condition`.
 This is useful when you want to create a new type with a specific set of keys from a shape. For example, you might want to exclude all the primitive properties from a class and form a new shape containing everything but the primitive properties.
 @example
 ```
 import {Primitive, ConditionalExcept} from 'type-fest';
 class Awesome {
	name: string;
	successes: number;
	failures: bigint;
	run() {}
}
 type ExceptPrimitivesFromAwesome = ConditionalExcept<Awesome, Primitive>;
 //=> {run: () => void}
 ```
 @example
 ```
 import {ConditionalExcept} from 'type-fest';
 interface Example {
	a: string;
	b: string | number;
	c: () => void;
	d: {};
}
 type NonStringKeysOnly = ConditionalExcept<Example, string>;
 //=> {b: string | number; c: () => void; d: {}}
 ```
 @category Utilities
 */
export type ConditionalExcept<Base, Condition> = Except<Base, ConditionalKeys<Base, Condition>>

/**
 Pick keys from the shape that matches the given `Condition`.
 This is useful when you want to create a new type from a specific subset of an existing type. For example, you might want to pick all the primitive properties from a class and form a new automatically derived type.
 @example
 ```
 import {Primitive, ConditionalPick} from 'type-fest';
 class Awesome {
	name: string;
	successes: number;
	failures: bigint;
	run() {}
}
 type PickPrimitivesFromAwesome = ConditionalPick<Awesome, Primitive>;
 //=> {name: string; successes: number; failures: bigint}
 ```
 @example
 ```
 import {ConditionalPick} from 'type-fest';
 interface Example {
	a: string;
	b: string | number;
	c: () => void;
	d: {};
}
 type StringKeysOnly = ConditionalPick<Example, string>;
 //=> {a: string}
 ```
 @category Utilities
 */
export type ConditionalPick<Base, Condition> = Pick<Base, ConditionalKeys<Base, Condition>>

/**
 Matches a [`class` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).
 @category Basic
 */
export type Class<T = any> = new (...args: any[]) => T

/**
 Matches any [typed array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), like `Uint8Array` or `Float64Array`.
 */
export type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array

declare global {
  interface SymbolConstructor {
    readonly observable: symbol
  }
}

/**
 Matches a value that is like an [Observable](https://github.com/tc39/proposal-observable).
 */
export interface ObservableLike {
  subscribe(observer: (value: unknown) => void): void
  [Symbol.observable](): ObservableLike
}
