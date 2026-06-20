/**
 * Internal recursive helper for {@link workthruAsync}.
 *
 * For arrays and plain objects, calls transformer first. If transformer returns the same reference,
 * recursively walks children and rebuilds the container only when a child changes (structural sharing).
 * Class instances, primitives, functions, and null are passed directly to transformer without recursion.
 *
 * The `walked` map tracks already-visited nodes to handle circular references and avoid duplicate work.
 *
 * @param target - Value to transform.
 * @param transformer - Called on every visited value; return the original value to recurse into children.
 * @param walked - Cycle-detection map from original value to its transformed counterpart.
 */
async function workthruAsync_(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  target: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformer: (value: any) => Promise<any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  walked: Map<any, any>
): Promise<any> {
  if (Array.isArray(target)) {
    if (walked.has(target)) {
      return walked.get(target);
    }

    let nextArray = await transformer(target);

    if (nextArray !== target) {
      walked.set(target, nextArray);

      return nextArray;
    }

    walked.set(target, target);

    // for-in loop can handle sparse array.
    for (const index in target) {
      const value = target[index];
      const nextValue = await workthruAsync_(value, transformer, walked);

      if (nextValue !== value) {
        if (nextArray === target) {
          nextArray = [...target];
        }

        nextArray[index] = nextValue;
      }
    }

    walked.set(target, nextArray);

    return nextArray;
  }

  if (typeof target === 'object' && target !== null) {
    if (walked.has(target)) {
      return walked.get(target);
    }

    const prototype = Object.getPrototypeOf(target);

    if (prototype === null || prototype === Object.prototype) {
      const nextTarget = await transformer(target);

      if (nextTarget !== target) {
        walked.set(target, nextTarget);

        return nextTarget;
      }

      walked.set(target, target);

      const entries = Object.entries(target);
      let nextMap = undefined;

      for (const [key, value] of entries) {
        const nextValue = await workthruAsync_(value, transformer, walked);

        if (nextValue !== value) {
          if (!nextMap) {
            nextMap = new Map(entries);
          }

          nextMap.set(key, nextValue);
        }
      }

      const nextObject = nextMap ? Object.fromEntries(nextMap.entries()) : target;

      walked.set(target, nextObject);

      return nextObject;
    }
  }

  return await transformer(target);
}

/**
 * Recursively walks the input in a depth-first search manner and transforms value as needed.
 *
 * Every traversed value will be passed to the asynchronous `transformer` function.
 *
 * - If the `transformer` return the original value, the traversal for this branch will be continued
 * - If the `transformer` return a new value, the traversal for this branch will be ended
 *
 * The following data types are supported:
 *
 * - boolean, number, string
 * - array will be transformed on itself and every of the element
 * - plain object will be transformed on itself and every of its member value
 *
 * Notes:
 *
 * - Values with unsupported will be kept as-is;
 * - Values that are not transformed will be kept as-is
 *
 * @param target - The value to be worked through
 * @param transformer - The asynchronous function to transform the value
 * @returns - The promise of transformed value if the input has been transformed, otherwise, return the original value
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function workthruAsync(target: any, transformer: (value: any) => Promise<any>): Promise<any> {
  return await workthruAsync_(target, transformer, new Map());
}

export default workthruAsync;
