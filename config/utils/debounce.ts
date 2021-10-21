export const debounce = <F extends (...args: Parameters<any>) => any>(
  func: F,
  ms: number,
  immediate?: boolean
): ((...args: Parameters<F>) => void) => {
  let timeout: any;
  return (...args: Parameters<F>) => {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, ms);
    if (callNow) {
      func(...args);
    }
  };
};
