import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useStore } from "react-redux";

import TextEditor from "~/components/TextEditor";

import DiscussionActions from "~/redux/discussion";

import { doesNotExist } from "../config/utils";

const ThreadEditor = (props) => {
  const { readOnly, setReadOnly, commentStyles, onCancel } = props;

  const dispatch = useDispatch();
  const store = useStore();
  const router = useRouter();

  const { paperId, discussionThreadId } = router.query;

  const [value, setValue] = useState(props.text);

  async function updateThread(text, plain_text) {
    const body = {
      text,
      plain_text,
    };

    dispatch(DiscussionActions.updateThreadPending());
    await dispatch(
      DiscussionActions.updateThread(paperId, discussionThreadId, body)
    );

    const thread = store.getState().discussion.updatedThread;
    const success = !doesNotExist(thread);

    if (success) {
      setValue(thread.text);
      setReadOnly(true);
    }

    return success;
  }

  return (
    <TextEditor
      readOnly={readOnly}
      onSubmit={updateThread}
      onCancel={onCancel}
      initialValue={value}
      clearOnSubmit={false}
      commentStyles={commentStyles && commentStyles}
      smallToolBar={true}
    />
  );
};

export default ThreadEditor;
