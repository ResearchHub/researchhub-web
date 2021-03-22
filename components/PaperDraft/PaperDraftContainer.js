import React, { useEffect, useMemo, useState } from "react";
import { Helpers } from "@quantfive/js-web-config";
import { fetchPaperDraft } from "~/config/fetch";
import { CompositeDecorator, EditorState } from "draft-js";
import {
  getBlockStyleFn,
  getHandleKeyCommand,
  getHandleOnTab,
} from "./util/PaperDraftTextEditorUtil";
import {
  formatBase64ToEditorState,
  formatRawJsonToEditorState,
} from "./util/PaperDraftUtils";
import { getInlineCommentBlockRenderer } from "../PaperDraftInlineComment/util/paperDraftInlineCommentUtil";
import WaypointSection from "./WaypointSection";
import PaperDraft from "./PaperDraft";

// strategy used for the decorator
const findWayPointEntity = (seenEntityKeys, setSeenEntityKeys) => (
  contentBlock,
  callback,
  contentState
) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    if (!Boolean(seenEntityKeys[entityKey])) {
      setSeenEntityKeys({ ...seenEntityKeys, [entityKey]: true });
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === "WAYPOINT"
      );
    }
  }, callback);
};

const getDecorator = ({
  seenEntityKeys,
  setActiveSection,
  setSeenEntityKeys,
}) =>
  new CompositeDecorator([
    {
      component: (props) => (
        <WaypointSection {...props} onSectionEnter={setActiveSection} />
      ),
      strategy: findWayPointEntity(seenEntityKeys, setSeenEntityKeys),
    },
  ]);

function paperFetchHook({
  decorator,
  paperId,
  setEditorState,
  setInitEditorState,
  setIsFetching,
  setPaperDraftExists,
  setPaperDraftSections,
}) {
  const handleFetchSuccess = (data) => {
    const onFormatSuccess = ({ sections }) => {
      /* logical ordering */
      setPaperDraftSections(sections);
      setPaperDraftExists(true);
      setIsFetching(false);
    };
    let digestibleFormat = null;
    if (typeof data !== "string") {
      digestibleFormat = formatRawJsonToEditorState({
        rawJson: data,
        decorator,
        onSuccess: onFormatSuccess,
      });
    } else {
      digestibleFormat = formatBase64ToEditorState({
        base64: data,
        decorator,
        onSuccess: onFormatSuccess,
      });
    }
    setInitEditorState(digestibleFormat);
    setEditorState(digestibleFormat);
  };

  const handleFetchError = (_err) => {
    setPaperDraftExists(false);
    setPaperDraftSections([]);
    setIsFetching(false);
  };

  fetchPaperDraft({ paperId })
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then(handleFetchSuccess)
    .catch(handleFetchError);
}

// Container to fetch documents & convert strings into a disgestable format for PaperDraft.
function PaperDraftContainer({
  inlineComments,
  isViewerAllowedToEdit,
  paperDraftExists,
  paperDraftSections,
  paperId,
  setActiveSection,
  setInlineComments,
  setPaperDraftExists,
  setPaperDraftSections,
}) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [initEditorState, setInitEditorState] = useState(
    EditorState.createEmpty()
  );
  const [isFetching, setIsFetching] = useState(true);
  const [seenEntityKeys, setSeenEntityKeys] = useState({});

  const decorator = useMemo(
    () => getDecorator({ seenEntityKeys, setSeenEntityKeys, setActiveSection }),
    [seenEntityKeys, setSeenEntityKeys, setActiveSection]
  );

  useEffect(
    () =>
      paperFetchHook({
        decorator,
        paperId,
        setEditorState,
        setInitEditorState,
        setIsFetching,
        setPaperDraftExists,
        setPaperDraftSections,
      }),
    [paperId] /* intentionally hard enforcing only on paperID. */
  );

  const inlineCommentBlockRenderer = getInlineCommentBlockRenderer({
    inlineComments,
    setInlineComments,
  });

  return (
    <div>
      <PaperDraft
        textEditorProps={{
          blockRendererFn: inlineCommentBlockRenderer,
          blockStyleFn: getBlockStyleFn,
          editorState,
          handleKeyCommand: getHandleKeyCommand({
            editorState,
            setEditorState,
          }),
          initEditorState,
          onChange: setEditorState,
          onTab: getHandleOnTab({
            editorState,
            setEditorState,
          }),
          setInitEditorState,
          spellCheck: true,
        }}
        isFetching={isFetching}
        isViewerAllowedToEdit={isViewerAllowedToEdit}
        paperDraftExists={paperDraftExists}
        paperDraftSections={paperDraftSections}
        paperId={paperId}
      />
    </div>
  );
}

export default PaperDraftContainer;
