import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useState, useRef } from 'react';
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
  const [isTypingMention, setIsTypingMention] = useState(false);
  const lastAtPositionRef = useRef<number | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  // Debug state changes
  useEffect(() => {
    console.log('🔄 State Update:', {
      mentionPopupOpen,
      isTypingMention,
      lastAtPosition: lastAtPositionRef.current,
      mentionQuery
    });
  }, [mentionPopupOpen, isTypingMention, mentionQuery]);

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

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log('🎹 Keydown event:', {
        key: event.key,
        mentionPopupOpen,
        isTypingMention
      });

      if (!mentionPopupOpen) {
        console.log('❌ Escape pressed but popup not open');
        return;
      }
      
      if (event.key === 'Escape') {
        console.log('🔑 Escape key pressed with popup open');
        event.preventDefault();
        event.stopPropagation();
        closeMentionPopup();
      }
    };

    console.log('🎧 Adding escape key listener');
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      console.log('🔕 Removing escape key listener');
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [mentionPopupOpen, closeMentionPopup]);

  // Handle clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      console.log('🖱️ Click event:', {
        mentionPopupOpen,
        isClickInsidePopup: popupRef.current?.contains(event.target as Node)
      });

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
      const queryLength = mentionQuery.length + 1; // +1 for the @ symbol
      for (let i = 0; i < queryLength; i++) {
        selection.deleteCharacter(true);
      }
      
      const mentionNode = $createMentionNode(`@${user.firstName} ${user.lastName}`, user);
      selection.insertNodes([mentionNode]);
    });
    closeMentionPopup();
  }, [editor, mentionQuery, closeMentionPopup]);

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

        // Check if user just typed "@" and we're not in a close timeout
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
      });
    });
  }, [editor, mentionPopupOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

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