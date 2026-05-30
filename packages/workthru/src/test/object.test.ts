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
      .given('an object', () => ({ value: { one: 1, two: 2, three: 3 } }))
      .and('a transformer', precondition => ({
        ...precondition,
        transformer: fn()
          .mockImplementationOnce(value => {
            expect(value).toEqual({ one: 1, two: 2, three: 3 });

            return value;
          })
          .mockImplementationOnce(value => {
            expect(value).toEqual(1);

            return value;
          })
          .mockImplementationOnce(value => {
            expect(value).toEqual(2);

            return 9;
          })
          .mockImplementationOnce(value => {
            expect(value).toEqual(3);

            return value;
          })
      }))
      .when('workthru() is called to transform an element in the object', ({ transformer, value }) =>
        workthru(value, transformer)
      )
      .then('should return the transformed object', (_, value) => {
        expect(value).toEqual({ one: 1, two: 9, three: 3 });
      })
      .and('should have called the transformer 4 times', ({ transformer }) => {
        expect(transformer).toHaveBeenCalledTimes(4);
      });

    bdd
      .given('an object', () => ({ value: { one: 1, two: 2, three: 3 } }))
      .and('a transform to transform the object into a string', precondition => ({
        ...precondition,
        transformer: fn().mockImplementationOnce(value => {
          expect(value).toEqual({ one: 1, two: 2, three: 3 });

          return 'Hello, World!';
        })
      }))
      .when('workthru() is called to transform the object', ({ transformer, value }) => workthru(value, transformer))
      .then('should return the transformed object', (_, value) => {
        expect(value).toEqual('Hello, World!');
      })
      .and('should have called the transformer once', ({ transformer }) => {
        expect(transformer).toHaveBeenCalledTimes(1);
      });
  },
  NodeTest
);
