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
      .given('an object', () => ({ value: { one: { ten: 10, eleven: 11 }, two: 2 } }))
      .and('a transformer', precondition => ({
        ...precondition,
        transformer: fn()
          .mockImplementationOnce(value => {
            expect(value).toEqual({ one: { ten: 10, eleven: 11 }, two: 2 });

            return value;
          })
          .mockImplementationOnce(value => {
            expect(value).toEqual({ ten: 10, eleven: 11 });

            return value;
          })
          .mockImplementationOnce(value => {
            expect(value).toEqual(10);

            return value;
          })
          .mockImplementationOnce(value => {
            expect(value).toEqual(11);

            return 99;
          })
          .mockImplementationOnce(value => {
            expect(value).toEqual(2);

            return value;
          })
      }))
      .when('workthru() is called to transform an element in the object', ({ transformer, value }) =>
        workthru(value, transformer)
      )
      .then('should return the transformed object', (_, value) => {
        expect(value).toEqual({ one: { ten: 10, eleven: 99 }, two: 2 });
      })
      .and('should have called transformer 5 times', ({ transformer }) => {
        expect(transformer).toHaveBeenCalledTimes(5);
      });
  },
  NodeTest
);
