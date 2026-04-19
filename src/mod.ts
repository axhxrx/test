/**
 A single import for the minimal hack needed to get cross-runtime tests working on Deno, Bun, *and* Node24.2+, without any dependencies aside from `@std/testing` and `@std/expect`.

 Neither `node:test` nor `@std/testing/bdd` is fully cross-runtime on its own; this module picks the working implementation at runtime. See the README for the full rationale.

 ```ts
 import { afterEach, describe, test } from '@axhxrx/test';
 import { expect } from '@std/expect';

 describe('widgets', () =>
 {
   afterEach(() => { cleanup(); });
   test('works on every runtime', () => { expect(1 + 1).toBe(2); });
 });
 ```
 */

import * as stdBdd from '@std/testing/bdd';
import * as nodeTest from 'node:test';

const isDeno = typeof (globalThis as { Deno?: unknown }).Deno !== 'undefined';

/**
 The usual `describe` — dispatches to `@std/testing/bdd`'s `describe` on Deno, or `node:test`'s `describe` on Node/Bun.
 */
export const describe = isDeno ? stdBdd.describe : nodeTest.describe;

/**
 Registers a single test case. Equivalent to `it`.

 Dispatches to `@std/testing/bdd`'s `it` on Deno, or `node:test`'s `test` on Node/Bun.
 */
export const test = isDeno ? stdBdd.it : nodeTest.test;

/**
 Alias for `test`. Registers a single test case. Use whichever reads better inside your `describe` block. Dispatches to `@std/testing/bdd`'s `it` on Deno, or `node:test`'s `test` on Node/Bun.
 */
export const it = isDeno ? stdBdd.it : nodeTest.it;

/**
 The usual `beforeEach`. Dispatches to `@std/testing/bdd`'s `beforeEach` on Deno, or `node:test`'s `beforeEach` on Node/Bun.
 */
export const beforeEach = isDeno ? stdBdd.beforeEach : nodeTest.beforeEach;

/**
 The usual `afterEach`. Dispatches to `@std/testing/bdd`'s `afterEach` on Deno, or `node:test`'s `afterEach` on Node/Bun.
 */
export const afterEach = isDeno ? stdBdd.afterEach : nodeTest.afterEach;

/**
The artist sometimes known as `beforeAll()` and sometimes `before()`. Dispatches to `@std/testing/bdd`'s `beforeAll` on Deno, or `node:test`'s `before` on Node/Bun.
 */
export const before = isDeno ? stdBdd.beforeAll : nodeTest.before;

/**
The artist sometimes known as `afterAll()` and sometimes `after()`. Dispatches to `@std/testing/bdd`'s `afterAll` on Deno, or `node:test`'s `after` on Node/Bun.
 */
export const after = isDeno ? stdBdd.afterAll : nodeTest.after;
