import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

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