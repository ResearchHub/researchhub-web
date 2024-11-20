import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useState } from 'react';
import { $getSelection, $isRangeSelection, TextNode } from 'lexical';
import { css, StyleSheet } from 'aphrodite';
import SuggestUsers from '~/components/SearchSuggestion/SuggestUsers';
import { $createMentionNode } from '../nodes/MentionNode';
import colors from '~/config/themes/colors';

function MentionsPlugin() {
  const [editor] = useLexicalComposerContext();
  const [mentionPopupOpen, setMentionPopupOpen] = useState(false);
  const [mentionPopupPosition, setMentionPopupPosition] = useState({ x: 0, y: 0 });
  const [mentionQuery, setMentionQuery] = useState('');

  const handleMentionSelect = useCallback((user) => {
    console.log('Selected user:', user);
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      // Delete the @ symbol and query
      const queryLength = mentionQuery.length + 1; // +1 for the @ symbol
      for (let i = 0; i < queryLength; i++) {
        selection.deleteCharacter(true);
      }
      
      // Make sure we have the required user data
      const mentionUser = {
        firstName: user.firstName || user.first_name,
        lastName: user.lastName || user.last_name,
        authorProfile: user.authorProfile || user, // Ensure authorProfile exists for Avatar
        id: user.id,
      };
      
      const mentionNode = $createMentionNode(
        `@${mentionUser.firstName} ${mentionUser.lastName}`, 
        mentionUser
      );
      selection.insertNodes([mentionNode]);
    });
    setMentionPopupOpen(false);
    setMentionQuery('');
  }, [editor, mentionQuery]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const node = selection.anchor.getNode();
        if (!(node instanceof TextNode)) return;

        const textContent = node.getTextContent();
        const offset = selection.anchor.offset;
        
        // Find the @ symbol before the cursor
        const textBeforeCursor = textContent.slice(0, offset);
        const atSymbolIndex = textBeforeCursor.lastIndexOf('@');
        
        if (atSymbolIndex !== -1) {
          const query = textBeforeCursor.slice(atSymbolIndex + 1);
          setMentionQuery(query);

          // Only show popup if we're in a mention context
          if (!mentionPopupOpen || query !== mentionQuery) {
            const editorElement = editor.getRootElement();
            if (!editorElement) return;

            const domSelection = window.getSelection();
            if (domSelection && domSelection.rangeCount > 0) {
              const range = domSelection.getRangeAt(0);
              const rect = range.getBoundingClientRect();
              const editorRect = editorElement.getBoundingClientRect();

              setMentionPopupPosition({
                x: rect.left - editorRect.left,
                y: rect.bottom - editorRect.top
              });
              setMentionPopupOpen(true);
            }
          }
        } else {
          // Close popup if there's no @ symbol before cursor
          setMentionPopupOpen(false);
          setMentionQuery('');
        }
      });
    });
  }, [editor, mentionQuery, mentionPopupOpen]);

  useEffect(() => {
    return editor.registerCommand(
      'keydown',
      (event: KeyboardEvent) => {
        if (event.key === 'Escape' && mentionPopupOpen) {
          setMentionPopupOpen(false);
          setMentionQuery('');
          return true;
        }
        return false;
      },
      1
    );
  }, [editor, mentionPopupOpen]);

  return mentionPopupOpen ? (
    <div 
      className={css(styles.mentionPopup)} 
      style={{ 
        left: mentionPopupPosition.x,
        top: mentionPopupPosition.y
      }}
    >
      <SuggestUsers
        onSelect={handleMentionSelect}
        onChange={(text) => {
          // Don't close the popup on change, let the main logic handle it
          console.log('SuggestUsers onChange:', text);
        }}
      />
    </div>
  ) : null;
}

const styles = StyleSheet.create({
  mentionPopup: {
    position: 'absolute',
    zIndex: 100,
    backgroundColor: 'white',
    borderRadius: 4,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    marginTop: 4,
  }
});

export default MentionsPlugin; 