import { useEffect, useState } from "react";
import Comment from "./Comment";
import CommentModel from "./lib/CommentModel";
import mockData from "./lib/mock.json";

type Args = {
  unifiedDocumentId: string | string[] | undefined;
}

const CommentFeed = ({ unifiedDocumentId }: Args) => {
  
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchActivity = () => {
      setIsFetching(true);

      setTimeout(() => {
        const rawComments = mockData;
        const comments = rawComments.map((raw) => new CommentModel(raw));
        setComments(comments);
        setIsFetching(false);
      }, 1000);
    }

    if (unifiedDocumentId) {
      fetchActivity();
    }
  }, [unifiedDocumentId]);

  return (
    <div>
      {comments.map(c => <Comment comment={c} />)}
    </div>
  )
}

export default CommentFeed;