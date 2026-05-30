import { scenario } from '@testduet/given-when-then';
import { expect } from 'expect';
import { fn } from 'jest-mock';
import * as NodeTest from 'node:test';
import workthru from '../workthru.ts';

scenario(
  'workthru',
  bdd => {
    bdd
      .given('an recursive object', () => {
        let one: { one: unknown } = { one: 1 };
        let two: { two: unknown } = { two: 2 };
        let three: { three: unknown } = { three: 3 };

        one.one = two;
        two.two = three;
        three.three = one;

        return { value: one };
      })
      .and('a transformer', precondition => ({
        ...precondition,
        transformer: fn()
          .mockImplementationOnce(value => {
            expect(value && typeof value === 'object' && 'one' in value).toBe(true);

            return value;
          })
          .mockImplementationOnce(value => {
            expect(value && typeof value === 'object' && 'two' in value).toBe(true);

            return value;
          })
          .mockImplementationOnce(value => {
            expect(value && typeof value === 'object' && 'three' in value).toBe(true);

            return value;
          })
      }))
      .when('workthru() is called to traverse the object', ({ transformer, value }) => workthru(value, transformer))
      .then('should return the original object', (_, value) => {
        expect(value && typeof value === 'object' && 'one' in value).toBe(true);
        expect(value.one && typeof value.one === 'object' && 'two' in value.one).toBe(true);
        expect(value.one.two && typeof value.one.two === 'object' && 'three' in value.one.two).toBe(true);
        expect(value.one.two.three).toBe(value);
      })
      .and('should have called transformed 3 times', ({ transformer }) => expect(transformer).toHaveBeenCalledTimes(3));

    bdd
      .given('an recursive object', () => {
        let one: { one: unknown } = { one: 1 };
        let two: { two: unknown } = { two: 2 };
        let three: { three: unknown } = { three: 3 };

        one.one = two;
        two.two = three;
        three.three = one;

        return { value: one };
      })
      .and('a transformer which transform the second object', precondition => ({
        ...precondition,
        transformer: fn()
          .mockImplementationOnce(value => {
            expect(value && typeof value === 'object' && 'one' in value).toBe(true);

            return value;
          })
          .mockImplementationOnce(value => {
            expect(value && typeof value === 'object' && 'two' in value).toBe(true);

            return { ten: 10 };
          })
      }))
      .when('workthru() is called to transform the object', ({ transformer, value }) => workthru(value, transformer))
      .then('should return the transformed object', (_, value) => {
        expect(value && typeof value === 'object' && 'one' in value).toBe(true);
        expect(value.one && typeof value.one === 'object' && 'ten' in value.one).toBe(true);
        expect(value.one.ten).toBe(10);
      })
      .and('should have called transformed 2 times', ({ transformer }) => expect(transformer).toHaveBeenCalledTimes(2));

    bdd
      .given('an recursive array', () => {
        let one: unknown[] = [1];
        let two: unknown[] = [2];
        let three: unknown[] = [3];

        one[0] = two;
        two[0] = three;
        three[0] = one;

        return { value: one };
      })
      .and('a transformer', precondition => ({
        ...precondition,
        transformer: fn()
          .mockImplementationOnce(value => {
            expect(Array.isArray(value) && !!value[0]).toBe(true);

            return value;
          })
          .mockImplementationOnce(value => {
            expect(Array.isArray(value) && !!value[0]).toBe(true);

            return value;
          })
          .mockImplementationOnce(value => {
            expect(Array.isArray(value) && !!value[0]).toBe(true);

            return value;
          })
      }))
      .when('workthru() is called to traverse the object', ({ transformer, value }) => workthru(value, transformer))
      .then('should return the original array', (_, value) => {
        expect(Array.isArray(value) && !!value).toBe(true);
        expect(Array.isArray(value[0]) && !!value[0]).toBe(true);
        expect(Array.isArray(value[0][0]) && !!value[0][0]).toBe(true);
        expect(value[0][0][0]).toBe(value);
      });

    bdd
      .given('an recursive array', () => {
        let one: unknown[] = [1];
        let two: unknown[] = [2];
        let three: unknown[] = [3];

        one[0] = two;
        two[0] = three;
        three[0] = one;

        return { value: one };
      })
      .and('a transformer which transform the second array', precondition => ({
        ...precondition,
        transformer: fn()
          .mockImplementationOnce(value => {
            expect(Array.isArray(value) && !!value[0]).toBe(true);

            return value;
          })
          .mockImplementationOnce(value => {
            expect(Array.isArray(value) && !!value[0]).toBe(true);

            return 'Hello, World!';
          })
      }))
      .when('workthru() is called to transform the object', ({ transformer, value }) => workthru(value, transformer))
      .then('should return the transformed array', (_, value) => {
        expect(Array.isArray(value) && !!value).toBe(true);
        expect(value[0]).toBe('Hello, World!');
      });
  },
  NodeTest
);
