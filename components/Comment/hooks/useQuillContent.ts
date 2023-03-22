import { useEffect, useState } from "react";
import Quill from 'quill';

type Args = {
  quill: Quill | undefined,
  content: object,
}

const useQuillContent = ({ quill, content = {} }: Args) => {
  const [_content, _setContent] = useState<object>(content);

  useEffect(() => {
    if (quill) {
      quill.on('text-change', (delta, oldDelta, source) => {
        if (source === "user") {
          const nextContent = quill.getContents();
          _setContent(nextContent);
        }
      });
    }
  }, [quill]);
  
  return {
    content: _content,
    dangerouslySetContent: (content) => {
      quill!.setContents(content)
      _setContent(content);
    },
  }
}

export default useQuillContent;