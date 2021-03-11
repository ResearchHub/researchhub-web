import React, { useEffect, useMemo, useState } from "react";
import { Helpers } from "@quantfive/js-web-config";
import { connect } from "react-redux";
import { fetchPaperDraft } from "~/config/fetch";
import { EditorState } from "draft-js";
import {
  formatBase64ToEditorState,
  setRawToEditorState,
} from "./util/PaperDraftUtils";
import { convertFromHTML } from "draft-convert";

// Container to fetch documents & convert strings into a disgestable format for PaperDraft.
function PaperDraftContainer({
  paperId,
  setPaperDraftExists,
  setPaperDraftSections,
}) {
  const [isFetching, setIsFetchitng] = useState(true);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleFetchSuccess = useMemo(
    (data) => {
      let formattedState = null;
      if (typeof data !== "string") {
        formattedState = setRawToEditorState(data);
      } else {
        formattedState = formatBase64ToEditorState(data);
      }
      setEditorState(formattedState);
    },
    [setRawToEditorState, setBase64ToEditorState]
  );

  const handleFetchError = useMemo(
    (err) => {
      const { setPaperDraftExists, setPaperDraftSections } = this.props;
      setPaperDraftExists(false);
      setPaperDraftSections([]);
      this.setState({ fetching: false });
    },
    [setPaperDraftExists, setPaperDraftSections]
  );

  useEffect(() => {
    fetchPaperDraft({ paperId })
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then(handleFetchSuccess)
      .catch(handleFetchError);
  }, [handleFetchSuccess, handleFetchError, paperId, Helpers]);
}

export default PaperDraftContainer;
