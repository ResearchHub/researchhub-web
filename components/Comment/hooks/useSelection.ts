import { useEffect, useState } from "react";
import XRange from "../lib/xrange/XRange";

const useSelection = ({ ref }) => {
  const [selectionXRange, setSelectionXRange] = useState<null | any>(null);
  const [initialSelectionPosition, setInitialSelectionPosition] = useState<
    null | any
  >(null);

  useEffect(() => {
    const handleSelection = (e) => {
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

    document.addEventListener("click", handleSelection);

    return () => {
      document.removeEventListener("click", handleSelection);
    };
  }, [ref]);

  return { selectionXRange, initialSelectionPosition };
};

export default useSelection;
