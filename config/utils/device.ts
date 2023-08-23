import { useEffect, useState } from "react";

export const useHasTouchCapability = () => {
  const [hasTouchCapability, setHasTouchCapability] = useState(false);

  useEffect(() => {
    const hasTouchCapability =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setHasTouchCapability(hasTouchCapability);
  }, []);

  return hasTouchCapability;
};
