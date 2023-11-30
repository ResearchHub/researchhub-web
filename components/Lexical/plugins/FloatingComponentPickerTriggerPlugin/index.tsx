import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isNodeSelection,
  $isParagraphNode,
  $isRangeSelection,
  COMMAND_PRIORITY_NORMAL,
  SELECTION_CHANGE_COMMAND,
  LexicalEditor,
} from "lexical";
import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { setFloatingElemPositionForBlockToolbar } from "./utils";
import { mergeRegister } from "@lexical/utils";
import * as React from "react";

import AddIcon from "@mui/icons-material/Add";

type FloatingBlockToolbarProps = {
  editor: LexicalEditor;
  anchorElem: HTMLElement;
};

function FloatingBlockToolbarComponent({
  editor,
  anchorElem,
}: FloatingBlockToolbarProps) {
  const toolbarRef = useRef(null);

  const insertBackSlash = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.insertText("/");
      }
    });
  }, [editor]);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();

    const toolbarElem = toolbarRef.current;
    const nativeSelection = window.getSelection();

    if (toolbarElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection != null &&
      nativeSelection != null &&
      nativeSelection.isCollapsed &&
      rootElement != null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const paragraphNode = selection.getNodes()[0];
      if (!$isParagraphNode(paragraphNode)) {
        return;
      }
      const paragraphElem = editor.getElementByKey(paragraphNode.getKey());
      if (paragraphElem !== null) {
        const rangeRect = paragraphElem.getBoundingClientRect();
        setFloatingElemPositionForBlockToolbar(
          rangeRect,
          toolbarElem,
          anchorElem
        );
      }
    }
  }, [editor, anchorElem]);

  useEffect(() => {
    const update = () => {
      editor.getEditorState().read(() => {
        updateToolbar();
      });
    };

    window.addEventListener("resize", update);
    window.addEventListener("scroll", update);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [anchorElem, editor, updateToolbar]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateToolbar();
    });

    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_NORMAL
      )
    );
  }, [editor, updateToolbar]);

  return (
    <div className="floating-component-picker-trigger" ref={toolbarRef}>
      <button className={"floating-component-picker-trigger-button"}>
        {/* <div className="icon"> */}
        <AddIcon
          sx={{ height: 20, width: 20, fontSize: "small" }}
          onClick={insertBackSlash}
        />
        {/* </div> */}
      </button>
    </div>
  );
}

function useFloatingBlockToolbarPlugin(
  editor: LexicalEditor,
  anchorElem: HTMLElement
) {
  const [showToolbar, setShowToolbar] = useState(false);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isNodeSelection(selection)) {
          setShowToolbar(false);
        }
        if ($isRangeSelection(selection)) {
          const nodes = selection.getNodes();
          const anchorOffset = selection.anchor.offset;
          if (
            selection.isCollapsed() &&
            anchorOffset === 0 &&
            nodes.length === 1 &&
            $isParagraphNode(nodes[0])
          ) {
            setShowToolbar(true);
          } else {
            setShowToolbar(false);
          }
        }
      });
    });
  }, [editor, anchorElem]);

  if (!showToolbar) {
    return null;
  }

  return createPortal(
    <FloatingBlockToolbarComponent editor={editor} anchorElem={anchorElem} />,
    anchorElem
  );
}

export default function FloatingBlockToolbarPlugin({
  anchorElem = document.body,
}) {
  const [editor] = useLexicalComposerContext();
  return useFloatingBlockToolbarPlugin(editor, anchorElem);
}
