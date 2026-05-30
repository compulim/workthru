import { scenario } from '@testduet/given-when-then';
import { expect } from 'expect';
import { fn } from 'jest-mock';
import * as NodeTest from 'node:test';
import workthru from '../workthru.ts';
import { fileURLToPath } from 'node:url';
import { relative } from 'node:path';

scenario(
  relative(process.cwd(), fileURLToPath(import.meta.url)),
  bdd => {
    bdd
      .given('an array', () => {
        const one = { one: 1 };

        return { value: [one, one] };
      })
      .and('a transformer transforming the element in the array', precondition => ({
        ...precondition,
        transformer: fn()
          .mockImplementationOnce(value => {
            expect(value).toEqual([{ one: 1 }, { one: 1 }]);

            return value;
          })
          .mockImplementationOnce(value => {
            expect(value).toEqual({ one: 1 });

            return { two: 2 };
          })
      }))
      .when('workthru() is called to transform an element in the array', ({ transformer, value }) =>
        workthru(value, transformer)
      )
      .then('should return the transformed array', (_, value) => {
        expect(value).toEqual([{ two: 2 }, { two: 2 }]);
      })
      .and('should have called the transformer twice', ({ transformer }) =>
        expect(transformer).toHaveBeenCalledTimes(2)
      )
      .and('both element should be reference equal', (_, value) => {
        expect(value[0]).toBe(value[1]);
      });
  },
  NodeTest
);
