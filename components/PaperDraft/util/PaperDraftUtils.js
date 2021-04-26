import { convertFromHTML } from "draft-convert";
import { EditorState, convertFromRaw } from "draft-js";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import { ENTITY_KEY_TYPES, EXTRACTOR_TYPE } from "./PaperDraftUtilConstants";
import { htmlToBlockForCermine } from "./parse_tools/cermine";
import { htmlToBlockForEngrafo } from "./parse_tools/engrafo";
import { testHTML } from "./testHTML";

const htmlToBlock = ({ idsToRemove, node, nodeName, paperExtractorType }) => {
  switch (paperExtractorType) {
    case EXTRACTOR_TYPE.CERMINE:
      return htmlToBlockForCermine({ nodeName, node, idsToRemove });
    case EXTRACTOR_TYPE.ENGRAFO:
      return htmlToBlockForEngrafo({ nodeName, node, idsToRemove });
    default:
      return htmlToBlockForCermine({ nodeName, node, idsToRemove });
  }
};

const htmlToStyle = (nodeName, _node, currentStyle) => {
  if (nodeName === "xref") {
    return currentStyle.add("ITALIC");
  }
  return currentStyle;
};

const textToEntity = (text, createEntity, getEntity) => {
  console.warn("text: ", text);
  return [];
};

const htmlToEntity = (nodeName, node, createEntity) => {
  if (node == null) {
    return;
  }
  const { className } = node;
  if (
    (nodeName === "title" && className === "header") ||
    (nodeName === "p" && className === "last-paragraph")
  ) {
    const [name, index] = node.dataset.props.split("-");
    return createEntity(ENTITY_KEY_TYPES.WAY_POINT, "IMMUTABLE", {
      name: name,
      index: index,
    });
  } else if (nodeName != null) {
    return createEntity(ENTITY_KEY_TYPES.ENGRAFO_WRAP, "IMMUTABLE", {
      className: className,
    });
  }
};

// TODO: add engrafo mapping below.
const formatHTMLForMarkup = (base64) => {
  const sectionTitles = [];
  const idsToRemove = {};

  const html = decodeURIComponent(escape(window.atob(base64)));
  const doc = new DOMParser().parseFromString(html, "text/xml");
  const sections = [].slice.call(doc.getElementsByTagName("sec"));

  let count = 0;
  sections.forEach((section) => {
    const { parentNode } = section;

    const titleNode = section.getElementsByTagName("title")[0];
    const lastPNode = [].slice.call(section.getElementsByTagName("p")).pop();
    if (!titleNode || !lastPNode) {
      return (idsToRemove[section.id] = true);
    }

    const title = titleNode.textContent.trim().toLowerCase();
    const paragraph = lastPNode.textContent.trim();
    const { nodeName } = parentNode;
    if (
      title.length <= 1 ||
      paragraph.length <= 1 ||
      ["abstract", "front", "back"].includes(nodeName)
    ) {
      return (idsToRemove[section.id] = true);
    }

    if (nodeName === "article") {
      const data = `${title}-${count}`;
      const header = section.children[0];

      sectionTitles.push(title); // push title for tabbar

      section.className = "main-section";

      header.className = "header";
      header.setAttribute("data-props", data);

      lastPNode.className = "last-paragraph";
      lastPNode.setAttribute("data-props", data);

      count++;
    }
  });
  return [doc.documentElement.innerHTML, idsToRemove, sectionTitles];
};

/* ---------------------- EXPORTS ---------------------- */

export const formatBase64ToEditorState = (payload) => {
  const {
    base64 = "",
    currenEditorState = EditorState.createEmpty(),
    decorator = null,
    onError = emptyFncWithMsg,
    onSuccess = emptyFncWithMsg,
    paperExtractorType,
  } = payload ?? {};
  try {
    // TODO: calvinhlee - modify below when done.
    let [html, idsToRemove, sectionTitles] = formatHTMLForMarkup(base64);
    // html = paperExtractorType === EXTRACTOR_TYPE.CERMINE ? html : testHTML;
    const contentStateFromHTML = convertFromHTML({
      htmlToBlock: (nodeName, node) =>
        htmlToBlock({ idsToRemove, node, nodeName, paperExtractorType }),
      htmlToStyle,
      htmlToEntity,
      textToEntity,
    })(html, { flat: false });
    const newEditorState = EditorState.set(
      EditorState.push(currenEditorState, contentStateFromHTML),
      { decorator }
    );
    onSuccess({ sections: sectionTitles });
    return newEditorState;
  } catch (error) {
    onError("formatBase64ToEditorState: ", error);
  }
};

export const formatRawJsonToEditorState = (payload) => {
  const {
    decorator = null,
    onError = emptyFncWithMsg,
    onSuccess = emptyFncWithMsg,
    rawJson /* json formatted by draftJs & saved to backend */,
  } = payload ?? {};
  try {
    const { data, sections } = rawJson;
    const newEditorState = EditorState.set(
      EditorState.createWithContent(convertFromRaw(data)),
      { decorator }
    );
    onSuccess({ sections });
    return newEditorState;
  } catch (error) {
    onError("formatRawJsonToEditorState: ", error);
  }
};

export function getIsGoodTimeInterval(unixTimeInMilliSec) {
  return unixTimeInMilliSec === null
    ? true
    : Date.now() - unixTimeInMilliSec > 500; // 300-500 millisec is ui convention
}

export function getIsReadyForNewInlineComment({
  editorState,
  inlineCommentStore,
  isDraftInEditMode,
}) {
  if (editorState == null) {
    return false;
  }
  const currSelection = editorState.getSelection();
  const isGoodTimeInterval = getIsGoodTimeInterval(
    inlineCommentStore.get("lastPromptRemovedTime")
  );
  const hasActiveCommentPrompt =
    inlineCommentStore.get("promptedEntityKey") != null;
  return (
    !isDraftInEditMode &&
    isGoodTimeInterval &&
    !hasActiveCommentPrompt &&
    currSelection != null &&
    !currSelection.isCollapsed()
  );
}

export function getShouldSavePaperSilently({
  isDraftInEditMode,
  paperDraftStore,
}) {
  const isGoodTimeInterval = getIsGoodTimeInterval(
    paperDraftStore.get("lastSavePaperTime")
  );
  return (
    !isDraftInEditMode &&
    isGoodTimeInterval &&
    paperDraftStore.get("paperID") != null &&
    paperDraftStore.get("shouldSavePaper")
  );
}
