# `workthru`

Recursively walks the input in a depth-first search manner and transforms value as needed.

## How to use

```ts
import { workthru } from 'workthru';

const result = workthru(
  {
    first: [1, 2],
    second: 3
  },
  value => (typeof value === 'number' ? value * 2 : value)
);

// Transformer will be called 5 times:

// - { first: [1, 2], second: 3 }
// - [1, 2]
// - 1
// - 2
// - 3

// Result will be `{ first: [2, 4], second: 6 }`.
```

## API

```ts
function workthru(target: any, transformer: (value: any) => any): any;
```

## Behaviors

### Does it support recursive objects?

Yes, all recursive values will only be traversed once. If the value is being transformed during traversal, all instances will also be transformed to the same value.

## Contributions

Like us? [Star](https://github.com/compulim/workthru/stargazers) us.

Want to make it better? [File](https://github.com/compulim/workthru/issues) us an issue.

Don't like something you see? [Submit](https://github.com/compulim/workthru/pulls) a pull request.
