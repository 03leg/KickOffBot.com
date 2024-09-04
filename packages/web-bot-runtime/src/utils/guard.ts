import { isNil } from 'lodash';

export function throwIfNil<T>(
  arg: T | null | undefined,
): asserts arg is NonNullable<T> {
  if (isNil(arg)) {
    throw new Error('Property can not be null here');
  }
}
