import { scenario } from '@testduet/given-when-then';
import { expect } from 'expect';
import * as NodeTest from 'node:test';
import workthru from '../workthru.ts';

scenario(
  'workthru',
  bdd => {
    bdd
      .given('a string', () => 'Hello, World!')
      .when('workthru() is called', value =>
        workthru(value, value => {
          expect(value).toBe('Hello, World!');

          return 'Aloha!';
        })
      )
      .then('should return the new string', (_, value) => {
        expect(value).toBe('Aloha!');
      });

    bdd
      .given('a number', () => 123)
      .when('workthru() is called', value =>
        workthru(value, value => {
          expect(value).toBe(123);

          return 789;
        })
      )
      .then('should return the new number', (_, value) => {
        expect(value).toBe(789);
      });

    bdd
      .given('a boolean', () => false)
      .when('workthru() is called', value =>
        workthru(value, value => {
          expect(value).toBe(false);

          return true;
        })
      )
      .then('should return the new string', (_, value) => {
        expect(value).toBe(true);
      });
  },
  NodeTest
);
