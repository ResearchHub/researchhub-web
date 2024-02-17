import React, { useCallback, useMemo } from "react";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { throttle, debounce } from "lodash";
import { $getSelection } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import API from "~/config/api";
import { captureEvent } from "~/config/utils/events";
import { $getRoot, EditorState } from "lexical";

const saveDocument = async ({
  editor,
  editorState,
  noteId,
  onSaveSuccess,
  onSaveFail,
  currentNoteTitle,
}) => {
  try {
    const noteParams = {
      title: currentNoteTitle,
    };

    let contentResponse;

    const noteResponse = await fetch(
      API.NOTE({ noteId }),
      API.PATCH_CONFIG(noteParams)
    );

    if (noteResponse.ok) {
      const contentParams = {
        full_src: JSON.stringify(editorState.toJSON()),
        plain_text: "",
        note: noteId,
      };

      contentResponse = await fetch(
        API.NOTE_CONTENT(),
        API.POST_CONFIG(contentParams)
      );

      if (contentResponse.ok) {
        return onSaveSuccess && onSaveSuccess(contentResponse);
      }
    }

    return onSaveFail && onSaveFail(contentResponse || noteResponse);
  } catch (error) {
    captureEvent({
      error,
      msg: "Failed to save content",
      data: { noteId },
    });
  }
};

/**
 * AutoSavePlugin is a React component that adds autosave functionality to a Lexical editor.
 * It uses the debounce method from lodash to limit the frequency of autosave operations.
 *
 * @param {string} currentNoteTitle - The parsed title of the note.
 * @param {object} currentNote - The current note object.
 * @returns {JSX.Element} - The AutoSavePlugin component.
 */
function AutoSavePlugin({ currentNoteTitle, currentNote }) {
  // Get the editor instance from the Lexical context
  const [editor] = useLexicalComposerContext();

  /**
   * onSave is a callback that triggers the saveDocument function.
   * It is wrapped in useCallback to memoize it and prevent unnecessary re-creations.
   *
   * @param {EditorState} editorState - The current state of the Lexical editor.
   */
  const onSave = useCallback(
    (editorState) => {
      saveDocument({
        editor: editor,
        editorState: editorState,
        noteId: currentNote.id,
        onSaveSuccess: () => {
          console.log("success", editorState);
        },
        onSaveFail: (response) => {
          console.log(response);
        },
        currentNoteTitle: currentNoteTitle,
      });
    },

    [currentNote.id, currentNoteTitle, editor]
  );

  /**
   * debouncedSave is a memoized version of onSave, debounced with a delay.
   * It triggers onSave only after a specified delay of inactivity (3000ms).
   */
  const debouncedSave = useMemo(() => {
    return debounce((editorState) => onSave(editorState), 3000);
  }, [onSave]);

  return (
    /**
     * The OnChangePlugin triggers the debouncedSave function whenever the editor state changes.
     * This effectively sets up the autosave mechanism.
     */
    <OnChangePlugin
      onChange={(editorState) => {
        debouncedSave(editorState);
      }}
    />
  );
}

export default AutoSavePlugin;
