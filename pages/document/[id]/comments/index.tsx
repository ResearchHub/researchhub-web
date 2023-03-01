import { NextPage } from "next";
import { useRouter } from "next/router";
import CommentEditor from "~/components/Comment/CommentEditor";
import CommentFeed from "~/components/Comment/CommentFeed";
import { css, StyleSheet } from "aphrodite";

const CommentsIndex: NextPage = () => {
  const router = useRouter();

  return (
    <div className={css(styles.wrapper)}>
      <CommentEditor isPreviewMode={true} />
      <CommentFeed unifiedDocumentId={router.query.id} />
    </div>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    padding: "24px 32px",
  }
});

export default CommentsIndex;