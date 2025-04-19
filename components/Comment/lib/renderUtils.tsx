import React, { ReactNode } from 'react';

export interface SectionHeaderProps {
  title: string;
  description?: string;
  rating: number;
}

/**
 * Renders Quill content as React nodes
 * @param quillContent The Quill content to render
 * @returns Array of React nodes
 */
export const renderQuillContent = (quillContent: any): ReactNode[] | null => {
  console.log('[renderQuillContent] Starting to render Quill content:', quillContent);

  if (!quillContent || !quillContent.ops) {
    console.error('[renderQuillContent] Invalid Quill content or missing ops:', quillContent);
    return null;
  }

  const result: ReactNode[] = [];
  let currentParagraph: ReactNode[] = [];

  // First pass: Identify sequence blocks (paragraphs, lists, etc)
  const blocks: any[] = [];
  let currentBlock: { type: string; items: any[] } | null = null;
  let newlineCount = 0;

  // Pre-process to handle consecutive newlines and group list items
  quillContent.ops.forEach((op: any, index: number) => {
    // Handle newlines and double newlines
    if (typeof op.insert === 'string' && op.insert === '\n') {
      newlineCount++;

      // If we have a current block, close it
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }

      // If we've seen two consecutive newlines, add a spacer
      if (newlineCount >= 2) {
        blocks.push({ type: 'spacer' });
        newlineCount = 0;
      }
      return;
    } else {
      // Reset newline counter on non-newline content
      newlineCount = 0;
    }

    // Handle special case for "Requirements:" to ensure spacing above it
    if (typeof op.insert === 'string' && op.insert.includes('Requirements:')) {
      console.log('[renderQuillContent] Found Requirements section, adding spacer before it');
      blocks.push({ type: 'spacer' });

      // If we're in a list block, push it before starting a paragraph
      if (currentBlock && currentBlock.type.startsWith('list-')) {
        blocks.push(currentBlock);
        currentBlock = null;
      }

      // Create a paragraph block for the Requirements text
      currentBlock = { type: 'paragraph', items: [] };
      currentBlock.items.push(op);
      return;
    }

    // Handle list items
    if (op.attributes?.list) {
      const listType = op.attributes.list;

      // If we're not in a list block or in a different list type, start a new list block
      if (!currentBlock || currentBlock.type !== `list-${listType}`) {
        if (currentBlock) {
          blocks.push(currentBlock);
        }
        currentBlock = { type: `list-${listType}`, items: [] };
      }

      // Add this item to the current list block
      currentBlock.items.push(op);
    }
    // Handle regular text content
    else if (typeof op.insert === 'string') {
      // If we're in a list block, push it and start a paragraph
      if (currentBlock && currentBlock.type.startsWith('list-')) {
        blocks.push(currentBlock);
        currentBlock = null;
      }

      // If we don't have a current block, start a paragraph block
      if (!currentBlock) {
        currentBlock = { type: 'paragraph', items: [] };
      }

      // Add the op to the current block
      currentBlock.items.push(op);
    }
    // Handle other types of content (images, etc)
    else {
      // Push any current block
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }

      // Add this as a standalone content block
      blocks.push({ type: 'content', items: [op] });
    }
  });

  // Push any remaining block
  if (currentBlock) {
    blocks.push(currentBlock);
  }

  console.log(
    `[renderQuillContent] Processed into ${blocks.length} content blocks:`,
    blocks.map((b) => `${b.type}(${b.items?.length || 0})`)
  );

  // Second pass: Render each block
  blocks.forEach((block, blockIndex) => {
    // Handle different block types
    switch (block.type) {
      case 'spacer': {
        // Add extra vertical space for consecutive newlines
        result.push(
          <div
            key={`spacer-${blockIndex}`}
            className="h-8"
            style={{ marginTop: '1rem', marginBottom: '1rem' }}
          ></div>
        );
        break;
      }

      case 'list-ordered': {
        // Render an ordered list
        const listItems = block.items.map((item: any, itemIndex: number) => {
          // Format the list item text
          let formattedText: ReactNode = item.insert;
          const attributes = item.attributes || {};

          if (attributes.bold)
            formattedText = (
              <strong key={`bold-list-${blockIndex}-${itemIndex}`}>{formattedText}</strong>
            );
          if (attributes.italic)
            formattedText = <em key={`italic-list-${blockIndex}-${itemIndex}`}>{formattedText}</em>;
          if (attributes.underline)
            formattedText = (
              <u key={`underline-list-${blockIndex}-${itemIndex}`}>{formattedText}</u>
            );
          if (attributes.strike)
            formattedText = <s key={`strike-list-${blockIndex}-${itemIndex}`}>{formattedText}</s>;
          if (attributes.link) {
            formattedText = (
              <a
                key={`link-list-${blockIndex}-${itemIndex}`}
                href={attributes.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {formattedText}
              </a>
            );
          }

          return (
            <li
              key={`li-${blockIndex}-${itemIndex}`}
              className="mb-2"
              value={itemIndex + 1} // Explicitly set the number value
            >
              {formattedText}
            </li>
          );
        });

        result.push(
          <ol
            key={`ol-${blockIndex}`}
            className="list-decimal pl-6 my-4 space-y-1"
            style={{
              listStyleType: 'decimal',
            }}
          >
            {listItems}
          </ol>
        );
        break;
      }

      case 'list-bullet': {
        // Render a bullet list
        const listItems = block.items.map((item: any, itemIndex: number) => {
          // Format the list item text
          let formattedText: ReactNode = item.insert;
          const attributes = item.attributes || {};

          if (attributes.bold)
            formattedText = (
              <strong key={`bold-list-${blockIndex}-${itemIndex}`}>{formattedText}</strong>
            );
          if (attributes.italic)
            formattedText = <em key={`italic-list-${blockIndex}-${itemIndex}`}>{formattedText}</em>;
          if (attributes.underline)
            formattedText = (
              <u key={`underline-list-${blockIndex}-${itemIndex}`}>{formattedText}</u>
            );
          if (attributes.strike)
            formattedText = <s key={`strike-list-${blockIndex}-${itemIndex}`}>{formattedText}</s>;
          if (attributes.link) {
            formattedText = (
              <a
                key={`link-list-${blockIndex}-${itemIndex}`}
                href={attributes.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {formattedText}
              </a>
            );
          }

          return (
            <li key={`li-${blockIndex}-${itemIndex}`} className="mb-2">
              {formattedText}
            </li>
          );
        });

        result.push(
          <ul key={`ul-${blockIndex}`} className="list-disc pl-6 my-4 space-y-1">
            {listItems}
          </ul>
        );
        break;
      }

      case 'paragraph': {
        // Reset and build paragraph content
        currentParagraph = [];

        // Process paragraph items
        block.items.forEach((op: any, index: number) => {
          const text = op.insert;
          const attributes = op.attributes || {};

          // Handle special blocks
          if (attributes.blockquote) {
            result.push(
              <blockquote
                key={`blockquote-${blockIndex}-${index}`}
                className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4"
              >
                {text}
              </blockquote>
            );
            return;
          }

          if (attributes.code) {
            result.push(
              <pre
                key={`code-${blockIndex}-${index}`}
                className="bg-gray-800 text-gray-100 p-4 rounded my-4 overflow-x-auto"
              >
                <code>{text}</code>
              </pre>
            );
            return;
          }

          if (attributes.header) {
            const HeaderTag = `h${attributes.header}` as keyof JSX.IntrinsicElements;
            result.push(
              <HeaderTag key={`h-${blockIndex}-${index}`} className="font-bold text-lg my-4">
                {text}
              </HeaderTag>
            );
            return;
          }

          // Format regular text
          let formattedText: ReactNode = text;

          if (attributes.bold)
            formattedText = <strong key={`bold-${blockIndex}-${index}`}>{formattedText}</strong>;
          if (attributes.italic)
            formattedText = <em key={`italic-${blockIndex}-${index}`}>{formattedText}</em>;
          if (attributes.underline)
            formattedText = <u key={`underline-${blockIndex}-${index}`}>{formattedText}</u>;
          if (attributes.strike)
            formattedText = <s key={`strike-${blockIndex}-${index}`}>{formattedText}</s>;
          if (attributes.link) {
            formattedText = (
              <a
                key={`link-${blockIndex}-${index}`}
                href={attributes.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {formattedText}
              </a>
            );
          }

          // Add to current paragraph
          currentParagraph.push(<span key={`span-${blockIndex}-${index}`}>{formattedText}</span>);
        });

        // Add the paragraph if it has content
        if (currentParagraph.length > 0) {
          result.push(
            <p key={`p-${blockIndex}`} className="my-2">
              {currentParagraph}
            </p>
          );
        }
        break;
      }

      case 'content': {
        // Handle misc content like images
        const op = block.items[0];
        if (op.insert?.image) {
          result.push(
            <img
              key={`img-${blockIndex}`}
              src={op.insert.image}
              alt="Embedded content"
              className="my-4 max-w-full"
            />
          );
        }
        break;
      }
    }
  });

  console.log(`[renderQuillContent] Rendering complete, produced ${result.length} elements`);
  return result;
};

/**
 * Truncates content to a reasonable length for preview
 * @param content Array of React nodes to truncate
 * @returns Truncated content
 */
export const truncateContent = (content: ReactNode[]): ReactNode[] => {
  if (!content || content.length === 0) return [];

  // For simplicity, just return the first element
  // This could be enhanced to be smarter about truncation
  return [content[0]];
};
