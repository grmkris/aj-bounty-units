export class UnitError extends Error {}

export type Unit = string

const LENGTH_IN_METRES: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  mi: 1609.344,
}

const MASS_IN_GRAMS: Record<string, number> = {
  g: 1,
  kg: 1000,
  lb: 453.59237,
  oz: 453.59237 / 16,
}

const TEMPERATURE = new Set(['C', 'F', 'K'])

function quantityOf(unit: Unit): 'length' | 'mass' | 'temperature' | null {
  if (unit in LENGTH_IN_METRES) return 'length'
  if (unit in MASS_IN_GRAMS) return 'mass'
  if (TEMPERATURE.has(unit)) return 'temperature'
  return null
}

function toKelvin(value: number, unit: Unit): number {
  if (unit === 'C') return value + 273.15
  if (unit === 'F') return (value - 32) * (5 / 9) + 273.15
  return value
}

function fromKelvin(kelvin: number, unit: Unit): number {
  if (unit === 'C') return kelvin - 273.15
  if (unit === 'F') return (kelvin - 273.15) * (9 / 5) + 32
  return kelvin
}

/** Converts `value` from one unit to another of the same quantity. */
export function convert(value: number, from: Unit, to: Unit): number {
  const fromQty = quantityOf(from)
  const toQty = quantityOf(to)
  if (fromQty === null || toQty === null) {
    throw new UnitError(`unknown unit: ${fromQty === null ? from : to}`)
  }
  if (fromQty !== toQty) {
    throw new UnitError(`cannot convert ${from} to ${to}`)
  }
  if (from === to) return value
  if (fromQty === 'length') {
    return (value * LENGTH_IN_METRES[from]!) / LENGTH_IN_METRES[to]!
  }
  if (fromQty === 'mass') {
    return (value * MASS_IN_GRAMS[from]!) / MASS_IN_GRAMS[to]!
  }
  return fromKelvin(toKelvin(value, from), to)
}

function expandScientific(raw: string): string {
  const match = raw.match(/^([+-]?)(\d)(?:\.(\d+))?[eE]([+-]?\d+)$/)
  if (!match) return raw
  const sign = match[1] ?? ''
  const digits = (match[2] ?? '') + (match[3] ?? '')
  const exp = Number(match[4])
  const fracLength = (match[3] ?? '').length
  if (exp >= 0) {
    const zeros = exp - fracLength
    if (zeros >= 0) return sign + digits + '0'.repeat(zeros)
    const pos = exp + 1
    return sign + digits.slice(0, pos) + '.' + digits.slice(pos)
  }
  return sign + '0.' + '0'.repeat(-exp - 1) + digits
}

function stripTrailingZeros(raw: string): string {
  const expanded = /[eE]/.test(raw) ? expandScientific(raw) : raw
  if (!expanded.includes('.')) return expanded
  return expanded.replace(/0+$/, '').replace(/\.$/, '')
}

/** At most 6 significant digits, no trailing zeros. */
export function format(value: number): string {
  if (value === 0) return '0'
  return stripTrailingZeros(value.toPrecision(6))
}
