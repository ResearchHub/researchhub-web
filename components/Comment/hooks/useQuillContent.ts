import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import Quill from 'quill';

type Args = {
  quill: Quill | undefined,
  content: object,
}

const useQuillContent = ({ quill, content = {} }: Args) => {

  const [_content, _setContent] = useState<object>(content);
  const contentRef = useRef<object>(_content);

  useEffect(() => {
    if (quill) {
      quill.on('text-change', (delta, oldDelta, source) => {
        const nextContent = quill.getContents();
        _setContent(nextContent);
        contentRef.current = nextContent;
      });
    }
  }, [quill]);

  return {
    content: _content,
  }
}

export default useQuillContent;