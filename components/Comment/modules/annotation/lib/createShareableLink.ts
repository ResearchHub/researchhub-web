import pick from "lodash/pick";
import copyTextToClipboard from "~/config/utils/copyTextToClipboard";
import { SerializedAnchorPosition } from "./types";

const createShareableLink = ({
  threadId,
  selectionXRange,
}: {
  threadId?: string;
  selectionXRange?: any;
}) => {
  const url = new URL(window.location.href);
  let hash = "";
  if (threadId) {
    hash = `#thread=${threadId}`;
  } else if (selectionXRange) {
    const serializedAnchor: SerializedAnchorPosition =
      selectionXRange.serialize();
    const serialized = encodeURIComponent(
      JSON.stringify(
        pick(
          serializedAnchor,
          "startContainerPath",
          "startOffset",
          "endContainerPath",
          "endOffset"
        )
      )
    );

    url.hash = `#selection=${serialized}`;
  }

  copyTextToClipboard(url.href);
};

export default createShareableLink;
