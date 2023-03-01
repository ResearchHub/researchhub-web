import { NextPage } from "next";
import { useRouter } from "next/router";
import CommentEditor from "~/components/Comment/CommentEditor";
import CommentFeed from "~/components/Comment/CommentFeed";

const CommentsIndex: NextPage = () => {
  const router = useRouter();

  return (
    <div style={{ padding: "24px 32px", }}>
      <CommentEditor isPreviewMode={true} />
      <CommentFeed unifiedDocumentId={router.query.id} />
    </div>
  )
}

export default CommentsIndex;