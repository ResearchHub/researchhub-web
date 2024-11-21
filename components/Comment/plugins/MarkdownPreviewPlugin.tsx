import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useState, useEffect } from 'react';
import { $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { $getRoot } from 'lexical';
import { css, StyleSheet } from 'aphrodite';

interface MarkdownPreviewProps {
  children: (props: {
    isPreviewMode: boolean;
    setIsPreviewMode: (isPreview: boolean) => void;
    MarkdownContent: JSX.Element | null;
  }) => React.ReactNode;
}

export function MarkdownPreviewPlugin({ children }: MarkdownPreviewProps) {
  const [editor] = useLexicalComposerContext();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const markdown = $convertToMarkdownString(TRANSFORMERS);
        setMarkdownContent(markdown);
      });
    });
  }, [editor]);

  const MarkdownContent = isPreviewMode ? (
    <div className={css(styles.markdownPreview)}>
      <pre>{markdownContent}</pre>
    </div>
  ) : null;

  return children({
    isPreviewMode,
    setIsPreviewMode,
    MarkdownContent
  });
}

const styles = StyleSheet.create({
  markdownPreview: {
    padding: '15px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #e1e4e8',
    borderRadius: '4px',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#24292e',
    height: '100%',
    overflow: 'auto'
  }
});