import { useEffect, useState } from "react";
import XRange from "../lib/xrange/XRange";

const useSelection = ({ ref }) => {
  const [selectionXRange, setSelectionXRange] = useState<null | any>(null);
  const [initialSelectionPosition, setInitialSelectionPosition] = useState<
    null | any
  >(null);

  useEffect(() => {
    const handleSelectionStart = () => {
      // clear existing selection and position
      setSelectionXRange(null);
      setInitialSelectionPosition(null);
    };

    const handleSelectionEnd = () => {
      // setTimeout 0 is required to ensure synchronicity between selection object and click events. Without it,
      // the state of getSelection may not be accurate.
      setTimeout(() => {
        const selection = window.getSelection();
        const isValidSelection =
          selection &&
          selection.rangeCount > 0 &&
          !selection.isCollapsed &&
          selection.toString().trim() !== "";

        if (isValidSelection) {
          const newRange = XRange.createFromSelection();
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          const position = { x: rect.x, y: rect.y };
          setInitialSelectionPosition(position);
          setSelectionXRange(newRange);
        } else {
          setSelectionXRange(null);
          setInitialSelectionPosition(null);
        }
      }, 0);
    };

    document.addEventListener("mousedown", handleSelectionStart);
    document.addEventListener("touchstart", handleSelectionStart);
    document.addEventListener("mouseup", handleSelectionEnd);
    document.addEventListener("touchend", handleSelectionEnd);
    document.addEventListener("keyup", handleSelectionEnd);
    document.addEventListener("keydown", handleSelectionEnd);

    return () => {
      document.removeEventListener("mousedown", handleSelectionStart);
      document.removeEventListener("touchstart", handleSelectionStart);
      document.removeEventListener("mouseup", handleSelectionEnd);
      document.removeEventListener("touchend", handleSelectionEnd);
      document.removeEventListener("keyup", handleSelectionEnd);
      document.removeEventListener("keydown", handleSelectionEnd);
    };
  }, [ref]); // Recreate the effect if the ref changes

  return { selectionXRange, initialSelectionPosition };
};

export default useSelection;
