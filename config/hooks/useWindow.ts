import { useEffect, useState } from "react";
import debounce from "lodash/debounce";

const useWindow = () => {
  const [windowSize, setWindowSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const debouncedHandleResize = debounce(handleResize, 1000);

    window.addEventListener("resize", debouncedHandleResize);

    debouncedHandleResize();

    return () => window.removeEventListener("resize", debouncedHandleResize);
  }, []);

  return windowSize;
};

export default useWindow;
