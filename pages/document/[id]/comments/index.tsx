import { NextPage } from "next";
import { useRouter } from "next/router";
import CommentFeed from "~/components/Comment/CommentFeed";
import { css, StyleSheet } from "aphrodite";

const CommentsIndex: NextPage = () => {
  const router = useRouter();

  return (
    <div className={css(styles.wrapper)}>
      <CommentFeed
        unifiedDocumentId={router.query.id}
      />
    </div>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    maxWidth: 500,
    padding: "24px 32px",
  }
});

export default CommentsIndex;