export function getSvgPathForTempLine(
  scale: number,
  initial: [number, number],
  values: [number, number]
) {
  const element = document.getElementById("svg-container") as Element;
  const rect = element.getBoundingClientRect();

  const [initialX, initialY] = initial;
  const [valuesX, valuesY] = values;

  const start = `${(initialX - rect.left) * (1 / scale)}, ${
    (initialY - rect.top) * (1 / scale)
  }`;
  const end = `${(valuesX - rect.left) * (1 / scale)}, ${
    (valuesY - rect.top) * (1 / scale)
  }`;

  const path = `M ${start} ${end}`;

  return path;
}
