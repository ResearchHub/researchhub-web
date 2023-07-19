import { useEffect, useState } from "react";
import XRange from "../modules/annotation/lib/xrange/XRange";

function isSelectionInsideElement({ element, selection }) {
  try {
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      return element.contains(range.commonAncestorContainer);
    }
  } catch (error) {}
  return false;
}

const useSelection = ({
  contentRef,
}): {
  selectionXRange: any;
  initialSelectionPosition: any;
  mouseCoordinates: { x: number; y: number } | null;
  resetSelectedPos: Function;
} => {
  // XRange representation of the current selection. Contains xpath and offset information.
  const [selectionXRange, setSelectionXRange] = useState<null | any>(null);

  // This represents the position near the top of the selection. Useful if multiple rows of text are selected
  const [initialSelectionPosition, setInitialSelectionPosition] = useState<
    null | any
  >(null);

  // Represent
  const [mouseCoordinates, setMouseCoordinates] = useState<null | {
    x: number;
    y: number;
  }>(null);

  const resetSelectedPos = () => {
    setSelectionXRange(null);
    setInitialSelectionPosition(null);
  };

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
          selection.toString().trim() !== "" &&
          isSelectionInsideElement({ element: contentRef.current, selection });

        if (isValidSelection) {
          const newRange = XRange.createFromSelection();
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          const position = { x: rect.x, y: rect.y };
          const contentRect = contentRef.current.getBoundingClientRect();

          setInitialSelectionPosition(position);
          setSelectionXRange(newRange);
          setMouseCoordinates({
            x: rect.x - contentRect.x + rect.width / 2,
            y: rect.y - contentRect.y - 45,
          });
        } else {
          setSelectionXRange(null);
          setInitialSelectionPosition(null);
          setMouseCoordinates(null);
        }
      }, 0);
    };

    document.addEventListener("click", handleSelection);

    return () => {
      document.removeEventListener("click", handleSelection);
    };
  }, [contentRef]);

  return {
    selectionXRange,
    initialSelectionPosition,
    mouseCoordinates,
    resetSelectedPos,
  };
};

export default useSelection;
