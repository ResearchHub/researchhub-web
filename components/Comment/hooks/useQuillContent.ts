import { useEffect, useState, useCallback } from "react";
import Quill from "quill";
import { isEmpty } from "~/config/utils/nullchecks";
import debounce from "lodash/debounce";

type Args = {
  quill: Quill | undefined;
  content: object;
  notifyOnContentChangeRate: number;
};

const useQuillContent = ({ quill, notifyOnContentChangeRate, content = {} }: Args) => {
  const [_content, setContent] = useState<object>(content);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const debouncedSetContent = useCallback(debounce((c) => setContent(c), notifyOnContentChangeRate), [_content])

  useEffect(() => {
    if (quill) {
      quill.on("text-change", (delta, oldDelta, source) => {
        if (source === "user") {
          const nextContent = quill.getContents();
          debouncedSetContent(nextContent);
        }
      });
    }
  }, [quill]);

  useEffect(() => {
    if (quill) {
      if (!isInitialized && !isEmpty(content)) {
        // @ts-ignore
        quill!.setContents(content);
        debouncedSetContent(content);
      }

      setIsInitialized(true);
    }
  }, [isInitialized, content, quill]);

  return {
    content: _content,
    dangerouslySetContent: (content) => {
      quill!.setContents(content);
      setContent(content);
    },
  };
};

export default useQuillContent;
