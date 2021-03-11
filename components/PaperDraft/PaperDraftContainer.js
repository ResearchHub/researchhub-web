import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Helpers } from "@quantfive/js-web-config";
import { fetchPaperDraft } from "~/config/fetch";
import { CompositeDecorator, EditorState } from "draft-js";
import {
  formatBase64ToEditorState,
  formatRawJsonToEditorState,
} from "./util/PaperDraftUtils";
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
    if (!seenEntityKeys[entityKey]) {
      setSeenEntityKeys({ ...seenEntityKeys, [entityKey]: true });
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === "WAYPOINT"
      );
    }
  }, callback);
};

// Container to fetch documents & convert strings into a disgestable format for PaperDraft.
function PaperDraftContainer({
  isViewerAllowedToEdit,
  paperDraftExists,
  paperDraftSections,
  paperId,
  setActiveSection,
  setPaperDraftExists,
  setPaperDraftSections,
}) {
  const [isFetching, setIsFetching] = useState(true);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [seenEntityKeys, setSeenEntityKeys] = useState({});

  const decorator = useMemo(
    () =>
      new CompositeDecorator([
        {
          strategy: findWayPointEntity(seenEntityKeys, setSeenEntityKeys),
          component: (props) => (
            <WaypointSection {...props} onSectionEnter={setActiveSection} />
          ),
        },
      ]),
    [seenEntityKeys, setSeenEntityKeys, setActiveSection]
  );

  const handleEditorStateUpdate = useCallback(
    (content = null, changeType = null) => {
      console.warn("content: ", content);
      console.warn("changeType: ", changeType);

      setEditorState(EditorState.push(editorState, content, changeType));
    },
    [setEditorState]
  );

  const handleFetchSuccess = useCallback(
    (data) => {
      const onFormatSuccess = ({ sections }) => {
        /* logical ordering */
        setPaperDraftSections(sections);
        setPaperDraftExists(true);
        setIsFetching(false);
        // console.warn("format success!!!!");
      };
      if (typeof data !== "string") {
        setEditorState(
          formatRawJsonToEditorState({
            currenEditorState: editorState,
            rawJson: data,
            decorator,
            onSuccess: onFormatSuccess,
          })
        );
      } else {
        setEditorState(
          formatBase64ToEditorState({
            base64: data,
            decorator,
            onSuccess: onFormatSuccess,
          })
        );
      }
    },
    [formatBase64ToEditorState, formatRawJsonToEditorState]
  );

  const handleFetchError = useCallback(
    (_err) => {
      // console.warn("error????: ", _err);
      setPaperDraftExists(false);
      setPaperDraftSections([]);
      setIsFetching(false);
    },
    [setPaperDraftExists, setPaperDraftSections, setIsFetching]
  );

  useEffect(() => {
    fetchPaperDraft({ paperId })
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then(handleFetchSuccess)
      .catch(handleFetchError);
  }, [handleFetchSuccess, handleFetchError, paperId, Helpers]);

  // console.warn("editorState: ", editorState);
  // console.warn("paperDraftExists: ", paperDraftExists);

  return (
    <div>
      <PaperDraft
        editorState={editorState}
        handleEditorStateUpdate={handleEditorStateUpdate}
        isFetching={isFetching}
        isViewerAllowedToEdit={isViewerAllowedToEdit}
        paperDraftExists={paperDraftExists}
        paperDraftSections={paperDraftSections}
      />
    </div>
  );
}

export default PaperDraftContainer;
