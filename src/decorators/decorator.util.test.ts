import { expect, test } from 'vitest'
import type { InstanceId } from '../types'
import { _getArgsSignature, _getMethodSignature } from './decorator.util'

class C implements InstanceId {
  instanceId!: string

  method1(a: string, _b: string, _c: number, _d: any): string {
    return a
  }
}

test('getMethodSignature', () => {
  const c = new C()
  expect(_getMethodSignature(c, 'method1')).toBe('C.method1')

  c.instanceId = 'instance_1'
  expect(_getMethodSignature(c, 'method1')).toBe('C#instance_1.method1')
})

test('getArgsSignature', () => {
  expect(_getArgsSignature()).toBe('')
  expect(_getArgsSignature([])).toBe('')
  expect(_getArgsSignature([''])).toBe('')

  expect(_getArgsSignature(['a', 'b', 5])).toBe('a, b, 5')

  const args = [5, 3, { a: 'a' }, { long: 'longer longer value here' }]
  expect(_getArgsSignature(args)).toBe('5, 3, {"a":"a"}, ...')
})
