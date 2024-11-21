import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useState, useEffect } from 'react';
import { $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { $getRoot, $createTextNode, $createParagraphNode, $getSelection } from 'lexical';
import { css, StyleSheet } from 'aphrodite';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';

interface MarkdownPreviewProps {
  children: (props: {
    setIsPreviewMode: (isPreview: boolean) => void;
    MarkdownContent: JSX.Element | null;
  }) => React.ReactNode;
  isPreviewMode: boolean;
  setIsPreviewMode: (isPreview: boolean) => void;
}

export function MarkdownPreviewPlugin({ 
  children, 
  isPreviewMode, 
  setIsPreviewMode 
}: MarkdownPreviewProps) {
  const [editor] = useLexicalComposerContext();
  const [markdownContent, setMarkdownContent] = useState('');

  // Convert content to markdown when switching modes
  useEffect(() => {
    if (isPreviewMode) {
      editor.update(() => {
        const root = $getRoot();
        const markdown = $convertToMarkdownString(TRANSFORMERS, root);
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(markdown));
        root.clear();
        root.append(paragraph);
      });
    }
  }, [isPreviewMode, editor]);

  // Keep track of content updates
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const markdown = $convertToMarkdownString(TRANSFORMERS, root);
        setMarkdownContent(markdown);
      });
    });
  }, [editor]);

  const MarkdownContent = isPreviewMode ? (
    <PlainTextPlugin
      contentEditable={
        <ContentEditable 
          className={css(styles.markdownEditor)} 
        />
      }
      placeholder={
        <div className={css(styles.placeholder)}>
          Write your markdown here...
        </div>
      }
      ErrorBoundary={LexicalErrorBoundary}
    />
  ) : null;

  return children({
    setIsPreviewMode,
    MarkdownContent
  });
}

const styles = StyleSheet.create({
  markdownEditor: {
    width: '100%',
    height: '100%',
    minHeight: '150px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #e1e4e8',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#24292e',
    outline: 'none',
    position: 'relative',
    whiteSpace: 'pre-wrap',
  },
  placeholder: {
    position: 'absolute',
    top: '15px',
    left: '15px',
    color: '#6e7681',
    pointerEvents: 'none',
    userSelect: 'none',
  }
});