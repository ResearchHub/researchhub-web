import Quill from "quill";
import { reviewCategories } from "./options";
import StarInput from "~/components/Form/StarInput";
import ReactDOMServer from "react-dom/server";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

export const buildQuillModules = ({ editorId, handleSubmit }) => {
  const modules = {
    magicUrl: true,
    keyboard: {
      bindings: {
        commandEnter: {
          key: 13,
          shortKey: true,
          metaKey: true,
          handler: handleSubmit,
        },
      },
    },
    toolbar: {
      magicUrl: true,
      container: `#${editorId}`,
    },
  };

  return modules;
};

/**
 * @deprecated use hasQuillContent instead
 */
export default function isQuillEmpty(content) {
  return !content || JSON.stringify(content) === '{"ops":[{"insert":"\\n"}]}';
}

export const QuillFormats = [
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
];

export function trimQuillEditorContents({ contents }) {
  const deltas = Array.isArray(contents)
    ? contents
    : contents?.ops
    ? contents.ops
    : [];

  if (deltas.length > 0) {
    const firstDelta = deltas[0];
    const isFirstDeltaString =
      typeof firstDelta?.insert === "string" && !firstDelta.attributes;

    if (isFirstDeltaString) {
      const trimmedStr = firstDelta.insert.trimStart();
      deltas[0].insert = trimmedStr;
    }

    const lastDelta = deltas[deltas.length - 1];
    const isLastDeltaString =
      typeof lastDelta?.insert === "string" && !lastDelta.attributes;
    if (isLastDeltaString) {
      const trimmedStr = lastDelta.insert.trimEnd();
      deltas[deltas.length - 1].insert = trimmedStr;
    }
  }

  return deltas;
}

export function hasQuillContent({
  quill,
  contentType,
}: {
  quill: Quill | undefined;
  contentType?: string;
}) {
  if (!quill) return false;

  const contents = quill.getContents();
  const deltas = contents?.ops || [];
  let hasContent = false;

  for (let i = 0; i < deltas.length; i++) {
    if (contentType && deltas[i].insert?.[contentType]) {
      hasContent = true;
      break;
    } else if (
      (typeof deltas[i].insert === "object" &&
        !deltas[i].insert?.["peer-review-rating"]) ||
      (typeof deltas[i].insert === "string" &&
        deltas[i].insert.length > 0 &&
        deltas[i].insert !== "\n")
    ) {
      hasContent = true;
      break;
    }
  }

  return hasContent;
}

export const insertReviewCategory = ({
  quillRef,
  quill,
  category,
  index,
}: {
  quillRef: any;
  quill: Quill | undefined;
  category: any;
  index?: number;
}) => {
  if (!quill) {
    return false;
  }

  const range = quill.getSelection(true);
  let insertAtIndex = index ?? range.index;
  if (
    insertAtIndex === 0 &&
    category.value !== reviewCategories.overall.value
  ) {
    insertAtIndex++;
  }

  quill.insertEmbed(
    insertAtIndex,
    "peer-review-rating",
    {
      rating: 3,
      category: category.value,
    },
    "silent"
  );
};

export const placeCursorAtEnd = ({ quill }: { quill: Quill }) => {
  const range = quill.getLength();
  // @ts-ignore
  quill.setSelection(range + 1);
};

export const forceShowPlaceholder = ({
  quillRef,
  placeholderText = "What are your thoughts about this paper?",
}: {
  quillRef: any;
  placeholderText: string | undefined;
}) => {
  if (placeholderText && quillRef?.current) {
    const editorEl = quillRef.current.querySelector(".ql-editor");
    if (editorEl) {
      editorEl.setAttribute("data-placeholder", placeholderText);
      editorEl.classList.add("ql-blank");
    }
  }
};

export const focusEditor = ({ quill }: { quill: Quill | undefined }) => {
  if (quill) {
    quill.focus();
    placeCursorAtEnd({ quill });
  }
};

type buildHtmlForReviewBlotArgs = {
  node: any;
  category: string;
  starSize?: string;
  rating?: number;
  withLabel?: boolean;
  readOnly?: boolean;
};

export const buildHtmlForReviewBlot = ({
  node = null,
  category,
  starSize = "med",
  rating,
  withLabel = false,
  readOnly = false,
}: buildHtmlForReviewBlotArgs) => {
  // @ts-ignore
  const _rating = rating ? rating : node ? node.getAttribute("data-rating") : 0;
  const starInput = (
    <StarInput
      value={_rating}
      readOnly={readOnly}
      size={starSize}
      withLabel={withLabel}
    />
  );
  const starInputAsHtml = ReactDOMServer.renderToString(starInput);

  return `
    <div class="ql-review-category">
      <div class="ql-review-category-label">${category}</div>
      <div class="ql-review-category-rating">${starInputAsHtml}</div>
    </div>
  `;
};

export const textLength = ({ quillOps = [] }: { quillOps: Array<any> }) => {
  return quillOps.reduce(
    (length: number, op: any) =>
      length + (typeof op.insert === "string" ? op.insert.length : 0),
    0
  );
};

export const imageLength = ({ quillOps = [] }: { quillOps: Array<any> }) => {
  return quillOps.reduce(
    (length: number, op: any) => length + (op.insert.image ? 1 : 0),
    0
  );
};

export const trimDeltas = ({
  quillOps = [],
  maxLength = 0,
  maxImages = 1,
}: {
  quillOps: Array<any>;
  maxLength: number;
  maxImages: number;
}) => {
  const trimmedOps: Array<any> = [];
  let lengthSoFar = 0;
  let imagesSoFar = 0;
  for (let i = 0; i < quillOps.length; i++) {
    const op = quillOps[i];
    if (typeof op.insert === "string") {
      if (lengthSoFar + op.insert.length <= maxLength) {
        trimmedOps.push(op);
        lengthSoFar += op.insert.length;
      } else {
        const remainingLength = maxLength - lengthSoFar;
        const trimmed = op.insert.substring(0, remainingLength);
        const trimmedOp = Object.assign(Object.assign({}, op), {
          insert: trimmed,
        });
        trimmedOps.push(trimmedOp);
        break;
      }
    } else if (typeof op.insert === "object" && op.insert.image) {
      if (imagesSoFar < maxImages) {
        trimmedOps.push(op);
        imagesSoFar += 1;
      }
      if (imagesSoFar === maxImages) {
        break;
      }
    } else {
      trimmedOps.push(op);
    }
  }

  return trimmedOps;
};

export const quillDeltaToHtml = ({ ops }) => {
  const converter = new QuillDeltaToHtmlConverter(ops, {});
  // @ts-ignore
  converter.renderCustomWith(function (customOp, contextOp) {
    if (customOp.insert.type === "peer-review-rating") {
      const category = customOp.insert.value?.category;
      const label = reviewCategories[category]?.label || "Unknown category";
      const rating = customOp.insert.value?.rating;
      // @ts-ignore
      const html = buildHtmlForReviewBlot({
        category: label,
        readOnly: true,
        rating,
      });

      return html;
    } else {
      console.error("Unmanaged custom blot!");
    }
  });

  return converter.convert();
};

export function getPlainText({ quillOps = [] }) {
  let plainText = "";
  quillOps.forEach((op: any) => {
    if (typeof op.insert === "string") {
      plainText += op.insert;
    } else if (op.insert && !op.insert.image) {
      Object.keys(op.insert).forEach((key) => {
        if (key !== "image") {
          plainText += op.insert[key];
        }
      });
    }
  });

  return plainText;
}
