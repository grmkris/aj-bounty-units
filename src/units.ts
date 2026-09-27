export class UnitError extends Error {}

export type Unit = string

/** Converts `value` from one unit to another of the same quantity. */
export function convert(value: number, from: Unit, to: Unit): number {
  throw new UnitError(`not implemented: ${value} ${from} -> ${to}`)
}

/** At most 6 significant digits, no trailing zeros. */
export function format(value: number): string {
  return String(value)
}
