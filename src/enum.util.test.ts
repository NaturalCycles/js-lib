import { expectTypeOf } from 'expect-type'
import {
  _numberEnumEntries,
  _numberEnumEntriesReversed,
  _numberEnumValue,
  _numberEnumValueOrUndefined,
  _numberEnumKey,
  _numberEnumKeyOrUndefined,
  _numberEnumKeys,
  _numberEnumAsMap,
  _numberEnumNormalize,
  _numberEnumNormalizeOrUndefined,
  _numberEnumAsMapReversed,
  _numberEnumValues,
  _stringEnumEntries,
  _stringEnumKey,
  _stringEnumKeyOrUndefined,
  _stringEnumKeys,
  _stringEnumValues,
  _stringEnumEntriesReversed,
  _stringEnumAsMap,
  _stringEnumAsMapReversed,
} from './enum.util'

enum MyNumberEnum {
  K1 = 1,
  K2 = 2,
  K3 = 3,
}

enum MyStringEnum {
  K1_KEY = 'K1_VALUE',
  K2_KEY = 'K2_VALUE',
  K3_KEY = 'K3_VALUE',
}

// Object.keys(MyNumberEnum)
// [ '1', '2', '3', 'K1', 'K2', 'K3' ]
// Object.values(MyNumberEnum)
// [ 'K1', 'K2', 'K3', 1, 2, 3 ]
// Object.keys(MyStringEnum)
// [ 'K1_KEY', 'K2_KEY', 'K3_KEY' ]
// Object.values(MyStringEnum)
// [ 'K1_VALUE', 'K2_VALUE', 'K3_VALUE' ]

test('_numberEnumKeys', () => {
  expect(_numberEnumKeys(MyNumberEnum)).toEqual(['K1', 'K2', 'K3'])
  // expectTypeOf(_numberEnumKeys(MyNumberEnum)).toEqualTypeOf<(keyof MyNumberEnum)[]>()
  expectTypeOf(_numberEnumKeys(MyNumberEnum)).toEqualTypeOf<('K1' | 'K2' | 'K3')[]>()
  const keys = _numberEnumKeys(MyNumberEnum)
  expect(keys).not.toContain('some')
})

test('_numberEnumValues', () => {
  expect(_numberEnumValues(MyNumberEnum)).toEqual([1, 2, 3])
  expectTypeOf(_numberEnumValues(MyNumberEnum)).toEqualTypeOf<MyNumberEnum[]>()
  expectTypeOf(_numberEnumValues(MyNumberEnum)).toEqualTypeOf<number[]>()
  const values = _numberEnumValues(MyNumberEnum)
  expect(values).toContain(MyNumberEnum.K1)
})

test('_stringEnumKeys', () => {
  expect(_stringEnumKeys(MyStringEnum)).toMatchInlineSnapshot(`
    [
      "K1_KEY",
      "K2_KEY",
      "K3_KEY",
    ]
  `)
  // expectTypeOf(_stringEnumKeys(MyStringEnum)).toEqualTypeOf<string[]>()
  expectTypeOf(_stringEnumKeys(MyStringEnum)).toEqualTypeOf<('K1_KEY' | 'K2_KEY' | 'K3_KEY')[]>()
})

test('_stringEnumValues', () => {
  expect(_stringEnumValues(MyStringEnum)).toMatchInlineSnapshot(`
    [
      "K1_VALUE",
      "K2_VALUE",
      "K3_VALUE",
    ]
  `)

  expectTypeOf(_stringEnumValues(MyStringEnum)).toEqualTypeOf<MyStringEnum[]>()
})

test('_numberEnumEntries', () => {
  expect(Object.fromEntries(_numberEnumEntries(MyNumberEnum))).toMatchInlineSnapshot(`
    {
      "K1": 1,
      "K2": 2,
      "K3": 3,
    }
  `)
  expectTypeOf(_numberEnumEntries(MyNumberEnum)).toEqualTypeOf<
    ['K1' | 'K2' | 'K3', MyNumberEnum][]
  >()

  expect(_numberEnumAsMap(MyNumberEnum)).toMatchInlineSnapshot(`
    Map {
      "K1" => 1,
      "K2" => 2,
      "K3" => 3,
    }
  `)

  expect(new Map(_numberEnumEntriesReversed(MyNumberEnum))).toMatchInlineSnapshot(`
    Map {
      1 => "K1",
      2 => "K2",
      3 => "K3",
    }
  `)

  expect(_numberEnumAsMapReversed(MyNumberEnum)).toMatchInlineSnapshot(`
    Map {
      1 => "K1",
      2 => "K2",
      3 => "K3",
    }
  `)
})

