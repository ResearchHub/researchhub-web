import { EditorState, convertFromRaw } from "draft-js";
import { convertFromHTML } from "draft-convert";

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

/* ------------------- EXPORTS ------------------- */
export function emptyFunction(message) {
  if (message == null) {
    console.warn("emptyFunction is used. this maybe a bug");
  } else {
    console.warn(message);
  }
}

export const formatBase64ToEditorState = (payload) => {
  const {
    base64 = "",
    currenEditorState = EditorState.createEmpty(),
    decorator = null,
    onError = emptyFunction,
    onSuccess = emptyFunction,
  } = payload ?? {};
  try {
    const [html, idsToRemove, sectionTitles] = formatHTMLForMarkup(base64);
    const blocksFromHTML = convertFromHTML({
      htmlToBlock: (nodeName, node) => htmlToBlock(nodeName, node, idsToRemove),
      htmlToStyle,
      htmlToEntity,
    })(html, { flat: true });
    const newEditorState = EditorState.set(
      EditorState.push(currenEditorState, blocksFromHTML),
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
    onError = emptyFunction,
    onSuccess = emptyFunction,
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
