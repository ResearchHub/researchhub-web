import React, { useEffect, useMemo, useState } from "react";
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
  paperId,
  setActiveSection,
  setPaperDraftExists,
  setPaperDraftSections,
}) {
  if (paperId == null) {
    return <></>;
  }
  const [isFetching, setIsFetchitng] = useState(true);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const decorator = new CompositeDecorator([
    {
      strategy: findWayPointEntity,
      component: (props) => (
        <WaypointSection {...props} onSectionEnter={setActiveSection} />
      ),
    },
  ]);

  const handleFetchSuccess = useMemo(
    (data) => {
      console.warn("data: ", data);
      let formattedState = null;
      if (typeof data !== "string") {
        formattedState = formatRawJsonToEditorState(data);
      } else {
        formattedState = formatBase64ToEditorState(data);
      }
      setEditorState(formattedState);
    },
    [formatBase64ToEditorState, formatRawJsonToEditorState]
  );

  const handleFetchError = useMemo(
    (err) => {
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
        isFetching={isFetching}
        editorState={editorState}
        onChange={() => {}}
      />
    </div>
  );
}

export default PaperDraftContainer;
