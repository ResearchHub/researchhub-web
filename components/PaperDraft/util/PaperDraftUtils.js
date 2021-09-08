import { EditorState, convertFromRaw, ContentState } from "~/vendor/draft-js";
import { emptyFncWithMsg } from "~/config/utils/nullchecks";
import { convertFromHTML } from "~/vendor/draft-convert";

 let jsdom;
 let JSDOM;
 if (!process.browser) {
   jsdom = require("jsdom");
   JSDOM = jsdom.JSDOM;
 }


function serverDOMBuilder (html) {
  const { document: jsdomDocument, HTMLElement, HTMLAnchorElement } = (new JSDOM(`<!DOCTYPE html>`)).window
  // HTMLElement and HTMLAnchorElement needed on global for convertFromHTML to work
  global.HTMLElement = HTMLElement
  global.HTMLAnchorElement = HTMLAnchorElement

  const doc = jsdomDocument.implementation.createHTMLDocument('foo')
  doc.documentElement.innerHTML = html
  const body = doc.getElementsByTagName('body')[0]
  return body
}

export default function stateFromHTML (html) {
  // if DOMBuilder is undefined convertFromHTML will use the browser dom,
  //  hence we set DOMBuilder to undefined when document exist
  let DOMBuilder = process.browser ? undefined : serverDOMBuilder;

  // const blocksFromHTML = convertFromHTML(html, DOMBuilder)


   const blocksFromHTML = convertFromHTML({
     htmlToBlock: (nodeName, node) => htmlToBlock(nodeName, node, idsToRemove),
     htmlToStyle,
     htmlToEntity,
   })(html, { flat: true });

  console.log('blocksFromHTML', blocksFromHTML);

  return ContentState.createFromBlockArray(
     blocksFromHTML.contentBlocks,
     blocksFromHTML.entityMap,
   )
}

const htmlToBlock = (nodeName, node, idsToRemove) => {
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
};

const htmlToStyle = (nodeName, node, currentStyle) => {
  if (nodeName === "xref") {
    return currentStyle.add("ITALIC");
  }
  return currentStyle;
};

const htmlToEntity = (nodeName, node, createEntity) => {
  const { className } = node;

  if (
    (nodeName === "title" && className === "header") ||
    (nodeName === "p" && className === "last-paragraph")
  ) {
    const [name, index] = node.dataset.props.split("-");

    const entity = createEntity("WAYPOINT", "IMMUTABLE", {
      name: name,
      index: index,
    });

    return entity;
  }
};

const formatHTMLForMarkup = (base64) => {
  const sectionTitles = [];
  const idsToRemove = {};
  const base64Decoder = process.browser ? window.atob : (str) => Buffer.from(str, 'base64');


  const html = decodeURIComponent(escape(base64Decoder(base64)));

  let doc;
  if (process.browser) {
    doc = new DOMParser().parseFromString(html, "text/xml");

  }
  else {
    const dom = new JSDOM(html);
    doc = dom.window.document;
  console.log('dom.window.document', dom.window.document);
  console.log('doc', doc);
console.log(doc.getElementsByTagName("sec").length);
  }
  const sections = [].slice.call(doc.getElementsByTagName("sec"));

  let count = 0;
console.log('sections', sections.length);
  sections.forEach((section) => {


    const { parentNode } = section;

    const titleNode = section.getElementsByTagName("title")[0];
    const lastPNode = [].slice.call(section.getElementsByTagName("p")).pop();

    if (!titleNode || !lastPNode) {
      return (idsToRemove[section.id] = true);
    }

    const title = titleNode.textContent.trim().toLowerCase();
    const paragraph = lastPNode.textContent.trim();

    if (
      title.length <= 1 ||
      paragraph.length <= 1 ||
      parentNode.nodeName === "abstract" ||
      parentNode.nodeName === "front" ||
      parentNode.nodeName === "back"
    ) {
      return (idsToRemove[section.id] = true);
    }

    if (parentNode.nodeName === "article") {
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
  } = payload ?? {};
  // const [html, idsToRemove, sectionTitles] = formatHTMLForMarkup(base64);

  const [html, idsToRemove, sectionTitles] = formatHTMLForMarkup(base64);

  let DOMBuilder = process.browser ? undefined : serverDOMBuilder;

  // const blocksFromHTML = convertFromHTML(html, DOMBuilder)


   const blocksFromHTML = convertFromHTML({
     htmlToBlock: (nodeName, node) => htmlToBlock(nodeName, node, idsToRemove),
     htmlToStyle,
     htmlToEntity,
   })(html, { flat: true });

  console.log('blocksFromHTML', blocksFromHTML);

  // const state = ContentState.createFromBlockArray(
  //    blocksFromHTML.contentBlocks,
  //    blocksFromHTML.entityMap,
  //  )


  // console.log('state', state);

  // const blocksFromHTML = convertFromHTML(html)

   const newEditorState = EditorState.set(
     EditorState.push(currenEditorState, blocksFromHTML),
     { decorator }
   );

  // const newEditorState = state;




  return {
    paperDraftEditorState: newEditorState,
    paperDraftSections: sectionTitles  
  }    
};

export const formatRawJsonToEditorState = (payload) => {
  const {
    decorator = null,
    rawJson /* json formatted by draftJs & saved to backend */,
  } = payload ?? {};
  const { data, sections } = rawJson;
  const newEditorState = EditorState.set(
    EditorState.createWithContent(convertFromRaw(data)),
    { decorator }
  );

  return {
    paperDraftEditorState: newEditorState,
    paperDraftSections: sections  
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
