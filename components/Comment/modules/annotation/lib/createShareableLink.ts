import pick from "lodash/pick";
import copyTextToClipboard from "~/config/utils/copyTextToClipboard";
import { SerializedAnchorPosition } from "./types";
import { Selection } from "./useSelection";

const createShareableLink = ({ selection }: { selection: Selection }) => {
  const url = new URL(window.location.href);
  const serializedAnchor: SerializedAnchorPosition = {
    ...selection.xrange.serialize({}),
    pageNumber: selection.pageNumber,
  };
  const serialized = encodeURIComponent(
    JSON.stringify(
      pick(
        serializedAnchor,
        "startContainerPath",
        "startOffset",
        "endContainerPath",
        "endOffset",
        "pageNumber"
      )
    )
  );

  url.hash = `#selection=${serialized}`;
  copyTextToClipboard(url.href);
};

export default createShareableLink;
