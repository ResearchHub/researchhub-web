import { useEffect, useState, useCallback } from "react";
import Quill from "quill";
import { isEmpty } from "~/config/utils/nullchecks";
import debounce from "lodash/debounce";

type Args = {
  quill: Quill | undefined;
  content: any;
  notifyOnContentChangeRate: number;
};

const useQuillContent = ({ quill, notifyOnContentChangeRate, content = {} }: Args) => {
  const [_content, setContent] = useState<any>(content);
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

      // This keybinding fixes a known issue in quill which that the space key is sometimes "stuck"
      // right after inserting an embed element like "Mentions"
      // @ts-ignore
      quill.keyboard.addBinding(
        {
          key: ' ',
          handler: (range, context) => {
            // @ts-ignore
            setTimeout(() => quill.setSelection(quill.getSelection().index + 10, 0), 0)
            return true
          }
        } as any);
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