test('_stringEnumEntries', () => {
  expect(Object.fromEntries(_stringEnumEntries(MyStringEnum))).toMatchInlineSnapshot(`
    {
      "K1_KEY": "K1_VALUE",
      "K2_KEY": "K2_VALUE",
      "K3_KEY": "K3_VALUE",
    }
  `)

  expect(Object.fromEntries(_stringEnumEntriesReversed(MyStringEnum))).toMatchInlineSnapshot(`
    {
      "K1_VALUE": "K1_KEY",
      "K2_VALUE": "K2_KEY",
      "K3_VALUE": "K3_KEY",
    }
  `)

  expect(_stringEnumAsMap(MyStringEnum)).toMatchInlineSnapshot(`
    Map {
      "K1_KEY" => "K1_VALUE",
      "K2_KEY" => "K2_VALUE",
      "K3_KEY" => "K3_VALUE",
    }
  `)
  expect(_stringEnumAsMapReversed(MyStringEnum)).toMatchInlineSnapshot(`
    Map {
      "K1_VALUE" => "K1_KEY",
      "K2_VALUE" => "K2_KEY",
      "K3_VALUE" => "K3_KEY",
    }
  `)
})

test('_numberEnumValue', () => {
  expect(_numberEnumValue(MyNumberEnum, 'K2')).toBe(2)
  expect(() => _numberEnumValue(MyNumberEnum, 'K4' as any)).toThrowErrorMatchingInlineSnapshot(
    `"_numberEnumValue not found for: K4"`,
  )

  expect(_numberEnumValueOrUndefined(MyNumberEnum, 'K2')).toBe(2)
  expect(_numberEnumValueOrUndefined(MyNumberEnum, 'K4' as any)).toBeUndefined()
  expect(_numberEnumValueOrUndefined(MyNumberEnum, null as any)).toBeUndefined()
  expect(_numberEnumValueOrUndefined(MyNumberEnum, undefined)).toBeUndefined()
  expect(_numberEnumValueOrUndefined(MyNumberEnum, '' as any)).toBeUndefined()
  expect(_numberEnumValueOrUndefined(MyNumberEnum, 0 as any)).toBeUndefined()
})

test('_numberEnumNormalize', () => {
  expect(_numberEnumNormalize(MyNumberEnum, 'K2')).toBe(2)
  expect(_numberEnumNormalize(MyNumberEnum, MyNumberEnum.K2)).toBe(2)

  expect(() => _numberEnumNormalize(MyNumberEnum, 4)).toThrowErrorMatchingInlineSnapshot(
    `"_numberEnumNormalize value not found for: 4"`,
  )
  expect(() => _numberEnumNormalize(MyNumberEnum, 'K4')).toThrowErrorMatchingInlineSnapshot(
    `"_numberEnumNormalize value not found for: K4"`,
  )

  expect(_numberEnumNormalizeOrUndefined(MyNumberEnum, 'K2')).toBe(2)
  expect(_numberEnumNormalizeOrUndefined(MyNumberEnum, MyNumberEnum.K2)).toBe(2)

  // Pass-through case, even if 4 is an invalid value
  expect(_numberEnumNormalizeOrUndefined(MyNumberEnum, 4)).toBe(4)

  // String types are attempted to be converted and return undefined
  expect(_numberEnumNormalizeOrUndefined(MyNumberEnum, 'K4')).toBeUndefined()
})

test('_numberEnumKey, _numberEnumKeyOrUndefined', () => {
  expect(_numberEnumKeyOrUndefined(MyNumberEnum, 'non-existing' as any)).toBeUndefined()
  expect(_numberEnumKeyOrUndefined(MyNumberEnum, MyNumberEnum.K1)).toBe('K1')
  expect(_numberEnumKeyOrUndefined(MyNumberEnum, 1)).toBe('K1')
  expect(_numberEnumKeyOrUndefined(MyNumberEnum, 'K1' as any)).toBeUndefined()

  expect(() =>
    _numberEnumKey(MyNumberEnum, 'non-existing' as any),
  ).toThrowErrorMatchingInlineSnapshot(`"_numberEnumKey not found for: non-existing"`)
  expect(() => _numberEnumKey(MyNumberEnum, 'K1' as any)).toThrowErrorMatchingInlineSnapshot(
    `"_numberEnumKey not found for: K1"`,
  )

  expect(_numberEnumKey(MyNumberEnum, MyNumberEnum.K1)).toBe('K1')
  expect(_numberEnumKey(MyNumberEnum, 1)).toBe('K1')
})

test('_stringEnumKey', () => {
  expect(_stringEnumKeyOrUndefined(MyStringEnum, 'non-existing' as any)).toBeUndefined()
  expect(() =>
    _stringEnumKey(MyStringEnum, 'non-existing' as any),
  ).toThrowErrorMatchingInlineSnapshot(`"_stringEnumKey not found for: non-existing"`)
  expect(_stringEnumKeyOrUndefined(MyStringEnum, 'K1_VALUE')).toBe('K1_KEY')
  expect(_stringEnumKey(MyStringEnum, 'K2_VALUE')).toBe('K2_KEY')
})
