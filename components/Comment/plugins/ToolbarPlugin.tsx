import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND, createCommand, $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND, COMMAND_PRIORITY_LOW } from 'lexical';
import { css, StyleSheet } from 'aphrodite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBold, 
  faItalic, 
  faUnderline, 
  faUndo, 
  faRedo,
  faListUl,
  faListOl,
  faAt,
  faCode,
} from '@fortawesome/pro-solid-svg-icons';
import { 
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from '@lexical/list';
import { 
  $createCodeNode,
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
  getDefaultCodeLanguage,
} from '@lexical/code';
import { useState, useEffect } from 'react';

export const TRIGGER_MENTIONS_COMMAND = createCommand('TRIGGER_MENTIONS_COMMAND');

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isCode, setIsCode] = useState(false);

  useEffect(() => {
    if (!editor) return;

    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        newEditor.getEditorState().read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();
            const focusNode = selection.focus.getNode();
            const isCodeBlock = 
              $isCodeNode(anchorNode) || 
              $isCodeNode(focusNode) || 
              $isCodeNode(anchorNode.getParent()) || 
              $isCodeNode(focusNode.getParent());
            setIsCode(isCodeBlock);
          }
        });
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  const triggerMentions = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      selection.insertText('@');
    });
    
    editor.dispatchCommand(TRIGGER_MENTIONS_COMMAND, undefined);
  };

  const insertCodeBlock = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const codeNode = $createCodeNode(getDefaultCodeLanguage());
        selection.insertNodes([codeNode]);
      }
    });
  };

  return (
    <div className={css(styles.toolbar)}>
      <button
        className={css(styles.button)}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        title="Bold"
      >
        <FontAwesomeIcon icon={faBold} />
      </button>
      <button
        className={css(styles.button)}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        title="Italic"
      >
        <FontAwesomeIcon icon={faItalic} />
      </button>
      <button
        className={css(styles.button)}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        title="Underline"
      >
        <FontAwesomeIcon icon={faUnderline} />
      </button>
      <span className={css(styles.divider)} />
      <button
        className={css(styles.button)}
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
        title="Bullet List"
      >
        <FontAwesomeIcon icon={faListUl} />
      </button>
      <button
        className={css(styles.button)}
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
        title="Numbered List"
      >
        <FontAwesomeIcon icon={faListOl} />
      </button>
      <span className={css(styles.divider)} />
      <button
        className={css(styles.button)}
        onClick={triggerMentions}
        title="Mention User"
      >
        <FontAwesomeIcon icon={faAt} />
      </button>
      <span className={css(styles.divider)} />
      <button
        className={css(styles.button, isCode && styles.buttonActive)}
        onClick={insertCodeBlock}
        title="Insert Code Block"
      >
        <FontAwesomeIcon icon={faCode} />
      </button>
      <span className={css(styles.divider)} />
      <button
        className={css(styles.button)}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        title="Undo"
      >
        <FontAwesomeIcon icon={faUndo} />
      </button>
      <button
        className={css(styles.button)}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        title="Redo"
      >
        <FontAwesomeIcon icon={faRedo} />
      </button>
    </div>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    display: 'flex',
    marginBottom: 1,
    padding: '8px 12px',
    position: 'sticky',
    top: 0,
    background: 'white',
    borderBottom: '1px solid #eee',
    zIndex: 2,
  },
  button: {
    border: 'none',
    background: 'none',
    borderRadius: 4,
    color: '#555',
    cursor: 'pointer',
    height: 32,
    width: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ':hover': {
      backgroundColor: '#eee',
    },
  },
  divider: {
    width: 1,
    backgroundColor: '#eee',
    margin: '0 8px',
  },
  buttonActive: {
    backgroundColor: '#e3e3e3',
    color: '#000',
  },
  '.editor-code': {
    backgroundColor: '#f5f5f5',
    fontFamily: 'monospace',
    fontSize: '13px',
    padding: '8px 12px',
    margin: '8px 0',
    borderRadius: '4px',
    whiteSpace: 'pre-wrap',
  },
}); 