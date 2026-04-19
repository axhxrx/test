# @axhxrx/test

A thin runtime-dispatched shim over test-runner primitives, so the same test file runs on **Bun**, **Deno**, and **Node.js 24.2+**. That is mostly possible already, thanks to those runtimes' support for the Node testing API, but `afterEach`/`beforeEach` specifically do not work across all 3 runtimes without some kind of shim.

As of 2026-04-19, these things are true:

- Node's `node:test` works on Node and Bun, but Deno's `node:test` compat shim does not implement `afterEach`/`beforeEach`. Calling them under Deno throws `Not implemented: test.afterEach`.

- Deno's `@std/testing/bdd` works on Deno, but it references the `Deno` global unconditionally at runtime, and therefore crashes on Node and Bun with `ReferenceError: Deno is not defined`.

Both modules can be *imported* cleanly under every environment; only specific *calls* fail on the wrong runtime. This package picks the right implementation at runtime and re-exports it, so tests import one stable surface.

This is obviously hacky; hopefully this is temporary — if either `@std/bdd` becomes cross-runtime, _or_ Deno implements the remaining bits of Node's API, then this package can be retired.

## Install

```bash
# Deno
deno add jsr:@axhxrx/test

# Bun
bunx jsr add @axhxrx/test

# Node / pnpm / npm
npx jsr add @axhxrx/test
```

## Usage

```ts
import { afterEach, beforeEach, describe, test } from '@axhxrx/test';
import { expect } from '@std/expect';

describe('widgets', () =>
{
  let widget: Widget;

  beforeEach(() => { widget = new Widget(); });
  afterEach(() => { widget.dispose(); });

  test('has a handle', () => { expect(widget.handle).toBeDefined(); });
});
```

Run the same file under any runtime:

```bash
bun test path/to/file.test.ts
node --test path/to/file.test.ts
deno test -A path/to/file.test.ts
```

## Exports

| Name | Under Deno | Under Node/Bun |
| ---- | ---------- | -------------- |
| `describe` | `@std/testing/bdd`.describe | `node:test`.describe |
| `test` / `it` | `@std/testing/bdd`.it | `node:test`.test / .it |
| `beforeEach`, `afterEach` | `@std/testing/bdd` | `node:test` |
| `before`, `after` | `@std/testing/bdd`.beforeAll / afterAll | `node:test`.before / after |

`expect` is NOT re-exported — get it from `@std/expect` directly. It already works on every runtime without a shim.

## Tip: Node `--test-isolation=none`

If your tests produce high-volume stdout, or spawn subprocesses whose output flows back through the test process, Node's default per-file process isolation can hit an IPC framing bug that surfaces as:

    Error: Unable to deserialize cloned data due to invalid or unsupported version.

Workaround: run Node tests with `--test-isolation=none` (everything runs in one process, no IPC). Bun and Deno are unaffected. This only hits when doing weird stuff like running tests that for whatever reason invoke processes that spew huge amounts of output that you then consume. Not super common, but definitely a lurking problem for those kinds of tests.

## License

MIT

## Happenings

- 2026-04-19 🧃 0.1.1 — _juice_ that JSR score... 90% more documented symbols!

- 2026-04-19 📦 0.1.0 — initial implementation of small hack for @std-only cross-runtime tests
