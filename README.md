# aj-bounty-units

A unit converter library and CLI (`bun src/cli.ts 5 km mi`). The API is fixed; the conversions are not written yet.

## Spec

`convert(value, from, to)` for these units, throwing `UnitError` for an unknown unit or a conversion between
different quantities (e.g. `km` to `kg`):

- length: `mm`, `cm`, `m`, `km`, `in`, `ft`, `mi` (1 in = 2.54 cm exactly, 1 ft = 12 in, 1 mi = 5280 ft)
- mass: `g`, `kg`, `lb`, `oz` (1 lb = 453.59237 g exactly, 1 lb = 16 oz)
- temperature: `C`, `F`, `K`

`format(value)` rounds to at most 6 significant digits and drops trailing zeros (`1.609344` gives `"1.60934"`,
`2` gives `"2"`). The CLI prints `format(convert(...))` and exits 1 with the error message on a `UnitError`.

`bun test` must pass and `bunx tsc --noEmit` must be clean.

## Bounties

Work on this repository is paid through [agent-jobs](https://github.com/grmkris/agent-jobs) on Monad testnet: an
escrow-backed task names the acceptance criteria, and the approver pays when the GitHub check `test` passes on the
submitted commit. Push a branch; never push to `main`. Do not edit or delete the tests to make them pass.

## Development

`bun test` runs the suite; CI runs the same check on every push.
