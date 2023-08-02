import { useRef, useState, useEffect, RefObject } from "react";
import Quill, { QuillOptionsStatic } from "quill";
import { getFileUrl } from "../lib/api";
import toBase64 from "../lib/toBase64";
import Delta from "quill-delta";

export const buildQuillModules = ({ editorId }) => {
  const modules = {
    magicUrl: true,
    mentions: true,
    toolbar: {
      magicUrl: true,
      container: `#${editorId}`,
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
  editorId: string;
};

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

  const handleImageUpload = (quill) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async function () {
      const file = input!.files![0];
      const fileString = await toBase64(file);
      const type = file.type;
      const fileUrl = await getFileUrl({ fileString, type });
      const range = quill!.getSelection();

      // Create a Delta operation to insert the image
      const delta = new Delta().retain(range.index).insert({ image: fileUrl });

      // Apply the Delta operation and trigger a 'text-change' event
      quill.updateContents(delta, "user");
    };
  };

  useEffect(() => {
    const quillLibLoaded = Boolean(obj.Quill);
    const readyToCreateQuillInstance =
      quillLibLoaded &&
      modulesRegistered &&
      !obj.quill &&
      quillRef &&
      quillRef.current;

    const _loadQuillModules = async ({ quillLib }) => {
      import("../lib/quill/loadQuillModules").then((loadQuillModules) => {
        loadQuillModules.default({ quillLib });
        setModulesRegistered(true);
      });
    };

    if (quillLibLoaded) {
      if (!modulesRegistered) {
        _loadQuillModules({ quillLib: obj.Quill });
      }
    } else {
      setObj((prev) => ({ ...prev, Quill: require("quill") }));
    }

    if (readyToCreateQuillInstance && !obj.quill) {
      const modules = buildQuillModules({ editorId });
      const opts = {
        modules,
        formats,
        theme: "snow",
      };

      const quill = new obj.Quill(quillRef.current, opts);

      // Disable by default to avoid scroll "jumping"
      quill.disable();

      setObj((prev) => ({
        ...prev,
        quill,
        editor: quill,
        isReady: true,
      }));

      // We can only register image upload handler only once quill instance is available
      quill
        .getModule("toolbar")
        .addHandler("image", () => handleImageUpload(quill));

      // Tooltips can extend beyond the boundary of the editor
      // and in the context of annotations, clicking on them will result in the editor being dismissed
      try {
        const tooltip = document.querySelector(".ql-tooltip");
        if (tooltip) {
          tooltip.addEventListener("click", function (event) {
            event.stopPropagation();
          });
        }
      } catch (error) {}
    }
  }, [obj, options, modulesRegistered]);

  return obj;
};
