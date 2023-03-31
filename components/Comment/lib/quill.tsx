import Quill from "quill";
import { reviewCategories } from "./options";
import StarInput from "~/components/Form/StarInput";
import ReactDOMServer from "react-dom/server";

export const buildQuillModules = ({
  editorId,
  handleSubmit,
  handleImageUpload,
}) => {
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
      // magicUrl: true,
      container: `#${editorId}`,
      handlers: {
        image: handleImageUpload,
      },
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

export function trimQuillEditorContents ({ contents }) {
  const deltas = Array.isArray(contents) ? contents : contents?.ops ? contents.ops : [];

  if (deltas.length > 0) {
    const firstDelta = deltas[0];
    const isFirstDeltaString = (typeof firstDelta?.insert === "string" && !firstDelta.attributes);

    if (isFirstDeltaString) {
      let trimmedStr = firstDelta.insert.trimStart();
      deltas[0].insert = trimmedStr;
    }

    const lastDelta = deltas[deltas.length - 1];
    const isLastDeltaString = (typeof lastDelta?.insert === "string" && !lastDelta.attributes);
    if (isLastDeltaString) {
      let trimmedStr = lastDelta.insert.trimEnd();
      deltas[deltas.length-1].insert = trimmedStr;
    }
  }

  return deltas;
}

export function hasQuillContent({ quill, contentType }: { quill: Quill|undefined, contentType?: string }) {
  if (!quill) return false;

  const contents = quill.getContents();
  const deltas = contents?.ops || [];
  let hasContent = false;

  for (let i = 0; i < deltas.length; i++) {
    if (contentType && deltas[i].insert?.[contentType]) {
      hasContent = true;
      break;
    }
    else if (
      (typeof deltas[i].insert === "object" && !deltas[i].insert?.["peer-review-rating"]) ||
      (typeof deltas[i].insert === "string" && deltas[i].insert.length > 0 && deltas[i].insert !== "\n")
    ) {
      hasContent = true;
      break;
    }
  }

  return hasContent;
}

export const insertReviewCategory = ({ quillRef, quill, category, index }: {
  quillRef: any;
  quill: Quill | undefined;
  category: any;
  index?: number
}) => {
  if (!quill) {
    return false;
  }

  let range = quill.getSelection(true);
  let insertAtIndex = index ?? range.index;
  if (insertAtIndex === 0 && category.value !== reviewCategories.overall.value) {
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
}

export const forceShowPlaceholder = ({
  quillRef,
  placeholderText = "What are your thoughts about this paper?",
}: {
  quillRef: any;
  placeholderText: string|undefined;
}) => {
  if (placeholderText && quillRef?.current) {
    const editorEl = quillRef.current.querySelector(".ql-editor");
    if (editorEl) {
      editorEl.setAttribute("data-placeholder", placeholderText);
      editorEl.classList.add("ql-blank");
    }
  }
};


export const focusEditor = ({ quill }: { quill: Quill|undefined }) => {
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
}

export const buildHtmlForReviewBlot = ({ node = null, category, starSize = "med", rating, withLabel = false, readOnly = false }: buildHtmlForReviewBlotArgs) => {
  // @ts-ignore
  const _rating = rating ? rating : (node ? node.getAttribute('data-rating') : 0);
  const starInput = <StarInput value={_rating} readOnly={readOnly} size={starSize} withLabel={withLabel} />
  const starInputAsHtml = ReactDOMServer.renderToString(starInput);

  return `
    <div class="ql-review-category">
      <div class="ql-review-category-label">${category}</div>
      <div class="ql-review-category-rating">${starInputAsHtml}</div>
    </div>
  `;
}
