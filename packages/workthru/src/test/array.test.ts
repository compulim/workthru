import { scenario } from '@testduet/given-when-then';
import { expect } from 'expect';
import { fn } from 'jest-mock';
import * as NodeTest from 'node:test';
import workthru from '../workthru.ts';

scenario(
  'workthru',
  bdd => {
    bdd
      .given('an array', () => ({ value: [1, 2, 3] }))
      .and('a transformer', precondition => ({
        ...precondition,
        transformer: fn()
          .mockImplementationOnce(value => {
            expect(value).toEqual([1, 2, 3]);

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
      .when('workthru() is called to transform an element in the array', ({ transformer, value }) =>
        workthru(value, transformer)
      )
      .then('should return the transformed array', (_, value) => {
        expect(value).toEqual([1, 9, 3]);
      });

    bdd
      .given('an array', () => ({ value: [1, 2, 3] }))
      .and('a transform to transform the array into a string', precondition => ({
        ...precondition,
        transformer: fn().mockImplementationOnce(value => {
          expect(value).toEqual([1, 2, 3]);

          return 'Hello, World!';
        })
      }))
      .when('workthru() is called to transform the array', ({ transformer, value }) => workthru(value, transformer))
      .then('should return the transformed array', (_, value) => {
        expect(value).toEqual('Hello, World!');
      });
  },
  NodeTest
);
