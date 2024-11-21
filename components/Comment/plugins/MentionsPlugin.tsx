import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useState, useRef } from 'react';
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW, KEY_BACKSPACE_COMMAND, TextNode } from 'lexical';
import { css, StyleSheet } from 'aphrodite';
import SuggestUsers from '~/components/SearchSuggestion/SuggestUsers';
import { $createMentionNode, MentionNode } from '../nodes/MentionNode';
import colors from '~/config/themes/colors';

function MentionsPlugin() {
  const [editor] = useLexicalComposerContext();
  const [mentionPopupOpen, setMentionPopupOpen] = useState(false);
  const [mentionPopupPosition, setMentionPopupPosition] = useState({ x: 0, y: 0 });
  const [mentionQuery, setMentionQuery] = useState('');
  const [isTypingMention, setIsTypingMention] = useState(false);
  const lastAtPositionRef = useRef<number | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  const closeMentionPopup = useCallback(() => {
    console.log('📕 Closing mention popup');
    
    // Clear any existing timeout
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
    }

    setMentionPopupOpen(false);
    setMentionQuery('');
    setIsTypingMention(false);
    lastAtPositionRef.current = null;
    editor.focus();

    // Set a timeout to prevent immediate reopening
    closeTimeoutRef.current = window.setTimeout(() => {
      closeTimeoutRef.current = null;
    }, 100) as unknown as number;
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const node = selection.anchor.getNode();
        if (!(node instanceof TextNode)) return;

        const textContent = node.getTextContent();
        const offset = selection.anchor.offset;

        console.log('📝 Editor update:', {
          textContent,
          offset,
          lastChar: textContent[offset - 1],
          mentionPopupOpen,
          isTypingMention,
          hasCloseTimeout: closeTimeoutRef.current !== null
        });

        // Check if user just typed "@"
        if (textContent[offset - 1] === '@' && !mentionPopupOpen && closeTimeoutRef.current === null) {
          console.log('@ detected');
          const currentPosition = offset - 1;
          lastAtPositionRef.current = currentPosition;
          setIsTypingMention(true);
          
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
        // Handle updates while popup is open
        else if (mentionPopupOpen && isTypingMention) {
          const textBeforeCursor = textContent.slice(0, offset);
          const atSymbolIndex = textBeforeCursor.lastIndexOf('@');
          
          // Close popup if we've backspaced over the @ symbol
          if (atSymbolIndex === -1) {
            closeMentionPopup();
            return;
          }

          // Update query based on text after @
          const query = textBeforeCursor.slice(atSymbolIndex + 1);
          setMentionQuery(query);

          // Close popup if backspace is pressed with empty query
          if (query === '' && textContent.length < lastAtPositionRef.current! + 1) {
            closeMentionPopup();
            return;
          }
        }
      });
    });
  }, [editor, mentionPopupOpen, isTypingMention, closeMentionPopup]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!mentionPopupOpen) return;
      
      if (event.key === 'Escape' || (event.key === 'Backspace' && mentionQuery === '')) {
        console.log('🔑 Closing popup via keyboard:', event.key);
        event.preventDefault();
        event.stopPropagation();
        closeMentionPopup();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [mentionPopupOpen, mentionQuery, closeMentionPopup]);

  // Handle clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!mentionPopupOpen) return;
      
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        console.log('👆 Click outside detected');
        event.preventDefault();
        event.stopPropagation();
        closeMentionPopup();
      }
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [mentionPopupOpen, closeMentionPopup]);

  const handleMentionSelect = useCallback((user) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      // Delete the @ symbol and query
      const queryLength = mentionQuery.length + 1;
      for (let i = 0; i < queryLength; i++) {
        selection.deleteCharacter(true);
      }
      
      // Create mention node with the user's name
      const mentionNode = $createMentionNode(
        `${user.firstName} ${user.lastName}`.trim(),
        user
      );
      selection.insertNodes([mentionNode]);
      
      // For debugging
      console.log('Created mention:', {
        name: `${user.firstName} ${user.lastName}`,
        user
      });
    });
    closeMentionPopup();
  }, [editor, mentionQuery, closeMentionPopup]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Add this effect to handle backspace on mention nodes
  useEffect(() => {
    return editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      (event) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          console.log('🔍 Backspace: Not a range selection');
          return false;
        }

        const node = selection.anchor.getNode();
        const prevSibling = node.getPreviousSibling();
        
        console.log('🔍 Backspace Debug:', {
          nodeType: node.getType(),
          nodeText: node.getTextContent(),
          offset: selection.anchor.offset,
          prevSiblingType: prevSibling?.getType(),
          prevSiblingText: prevSibling?.getTextContent(),
          isMentionNode: node instanceof MentionNode,
          isPrevMentionNode: prevSibling instanceof MentionNode,
          nodeLength: node.getTextContent().length
        });

        // Handle backspace at start of node after a mention
        if (selection.anchor.offset === 0 && prevSibling instanceof MentionNode) {
          console.log('🗑️ Removing previous mention node');
          prevSibling.remove();
          return true;
        }

        // Handle backspace on mention node itself
        if (node instanceof MentionNode) {
          console.log('🗑️ Removing current mention node');
          node.remove();
          return true;
        }

        // Handle backspace at start of text node after mention
        const textContent = node.getTextContent();
        if (textContent.startsWith('@') && selection.anchor.offset <= textContent.length) {
          console.log('🗑️ Removing mention text');
          node.remove();
          return true;
        }

        console.log('↩️ Letting default backspace behavior handle it');
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  return mentionPopupOpen ? (
    <div 
      ref={popupRef}
      className={css(styles.mentionPopup)} 
      style={{ 
        left: mentionPopupPosition.x,
        top: mentionPopupPosition.y
      }}
    >
      <SuggestUsers
        onSelect={handleMentionSelect}
        onChange={(text) => {
          console.log('🔍 SuggestUsers onChange:', text);
          // Update the query as user types
          setMentionQuery(text);
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