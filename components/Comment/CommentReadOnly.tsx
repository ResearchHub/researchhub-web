import ReactQuill from "react-quill";

type Args = {
  content: any
}

const CommentReadOnly = ({ content }: Args) => {
  return (
    <div>
      <ReactQuill
        value={content}
        readOnly={true}
        modules={{toolbar: false}}
      />
    </div>
  )
}

export default CommentReadOnly;