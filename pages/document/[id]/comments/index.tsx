import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import AuthorAvatar from "~/components/AuthorAvatar";
import { timeSince } from "~/config/utils/dates";
import mockData from "./mock.json";
import ReactQuill, { Quill } from 'react-quill';
import CreateBountyBtn from "~/components/Bounty/CreateBountyBtn";
import Button from "~/components/Form/Button";

const CommentEditor = ({
  isPreviewMode,
  placeholder = "Add comment or start a bounty"
}) => {
  const [value, setValue] = useState('');
  const [_isPreviewMode, _setIsPreviewMode] = useState(true);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const editorRef = useRef();

  useEffect(() => {
    const _handleOutsideClick = (e) => {
      if (!_isPreviewMode && !editorRef.current?.contains(e.target)) {
        _setIsPreviewMode(true);
      }
    };

    document.addEventListener("click", _handleOutsideClick)

    return () => {
      document.removeEventListener("click", _handleOutsideClick)
    }
  }, [])


  return (
    <div
      ref={editorRef}
      style={{
        display: "flex",
        padding: "16px 24px",
        minHeight: 105,
        boxShadow: "0px 0px 15px rgba(36, 31, 58, 0.1)",
        borderRadius: 16,
        flex: "none",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      onClick={() => _setIsPreviewMode(false)}
    >
      {_isPreviewMode ? (
        <div>
          <div>{placeholder}</div>
        </div>
      ) : (
        <div>
          <ReactQuill
            placeholder={placeholder}
            theme="snow"
            value={value}
            onChange={setValue}
          />
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <CreateBountyBtn />
        <Button label={"Post"} disabled={isSubmitDisabled} />
      </div>
    </div>
  )

  return ;
}


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

  const handleCreate = () => {
    alert('creating comment')
  }

  const handleUpdate = () => {
    alert('updating comment')
  }

  const handleRemove = () => {
    alert('removing comment')
  }

  return (
    <div style={{
      padding: "24px 32px",
    }}>
      <CommentEditor isPreview={true} />
      <DocumentActivityFeed />
    </div>    
  )
}

export default CommentsIndex;