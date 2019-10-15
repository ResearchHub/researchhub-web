import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useStore } from "react-redux";

import TextEditor from "~/components/TextEditor";

import DiscussionActions from "~/redux/discussion";

import { getNestedValue } from "../config/utils";

const ThreadEditor = (props) => {
  const { readOnly, onSubmit } = props;

  const dispatch = useDispatch();
  const store = useStore();
  const router = useRouter();

  const { paperId, discussionThreadId } = router.query;

  const initialValue = props.text;

  async function updateThread(text) {
    const body = {
      text,
    };

    dispatch(DiscussionActions.updateThreadPending());
    await dispatch(
      DiscussionActions.updateThread(paperId, discussionThreadId, body)
    );

    const thread = store.getState().discussion.updatedThread;
    const success = getNestedValue(thread, ["success"], false);

    if (success) {
      setText(thread.text);
    }

    return success;
  }

  return (
    <TextEditor
      readOnly={readOnly}
      onSubmit={updateThread}
      initialValue={initialValue}
    />
  );
};

export default ThreadEditor;
