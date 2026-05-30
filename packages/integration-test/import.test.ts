import { expect } from 'expect';
import { fn } from 'jest-mock';
import { workthru } from 'workthru';

const transformer = fn(value => (typeof value === 'number' ? value * 2 : value));

const result = workthru(
  {
    first: [1, 2],
    second: 3
  },
  transformer
);

expect(result).toEqual({
  first: [2, 4],
  second: 6
});

expect(transformer).toHaveBeenCalledTimes(5);
expect(transformer).toHaveBeenNthCalledWith(1, { first: [1, 2], second: 3 });
expect(transformer).toHaveBeenNthCalledWith(2, [1, 2]);
expect(transformer).toHaveBeenNthCalledWith(3, 1);
expect(transformer).toHaveBeenNthCalledWith(4, 2);
expect(transformer).toHaveBeenNthCalledWith(5, 3);
