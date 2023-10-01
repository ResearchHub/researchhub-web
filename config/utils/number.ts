export const isNumber = (input) => {
  return typeof input === "number";
};

export function formatNumber(input: number | string): string {
  const num = typeof input === 'string' ? parseFloat(input) : input;

  if (isNaN(num)) {
    return '0';
  }

  if (num < 1000) {
    return num.toString();
  }

  const formatted = (num / 1000).toFixed(1) + 'K';
  return formatted;
}