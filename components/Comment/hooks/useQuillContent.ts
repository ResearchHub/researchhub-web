import { useEffect, useState } from "react";
import Quill from "quill";
import { isEmpty } from "~/config/utils/nullchecks";

type Args = {
  quill: Quill | undefined;
  content: object;
};

const useQuillContent = ({ quill, content = {} }: Args) => {
  const [_content, _setContent] = useState<object>(content);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (quill) {
      quill.on("text-change", (delta, oldDelta, source) => {
        if (source === "user") {
          const nextContent = quill.getContents();
          _setContent(nextContent);
        }
      });
    }
  }, [quill]);

  useEffect(() => {
    if (quill) {
      if (!isInitialized && !isEmpty(content)) {
        quill!.setContents(content);
        _setContent(content);
      }

      setIsInitialized(true);
    }
  }, [isInitialized, content, quill]);

  return {
    content: _content,
    dangerouslySetContent: (content) => {
      quill!.setContents(content);
      _setContent(content);
    },
  };
};

export default useQuillContent;
