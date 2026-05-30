import { scenario } from '@testduet/given-when-then';
import { expect } from 'expect';
import { fn } from 'jest-mock';
import { relative } from 'node:path';
import * as NodeTest from 'node:test';
import { fileURLToPath } from 'node:url';
import workthru from '../workthru.ts';

scenario(
  relative(process.cwd(), fileURLToPath(import.meta.url)),
  bdd => {
    bdd
      .given('a nested array', () => ({ value: [1, [2, 3, 4], 5] }))
      .and('a transformer', precondition => ({
        ...precondition,
        transformer: fn()
          .mockImplementationOnce(value => {
            expect(value).toEqual([1, [2, 3, 4], 5]);

            return value;
          })
          .mockImplementationOnce(value => {
            expect(value).toEqual(1);

            return value;
          })
          .mockImplementationOnce(value => {
            expect(value).toEqual([2, 3, 4]);

            return value;
          })
          .mockImplementationOnce(value => {
            expect(value).toEqual(2);

            return value;
          })
          .mockImplementationOnce(value => {
            expect(value).toEqual(3);

            return 9;
          })
          .mockImplementationOnce(value => {
            expect(value).toEqual(4);

            return value;
          })
          .mockImplementationOnce(value => {
            expect(value).toEqual(5);

            return value;
          })
      }))
      .when('workthru() is called to transform an element in the array', ({ transformer, value }) =>
        workthru(value, transformer)
      )
      .then('should return the transformed array', (_, value) => {
        expect(value).toEqual([1, [2, 9, 4], 5]);
      });
  },
  NodeTest
);
