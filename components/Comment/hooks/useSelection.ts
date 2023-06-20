import { useEffect, useState } from "react";
import XRange from "../lib/xrange/XRange";

export const useSelection = ({ ref }) => {
  const [selectedText, setSelectedText] = useState("");
  const [xrange, setXRange] = useState<null | any>(null);

  useEffect(() => {
    const handleSelection = () => {
      if (ref.current) {
        const xrange = XRange.createFromSelection();
        setXRange(xrange);
      }
    };

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("keyup", handleSelection);

    // Clean up event listeners on unmount
    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("keyup", handleSelection);
    };
  }, [ref]); // Recreate the effect if the ref changes

  return { xrange };
};

export default useSelection;
