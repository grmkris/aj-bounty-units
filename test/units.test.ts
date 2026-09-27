import { describe, expect, it } from 'bun:test'
import { convert, format, UnitError } from '../src/units.ts'

const close = (a: number, b: number) => expect(Math.abs(a - b)).toBeLessThan(1e-9 * Math.max(1, Math.abs(b)))

describe('convert', () => {
  it('length', () => {
    close(convert(1, 'km', 'm'), 1000)
    close(convert(1, 'mi', 'km'), 1.609344)
    close(convert(12, 'in', 'ft'), 1)
    close(convert(254, 'mm', 'in'), 10)
  })
  it('mass', () => {
    close(convert(1, 'lb', 'g'), 453.59237)
    close(convert(16, 'oz', 'lb'), 1)
    close(convert(2.5, 'kg', 'g'), 2500)
  })
  it('temperature', () => {
    close(convert(100, 'C', 'F'), 212)
    close(convert(32, 'F', 'C'), 0)
    close(convert(0, 'K', 'C'), -273.15)
    close(convert(-40, 'F', 'C'), -40)
  })
  it('same unit is identity', () => {
    close(convert(3.3, 'ft', 'ft'), 3.3)
  })
  it('refuses unknown units and mixed quantities', () => {
    expect(() => convert(1, 'km', 'kg')).toThrow(UnitError)
    expect(() => convert(1, 'parsec', 'm')).toThrow(UnitError)
    expect(() => convert(1, 'C', 'm')).toThrow(UnitError)
  })
})

describe('format', () => {
  it('six significant digits, no trailing zeros', () => {
    expect(format(1.609344)).toBe('1.60934')
    expect(format(2)).toBe('2')
    expect(format(1000)).toBe('1000')
    expect(format(0.000123456789)).toBe('0.000123457')
    expect(format(-273.15)).toBe('-273.15')
  })
})
