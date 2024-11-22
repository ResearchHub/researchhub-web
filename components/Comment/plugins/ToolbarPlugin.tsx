import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND, createCommand, $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND, COMMAND_PRIORITY_LOW, TextFormatType } from 'lexical';
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
import { faMarkdown } from "@fortawesome/free-brands-svg-icons";
import { $convertToMarkdownString } from '@lexical/markdown';
import { $getRoot } from 'lexical';

export const TRIGGER_MENTIONS_COMMAND = createCommand('TRIGGER_MENTIONS_COMMAND');

export function ToolbarPlugin({ isPreviewMode, setIsPreviewMode }) {
  const [editor] = useLexicalComposerContext();
  const [isCode, setIsCode] = useState(false);
  const [activeFormats, setActiveFormats] = useState<Set<TextFormatType>>(new Set());

  useEffect(() => {
    if (!editor) return;

    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        newEditor.getEditorState().read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const formats = new Set<TextFormatType>();
            
            if (isPreviewMode) {
              const node = selection.anchor.getNode();
              const text = node.getTextContent();
              const cursorOffset = selection.anchor.offset;

              // Helper function to check if cursor is within markdown syntax
              const isWithinMarkdown = (text: string, cursor: number, start: string, end: string) => {
                let startIndex = 0;
                while (true) {
                  const markStart = text.indexOf(start, startIndex);
                  if (markStart === -1) break;
                  
                  const markEnd = text.indexOf(end, markStart + start.length);
                  if (markEnd === -1) break;

                  if (cursor >= markStart && cursor <= markEnd + end.length) {
                    return true;
                  }
                  startIndex = markEnd + end.length;
                }
                return false;
              };

              // Check for different markdown formats
              if (isWithinMarkdown(text, cursorOffset, '*', '*') || 
                  isWithinMarkdown(text, cursorOffset, '**', '**')) {
                formats.add('bold');
              }
              if (isWithinMarkdown(text, cursorOffset, '_', '_')) {
                formats.add('italic');
              }
              if (isWithinMarkdown(text, cursorOffset, '__', '__')) {
                formats.add('underline');
              }

              console.log('Active formats:', Array.from(formats)); // Debug log
            } else {
              if (selection.hasFormat('bold')) formats.add('bold');
              if (selection.hasFormat('italic')) formats.add('italic');
              if (selection.hasFormat('underline')) formats.add('underline');
            }

            setActiveFormats(formats);
          }
        });
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, isPreviewMode]);

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

  const toggleFormat = (format: TextFormatType) => {
    if (isPreviewMode) {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;
        
        const text = selection.getTextContent();
        let newText = text;
        
        switch (format) {
          case 'bold':
            newText = text.startsWith('**') && text.endsWith('**') 
              ? text.slice(2, -2) 
              : `**${text}**`;
            break;
          case 'italic':
            newText = text.startsWith('_') && text.endsWith('_') 
              ? text.slice(1, -1) 
              : `_${text}_`;
            break;
          case 'underline':
            newText = text.startsWith('__') && text.endsWith('__') 
              ? text.slice(2, -2) 
              : `__${text}__`;
            break;
        }

        selection.insertText(newText);
      });
    } else {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    }
  };

  return (
    <div className={css(styles.toolbar)}>
      <button
        className={css(styles.button, activeFormats.has('bold') && styles.buttonActive)}
        onClick={() => toggleFormat('bold')}
        title="Bold"
      >
        <FontAwesomeIcon icon={faBold} />
      </button>
      <button
        className={css(styles.button, activeFormats.has('italic') && styles.buttonActive)}
        onClick={() => toggleFormat('italic')}
        title="Italic"
      >
        <FontAwesomeIcon icon={faItalic} />
      </button>
      <button
        className={css(styles.button, activeFormats.has('underline') && styles.buttonActive)}
        onClick={() => toggleFormat('underline')}
        title="Underline"
      >
        <FontAwesomeIcon icon={faUnderline} />
      </button>
      <span className={css(styles.divider)} />
      <button
        className={css(styles.button)}
        onClick={() => {
          if (isPreviewMode) {
            editor.update(() => {
              const selection = $getSelection();
              if (!$isRangeSelection(selection)) return;
              const text = selection.getTextContent();
              selection.insertText(`- ${text}`);
            });
          } else {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          }
        }}
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
      <button
        onClick={() => setIsPreviewMode(!isPreviewMode)}
        className={css(styles.toolbarItem, isPreviewMode && styles.activeButton)}
        title={isPreviewMode ? "Switch to Rich Text" : "Switch to Markdown"}
        aria-label={isPreviewMode ? "Switch to Rich Text" : "Switch to Markdown"}
      >
        <FontAwesomeIcon icon={faMarkdown} />
        <span className={css(styles.buttonLabel)}>
          {isPreviewMode ? "Markdown" : "Rich Text"}
        </span>
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
  '.toolbar': {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '4px 8px',
    borderBottom: '1px solid #ccc',
  },
  '.toolbar-item': {
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
    padding: '4px 8px',
    ':hover': {
      backgroundColor: '#f1f1f1',
    },
  },
  toolbarItem: {
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
    padding: '4px 8px',
    ':hover': {
      backgroundColor: '#f1f1f1',
    }
  },
  activeButton: {
    backgroundColor: '#e1e1e1',
    color: '#0366d6',
  },
  buttonLabel: {
    marginLeft: '4px',
    fontSize: '12px',
  }
}); 