export class UnitError extends Error {}

export type Unit = string

type UnitDefinition = {
  quantity: 'length' | 'mass' | 'temperature'
  scale: number
  offset: number
}

// Base units are metres, grams and degrees Celsius. Subtract the unit's
// offset before scaling to its base unit (e.g. Fahrenheit: (value - 32) * 5/9).
const units = new Map<Unit, UnitDefinition>([
  ['mm', { quantity: 'length', scale: 0.001, offset: 0 }],
  ['cm', { quantity: 'length', scale: 0.01, offset: 0 }],
  ['m', { quantity: 'length', scale: 1, offset: 0 }],
  ['km', { quantity: 'length', scale: 1000, offset: 0 }],
  ['in', { quantity: 'length', scale: 0.0254, offset: 0 }],
  ['ft', { quantity: 'length', scale: 0.3048, offset: 0 }],
  ['mi', { quantity: 'length', scale: 1609.344, offset: 0 }],
  ['g', { quantity: 'mass', scale: 1, offset: 0 }],
  ['kg', { quantity: 'mass', scale: 1000, offset: 0 }],
  ['lb', { quantity: 'mass', scale: 453.59237, offset: 0 }],
  ['oz', { quantity: 'mass', scale: 453.59237 / 16, offset: 0 }],
  ['C', { quantity: 'temperature', scale: 1, offset: 0 }],
  ['F', { quantity: 'temperature', scale: 5 / 9, offset: 32 }],
  ['K', { quantity: 'temperature', scale: 1, offset: 273.15 }],
])

/** Converts `value` from one unit to another of the same quantity. */
export function convert(value: number, from: Unit, to: Unit): number {
  const source = units.get(from)
  const target = units.get(to)
  if (!source) throw new UnitError(`Unknown unit: ${from}`)
  if (!target) throw new UnitError(`Unknown unit: ${to}`)
  if (source.quantity !== target.quantity) {
    throw new UnitError(`Cannot convert ${from} to ${to}: different quantities`)
  }
  if (from === to) return value

  return (value - source.offset) * (source.scale / target.scale) + target.offset
}

/** At most 6 significant digits, no trailing zeros. */
export function format(value: number): string {
  return String(Number(value.toPrecision(6)))
}
