import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Imported from https://github.com/gtgalone/react-quilljs
// A lightweight alternative to react-quill

import { useRef, useState, useEffect, RefObject } from "react";
import Quill, { Delta, QuillOptionsStatic } from "quill";
import ReactDOMServer from "react-dom/server";
import {
  faVideo,
  faImagePolaroid,
  faLinkSimple,
} from "@fortawesome/pro-regular-svg-icons";
import { faQuoteLeft } from "@fortawesome/pro-solid-svg-icons";
import QuillPeerReviewRatingBlock from "../lib/quillPeerReviewRatingBlock";
// import dynamic from "next/dynamic";
// const EmbedVideo = dynamic(
//   () => import("../lib/quill/EmbedVideo"), {ssr: false}
// );

// console.log('EmbedVide', EmbedVideo)



const theme = "snow";

const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    [{ align: [] }],

    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],

    [{ size: ["small", false, "large", "huge"] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["link", "image", "video"],
    [{ color: [] }, { background: [] }],

    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  "bold",
  "italic",
  "underline",
  "strike",
  "align",
  "list",
  "indent",
  "size",
  "header",
  "link",
  "image",
  "video",
  "color",
  "background",
  "clean",
];

function assign(target: any, _varArgs: any) {
  "use strict";
  if (target === null || target === undefined) {
    throw new TypeError("Cannot convert undefined or null to object");
  }

  const to = Object(target);

  for (let index = 1; index < arguments.length; index++) {
    const nextSource = arguments[index];

    if (nextSource !== null && nextSource !== undefined) {
      for (const nextKey in nextSource) {
        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
          to[nextKey] = nextSource[nextKey];
        }
      }
    }
  }
  return to;
}

/**
 *
 * @param options Quill static options. https://github.com/gtgalone/react-quilljs#options
 * @returns Returns quill, quillRef, and Quill. https://github.com/gtgalone/react-quilljs#return
 */
export const useQuill = (
  options: QuillOptionsStatic | undefined = { theme, modules, formats }
) => {
  const quillRef: RefObject<any> = useRef();

  const [isLoaded, setIsLoaded] = useState(false);
  const [obj, setObj] = useState({
    Quill: undefined as any | undefined,
    quillRef,
    quill: undefined as Quill | undefined,
    editorRef: quillRef,
    editor: undefined as Quill | undefined,
    isReady: false,
  });

  useEffect(() => {
    if (!obj.Quill) {
      setObj((prev) => assign(prev, { Quill: require("quill") }));
    }
    if (obj.Quill && !obj.quill && quillRef && quillRef.current && isLoaded) {
      const opts = assign(options, {
        modules: assign(modules, options.modules),
        formats: options.formats || formats,
        theme: options.theme || theme,
      });
// console.log('EmbedVideo', EmbedVideo.load())
      if (!options.readOnly) {
        const MagicUrl = require("quill-magic-url").default;
        obj.Quill.register("modules/magicUrl", MagicUrl);

        obj.Quill.register(QuillPeerReviewRatingBlock);

        const EmbedVideo = require("../lib/quill/EmbedVideo").default;

        console.log("EmbedVideo", EmbedVideo)
        obj.Quill.register("modules/embedVideo", EmbedVideo);

        const icons = obj.Quill.import("ui/icons");
        icons.video = ReactDOMServer.renderToString(
          <FontAwesomeIcon icon={faVideo} />
        );
        icons.image = ReactDOMServer.renderToString(
          <FontAwesomeIcon icon={faImagePolaroid} />
        );
        icons.link = ReactDOMServer.renderToString(
          <FontAwesomeIcon icon={faLinkSimple} />
        );
        icons.blockquote = ReactDOMServer.renderToString(
          <FontAwesomeIcon icon={faQuoteLeft} />
        );
      }

      const quill = new obj.Quill(quillRef.current, opts);
      setObj(assign(assign({}, obj), { quill, editor: quill, isReady: true }));
    }
    setIsLoaded(true);
  }, [isLoaded, obj, options]);

  return obj;
};
