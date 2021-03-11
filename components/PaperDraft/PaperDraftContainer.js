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
  const [initEditorState, setInitEditorState] = useState(
    EditorState.createEmpty()
  );
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

  const handleFetchSuccess = useCallback(
    (data) => {
      const onFormatSuccess = ({ sections }) => {
        /* logical ordering */
        setPaperDraftSections(sections);
        setPaperDraftExists(true);
        setIsFetching(false);
        // console.warn("format success!!!!");
      };
      let digestibleFormat = null;
      if (typeof data !== "string") {
        digestibleFormat = formatRawJsonToEditorState({
          currenEditorState: editorState,
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
        handleEditorStateUpdate={setEditorState}
        initEditorState={initEditorState}
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
