import { useRef, useState, useEffect, RefObject } from "react";
import Quill, { QuillOptionsStatic } from "quill";

export const buildQuillModules = ({
  editorId,
}) => {
  const modules = {
    magicUrl: true,
    mentions: true,
    toolbar: {
      magicUrl: true,
      container: `#${editorId}`,
      handlers: {
        image: () => null,
      },
    },
  };

  return modules;
};

export const formats = [
  "image",
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "video",
  "clean",
  "background",
  "code-block",
  "direction",
  "peer-review-rating",
  "suggestUsers",
  "user",
];


type Args = {
  options: QuillOptionsStatic;
  editorId: String;
}

export const useQuill = ({ options, editorId }: Args) => {
  const quillRef: RefObject<any> = useRef();

  const [modulesRegistered, setModulesRegistered] = useState<boolean>(false);
  const [obj, setObj] = useState({
    Quill: undefined as any | undefined,
    quillRef,
    quill: undefined as Quill | undefined,
    editorRef: quillRef,
    editor: undefined as Quill | undefined,
    isReady: false,
  });

  useEffect(() => {
    const quillLibLoaded = Boolean(obj.Quill);
    const readyToCreateQuillInstance = quillLibLoaded && modulesRegistered && !obj.quill && quillRef && quillRef.current;

    const _loadQuillModules = async ({ quillLib }) => {
      import('../lib/quill/loadQuillModules').then((loadQuillModules) => {
        loadQuillModules.default({ quillLib });
        setModulesRegistered(true);
      });
    }

    if (quillLibLoaded) {
      if (!modulesRegistered) {
        _loadQuillModules({ quillLib: obj.Quill });
      }
    }
    else {
      setObj((prev) => ({ ...prev, Quill: require("quill") }));
    }

    if (readyToCreateQuillInstance && !obj.quill) {
      const modules = buildQuillModules({ editorId });
      const opts = {
        ...options,
        modules,
        formats,
        theme: "snow",
      };

      const quill = new obj.Quill(quillRef.current, opts);
      setObj((prev) => ({
        ...prev,
        quill,
        editor: quill,
        isReady: true,
      }));
    }

  }, [obj, options, modulesRegistered]);

  return obj;
};
