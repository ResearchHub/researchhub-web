import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND, createCommand, $getSelection, $isRangeSelection } from 'lexical';
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
} from '@fortawesome/pro-solid-svg-icons';
import { 
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from '@lexical/list';

export const TRIGGER_MENTIONS_COMMAND = createCommand('TRIGGER_MENTIONS_COMMAND');

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const triggerMentions = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      selection.insertText('@');
    });
    
    editor.dispatchCommand(TRIGGER_MENTIONS_COMMAND, undefined);
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
}); 