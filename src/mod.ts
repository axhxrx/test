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

export const describe = isDeno ? stdBdd.describe : nodeTest.describe;
export const test = isDeno ? stdBdd.it : nodeTest.test;
export const it = isDeno ? stdBdd.it : nodeTest.it;
export const beforeEach = isDeno ? stdBdd.beforeEach : nodeTest.beforeEach;
export const afterEach = isDeno ? stdBdd.afterEach : nodeTest.afterEach;
export const before = isDeno ? stdBdd.beforeAll : nodeTest.before;
export const after = isDeno ? stdBdd.afterAll : nodeTest.after;
