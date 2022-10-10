import {
  _numberEnumEntries,
  _numberEnumInverse,
  _numberEnumInverseNullable,
  _numberEnumKey,
  _numberEnumKeyNullable,
  _numberEnumKeys,
  _numberEnumNormalize,
  _numberEnumNormalizeNullable,
  _numberEnumValues,
  _stringEnumEntries,
  _stringEnumKeys,
  _stringEnumValues,
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

test('_numberEnumKeys', () => {
  expect(_numberEnumKeys(MyNumberEnum)).toEqual(['K1', 'K2', 'K3'])
  expect(_numberEnumKeys(MyStringEnum)).toMatchInlineSnapshot(`
    [
      "K1_VALUE",
      "K2_VALUE",
      "K3_VALUE",
    ]
  `)
})

test('_numberEnumValues', () => {
  expect(_numberEnumValues(MyNumberEnum)).toEqual([1, 2, 3])
  expect(_numberEnumValues(MyStringEnum)).toEqual([])
})

test('_stringEnumKeys', () => {
  expect(_stringEnumKeys(MyNumberEnum as any)).toMatchInlineSnapshot(`
    [
      "1",
      "2",
      "3",
      "K1",
      "K2",
      "K3",
    ]
  `)
  expect(_stringEnumKeys(MyStringEnum)).toMatchInlineSnapshot(`
    [
      "K1_KEY",
      "K2_KEY",
      "K3_KEY",
    ]
  `)
})

test('_stringEnumValues', () => {
  expect(_stringEnumValues(MyNumberEnum as any)).toMatchInlineSnapshot(`
    [
      "K1",
      "K2",
      "K3",
    ]
  `)
  expect(_stringEnumValues(MyStringEnum)).toMatchInlineSnapshot(`
    [
      "K1_VALUE",
      "K2_VALUE",
      "K3_VALUE",
    ]
  `)
})

test('_numberEnumEntries', () => {
  expect(Object.fromEntries(_numberEnumEntries(MyNumberEnum))).toMatchInlineSnapshot(`
    {
      "K1": 1,
      "K2": 2,
      "K3": 3,
    }
  `)

  expect(Object.fromEntries(_numberEnumEntries(MyStringEnum))).toMatchInlineSnapshot(`
    {
      "K1_VALUE": undefined,
      "K2_VALUE": undefined,
      "K3_VALUE": undefined,
    }
  `)
})

test('_stringEnumEntries', () => {
  expect(Object.fromEntries(_stringEnumEntries(MyNumberEnum as any))).toMatchInlineSnapshot(`
    {
      "1": "K1",
      "2": "K2",
      "3": "K3",
      "K1": 1,
      "K2": 2,
      "K3": 3,
    }
  `)

  expect(Object.fromEntries(_stringEnumEntries(MyStringEnum))).toMatchInlineSnapshot(`
    {
      "K1_KEY": "K1_VALUE",
      "K2_KEY": "K2_VALUE",
      "K3_KEY": "K3_VALUE",
    }
  `)
})

test('_numberEnumInverse', () => {
  expect(_numberEnumInverse(MyNumberEnum, 'K2')).toBe(2)
  expect(() => _numberEnumInverse(MyNumberEnum, 'K4')).toThrowErrorMatchingInlineSnapshot(
    `"_numberEnumInverse value not found for: K4"`,
  )

  expect(_numberEnumInverseNullable(MyNumberEnum, 'K2')).toBe(2)
  expect(_numberEnumInverseNullable(MyNumberEnum, 'K4')).toBeUndefined()
  expect(_numberEnumInverseNullable(MyNumberEnum, null as any)).toBeUndefined()
  expect(_numberEnumInverseNullable(MyNumberEnum, undefined)).toBeUndefined()
  expect(_numberEnumInverseNullable(MyNumberEnum, '')).toBeUndefined()
  expect(_numberEnumInverseNullable(MyNumberEnum, 0 as any)).toBeUndefined()
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

  expect(_numberEnumNormalizeNullable(MyNumberEnum, 'K2')).toBe(2)
  expect(_numberEnumNormalizeNullable(MyNumberEnum, MyNumberEnum.K2)).toBe(2)

  // Pass-through case, even if 4 is an invalid value
  expect(_numberEnumNormalizeNullable(MyNumberEnum, 4)).toBe(4)

  // String types are attempted to be converted and return undefined
  expect(_numberEnumNormalizeNullable(MyNumberEnum, 'K4')).toBeUndefined()
})

test('_numberEnumKey, _numberEnumKeyNullable', () => {
  expect(_numberEnumKeyNullable(MyNumberEnum, 'non-existing' as any)).toBeUndefined()
  expect(_numberEnumKeyNullable(MyNumberEnum, MyNumberEnum.K1)).toBe('K1')
  expect(_numberEnumKeyNullable(MyNumberEnum, 1)).toBe('K1')
  expect(_numberEnumKeyNullable(MyNumberEnum, 'K1' as any)).toBeUndefined()

  expect(() =>
    _numberEnumKey(MyNumberEnum, 'non-existing' as any),
  ).toThrowErrorMatchingInlineSnapshot(`"_enumKey value not found for: non-existing"`)
  expect(() => _numberEnumKey(MyNumberEnum, 'K1' as any)).toThrowErrorMatchingInlineSnapshot(
    `"_enumKey value not found for: K1"`,
  )

  expect(_numberEnumKey(MyNumberEnum, MyNumberEnum.K1)).toBe('K1')
  expect(_numberEnumKey(MyNumberEnum, 1)).toBe('K1')
})
