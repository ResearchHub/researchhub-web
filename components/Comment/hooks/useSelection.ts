import { useEffect, useState } from "react";
import XRange from "../lib/xrange/XRange";

export const useSelection = ({ ref }) => {
  const [xrange, setXRange] = useState<null | any>(null);
  const [selectionPosition, setSelectionPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const handleSelectionStart = () => {
      document.addEventListener("mousemove", handleSelectionChange);
    };

    const handleSelectionChange = () => {
      const selection = window.getSelection();

      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setSelectionPosition({ x: rect.left, y: rect.top });

        const xrange = XRange.createFromSelection();
        setXRange(xrange);
      }
    };

    const handleSelectionEnd = () => {
      document.removeEventListener("mousemove", handleSelectionChange);
    };

    document.addEventListener("mousedown", handleSelectionStart);
    document.addEventListener("mouseup", handleSelectionEnd);

    // Clean up event listeners on unmount
    return () => {
      document.removeEventListener("mousedown", handleSelectionStart);
      document.removeEventListener("mouseup", handleSelectionEnd);
      document.removeEventListener("mousemove", handleSelectionChange);
    };
  }, [ref]);

  return { xrange, selectionPosition };
};

export default useSelection;
