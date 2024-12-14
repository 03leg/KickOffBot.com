export const getValueType = (value: unknown): string => {
  if (Array.isArray(value)) {
    return 'array';
  }

  if (typeof value === 'object') {
    return 'object';
  }

  return typeof value;
};
