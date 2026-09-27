import { convert, format, UnitError } from './units.ts'

const [value, from, to] = process.argv.slice(2)
try {
  console.log(format(convert(Number(value), String(from), String(to))))
} catch (e) {
  if (e instanceof UnitError) {
    console.error(e.message)
    process.exit(1)
  }
  throw e
}
