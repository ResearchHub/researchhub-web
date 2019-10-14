import { useRouter } from "next/router";
import { useDispatch, useStore } from "react-redux";

import TextEditor from "~/components/TextEditor";

import DiscussionActions from "~/redux/discussion";
import { deserializeEditor } from "../config/utils/serializers";

const ThreadEditor = (props) => {
  const { isEditable, postMethod, onSubmit } = props;

  const text = deserializeEditor(props.text);

  const dispatch = useDispatch();
  const store = useStore();
  const router = useRouter();
  const { paperId, discussionThreadId } = router.query;

  const post = async (text) => {
    await postMethod(
      { dispatch, store, paperId, discussionThreadId, onSubmit },
      text
    );
  };

  async function updateThread() {
    dispatch(DiscussionActions.updateThreadPending());
    await dispatch(
      DiscussionActions.updateThread(paperId, discussionThreadId, text)
    );

    const thread = store.getState().discussion.updatedThread;
    onSubmit(thread);
  }

  return (
    <TextEditor
      readOnly={isEditable || true}
      onSubmit={post}
      initialValue={text}
    />
  );
};

export default ThreadEditor;
