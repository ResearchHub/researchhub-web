import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AuthorAvatar from "~/components/AuthorAvatar";
import { timeSince } from "~/config/utils/dates";
import mockData from "./mock.json";


const CommentHeader = ({ createdBy, createdAt, bounties }) => {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      columnGap: "5px",
    }}>
      <AuthorAvatar author={createdBy.authorProfile} />
      {`${createdBy.authorProfile.firstName} ${createdBy.authorProfile.lastName}`}
      {` commented `}
      <span> • </span>
      {timeSince(createdAt)}
    </div>
  )
}

const Comment = ({ comment }) => {
  return (
    <div>
      <CommentHeader createdBy={comment.createdBy} createdAt={comment.createdDate} bounties={[]} />
      {JSON.stringify(comment, null, 2)}
    </div>
  )
}


const DocumentActivityFeed = ({}) => {
  const router = useRouter();

  const [comments, setComments] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() =>  {
    const fetchActivity = () => {
        setTimeout(() => {
          setComments(mockData);
          setIsFetching(true);
        }, 1000)
    }

    fetchActivity();
  }, [router.query.id]);

  return (
    <div>
      {comments.map(c => <Comment comment={c} />)}
    </div>
  )
}


const CommentsIndex: NextPage = () => {
  
  return (
    <div>
      <DocumentActivityFeed />
    </div>    
  )
}

export default CommentsIndex;