import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  CompositeDecorator,
} from "draft-js";

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

const formatBase64ToEditorState = ({
  base64,
  existingEditorState,
  onError,
  onSuccess,
}) => {
  const [html, idsToRemove, sectionTitles] = formatHTMLForMarkup(base64);
  try {
    const blocksFromHTML = convertFromHTML({
      htmlToBlock: (nodeName, node) =>
        this.htmlToBlock(nodeName, node, idsToRemove),
      htmlToStyle: this.htmlToStyle,
      htmlToEntity: this.htmlToEntity,
    })(html, { flat: true });

    return EditorState.set(
      EditorState.push(existingEditorState, blocksFromHTML),
      {
        decorator: this.decorator,
      }
    );
  } catch {
    onError();
  } finally {
    onSuccess();
  }
};

formatRawToEditorState = ({
  rawJson /* json formatted from backend */,
  handleError,
}) => {
  try {
    const { data, sections } = rawJson;
    return EditorState.set(
      EditorState.createWithContent(convertFromRaw(data)),
      { decorator: this.decorator }
    );
    this.updateParentState(sections);
  } catch {
    this.handleError();
  } finally {
    this.setState({ fetching: false });
  }
};

export const exportables = {
  formatBase64ToEditorState,
};
