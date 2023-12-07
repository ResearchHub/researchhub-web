import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateNodesFromDOM } from "@lexical/html";
import { $insertNodes, $getRoot } from "lexical";

function ConvertCKEditorStatePlugin(CKEditorState): null {
  const [editor] = useLexicalComposerContext();

  function isHTML(str) {
    const doc = new DOMParser().parseFromString(str, "text/html");
    return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1);
  }

  console.log("alio mallio qallio", isHTML(CKEditorState));

  if (isHTML(CKEditorState)) {
    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(CKEditorState, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      $getRoot().select();
      $insertNodes(nodes);
    });
  }
  return null;
}

export default ConvertCKEditorStatePlugin;
