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
const findWayPointEntity = (contentBlock, callback, contentState) => {
  const { seenEntityKeys } = this.state;
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    if (!seenEntityKeys[entityKey]) {
      this.setState({
        seenEntityKeys: { ...seenEntityKeys, [entityKey]: true },
      });
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === "WAYPOINT"
      );
    }
  }, callback);
};

// Container to fetch documents & convert strings into a disgestable format for PaperDraft.
function PaperDraftContainer({
  isModerator,
  paperId,
  paperDraftExists,
  setActiveSection,
  setPaperDraftExists,
  setPaperDraftSections,
}) {
  if (paperId == null) {
    return <></>;
  }
  const [isFetching, setIsFetchitng] = useState(true);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const decorator = useMemo(
    () =>
      new CompositeDecorator([
        {
          strategy: findWayPointEntity,
          component: (props) => (
            <WaypointSection {...props} onSectionEnter={setActiveSection} />
          ),
        },
      ]),
    [setActiveSection]
  );

  const handleFetchSuccess = useCallback(
    (data) => {
      if (typeof data !== "string") {
        setEditorState(formatRawJsonToEditorState(data));
      } else {
        setEditorState(formatBase64ToEditorState(data));
      }
    },
    [formatBase64ToEditorState, formatRawJsonToEditorState]
  );

  const handleFetchError = useCallback(
    (_err) => {
      setPaperDraftExists(false);
      setPaperDraftSections([]);
      setIsFetchitng(false);
    },
    [setPaperDraftExists, setPaperDraftSections, setIsFetchitng]
  );

  useEffect(() => {
    fetchPaperDraft({ paperId })
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then(handleFetchSuccess)
      .catch(handleFetchError);
  }, [handleFetchSuccess, handleFetchError, paperId, Helpers]);

  return (
    <div>
      <PaperDraft
        editorState={editorState}
        isFetching={isFetching}
        onChange={() => {}}
        paperDraftExists={paperDraftExists}
        isViewerAllowedToEdit={isModerator}
      />
    </div>
  );
}

export default PaperDraftContainer;
