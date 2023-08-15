import pick from "lodash/pick";
import copyTextToClipboard from "~/config/utils/copyTextToClipboard";
import { SerializedAnchorPosition } from "./types";
import { Selection } from "./useSelection";
import { COMMENT_CONTEXTS } from "~/components/Comment/lib/types";
import { ID } from "~/config/types/root_types";
import buildViewerUrl from "~/components/Document/lib/buildViewerUrl";

interface Props {
  selection: Selection;
  context?: COMMENT_CONTEXTS;
  citationId?: ID;
}

const createLinkToSelection = ({
  selection,
  citationId,
  context = COMMENT_CONTEXTS.GENERIC,
}: Props) => {
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

  let url: URL;
  if (context === COMMENT_CONTEXTS.REF_MANAGER) {
    url = buildViewerUrl({
      contentType: "citationentry",
      contentId: citationId,
      serializedSelection: serialized,
    });
  } else {
    url = new URL(window.location.href);
    url.hash = `#selection=${serialized}`;
  }

  copyTextToClipboard(url.href);
};

export default createLinkToSelection;
