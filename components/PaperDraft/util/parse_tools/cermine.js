import { ENTITY_KEY_TYPES } from "../PaperDraftUtilConstants";

export const draftCssToCustomCssCermine = {
  "header-one": "RichEditor-h1",
  "header-two": "RichEditor-h2",
  paragraph: "RichEditor-p",
  unstyled: "RichEditor-p",
  [ENTITY_KEY_TYPES.INLINE_COMMENT]: ENTITY_KEY_TYPES.INLINE_COMMENT,
};

export function htmlToBlockForCermine({ idsToRemove, node, nodeName }) {
  if (idsToRemove[node.id] || idsToRemove[node.parentNode.id]) {
    return false;
  }

  switch (nodeName) {
    case "title":
      if (node.className === "header") {
        return {
          type: "header-one",
          data: {
            props: node.dataset.props,
          },
        };
      }
      return {
        type: "header-two",
        data: {},
      };
    case "p":
      return {
        type: "paragraph",
        data: {},
      };
    case "abstract":
    case "fig":
    case "graphic":
    case "front":
    case "back":
    case "journal":
    case "article-id":
      return false;
    default:
      return true;
  }
}
