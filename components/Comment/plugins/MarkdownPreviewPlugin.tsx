import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useState, useEffect } from 'react';
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
  TextFormatTransformer,
  Transformer,
} from '@lexical/markdown';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { $getRoot, $createTextNode, $createParagraphNode } from 'lexical';
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

  // Define custom format transformers with explicit priorities
  const customTextFormatTransformers: TextFormatTransformer[] = [
    {
      format: ['underline'],
      tag: '__',
      type: 'text-format',
      priority: 1, // Higher priority for underline
    },
    {
      format: ['bold'],
      tag: '**',
      type: 'text-format',
      priority: 0,
    },
    {
      format: ['italic'],
      tag: '_',
      type: 'text-format',
      priority: 0,
    }
  ];

  // Combine transformers, putting underline transformers first
  const MARKDOWN_TRANSFORMERS: Transformer[] = isPreviewMode 
    ? [
        ...customTextFormatTransformers,
        ...ELEMENT_TRANSFORMERS,
        ...TEXT_MATCH_TRANSFORMERS.filter(t => !t.match?.toString().includes('`')),
      ]
    : [
        ...customTextFormatTransformers,
        ...ELEMENT_TRANSFORMERS,
        ...TEXT_MATCH_TRANSFORMERS,
      ];

  // Handle mode switching
  useEffect(() => {
    editor.update(() => {
      const root = $getRoot();
      if (isPreviewMode) {
        // Converting to markdown mode
        const markdown = $convertToMarkdownString(MARKDOWN_TRANSFORMERS);
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(markdown));
        root.clear();
        root.append(paragraph);
      } else {
        // Converting to rich text mode
        const markdown = $convertToMarkdownString(MARKDOWN_TRANSFORMERS);
        console.log('Converting markdown:', markdown); // Debug log
        root.clear();
        $convertFromMarkdownString(markdown, MARKDOWN_TRANSFORMERS);
      }
    });
  }, [isPreviewMode, editor]);

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