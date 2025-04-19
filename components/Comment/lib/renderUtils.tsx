import React, { ReactNode } from 'react';
import { StyleSheet, css } from 'aphrodite';
import colors from '~/config/themes/colors';

export interface SectionHeaderProps {
  title: string;
  description?: string;
  rating: number;
}

const styles = StyleSheet.create({
  spacer: {
    height: '2rem', // h-8
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  listItem: {
    marginBottom: '0.5rem', // mb-2
    fontSize: 16, // Match base size
  },
  link: {
    color: colors.BLUE(1),
    fontSize: 16, // Match base size
    ':hover': {
      textDecoration: 'underline',
    },
  },
  orderedList: {
    listStyleType: 'decimal',
    paddingLeft: '1.5rem', // pl-6
    margin: '1rem 0', // my-4
    fontSize: 16, // Match base size
    '> li': {
      marginTop: '0.25rem', // space-y-1
    },
  },
  bulletList: {
    listStyleType: 'disc',
    paddingLeft: '1.5rem', // pl-6
    margin: '1rem 0', // my-4
    fontSize: 16, // Match base size
    '> li': {
      marginTop: '0.25rem', // space-y-1
    },
  },
  blockquote: {
    borderLeft: `4px solid ${colors.GREY(0.3)}`, // border-l-4 border-gray-300
    paddingLeft: '1rem', // pl-4
    fontStyle: 'italic',
    color: colors.GREY_TEXT(0.6), // text-gray-600
    margin: '1rem 0', // my-4
    fontSize: 16, // Match base size
  },
  codeBlock: {
    backgroundColor: colors.BLACK(0.9), // bg-gray-800
    color: colors.WHITE(1), // text-gray-100
    padding: '1rem', // p-4
    borderRadius: 4, // rounded
    margin: '1rem 0', // my-4
    overflowX: 'auto',
    fontSize: 14, // Slightly smaller for code
  },
  header: {
    fontWeight: 600, // font-bold
    fontSize: 18, // Slightly larger for headers
    margin: '1rem 0', // my-4
  },
  paragraph: {
    margin: '0.5rem 0', // my-2
    fontSize: 16, // Match base size
  },
  image: {
    margin: '1rem 0', // my-4
    maxWidth: '100%', // max-w-full
  },
});

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
        result.push(
          <div
            key={`spacer-${blockIndex}`}
            className={css(styles.spacer)}
          />
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
            formattedText = <strong key={`bold-list-${blockIndex}-${itemIndex}`}>{formattedText}</strong>;
          if (attributes.italic)
            formattedText = <em key={`italic-list-${blockIndex}-${itemIndex}`}>{formattedText}</em>;
          if (attributes.underline)
            formattedText = <u key={`underline-list-${blockIndex}-${itemIndex}`}>{formattedText}</u>;
          if (attributes.strike)
            formattedText = <s key={`strike-list-${blockIndex}-${itemIndex}`}>{formattedText}</s>;
          if (attributes.link) {
            formattedText = (
              <a
                key={`link-list-${blockIndex}-${itemIndex}`}
                href={attributes.link}
                target="_blank"
                rel="noopener noreferrer"
                className={css(styles.link)}
              >
                {formattedText}
              </a>
            );
          }

          return (
            <li
              key={`li-${blockIndex}-${itemIndex}`}
              className={css(styles.listItem)}
              value={itemIndex + 1} // Explicitly set the number value
            >
              {formattedText}
            </li>
          );
        });

        result.push(
          <ol
            key={`ol-${blockIndex}`}
            className={css(styles.orderedList)}
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
            formattedText = <strong key={`bold-list-${blockIndex}-${itemIndex}`}>{formattedText}</strong>;
          if (attributes.italic)
            formattedText = <em key={`italic-list-${blockIndex}-${itemIndex}`}>{formattedText}</em>;
          if (attributes.underline)
            formattedText = <u key={`underline-list-${blockIndex}-${itemIndex}`}>{formattedText}</u>;
          if (attributes.strike)
            formattedText = <s key={`strike-list-${blockIndex}-${itemIndex}`}>{formattedText}</s>;
          if (attributes.link) {
            formattedText = (
              <a
                key={`link-list-${blockIndex}-${itemIndex}`}
                href={attributes.link}
                target="_blank"
                rel="noopener noreferrer"
                className={css(styles.link)}
              >
                {formattedText}
              </a>
            );
          }

          return (
            <li key={`li-${blockIndex}-${itemIndex}`} className={css(styles.listItem)}>
              {formattedText}
            </li>
          );
        });

        result.push(
          <ul key={`ul-${blockIndex}`} className={css(styles.bulletList)}>
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
                className={css(styles.blockquote)}
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
                className={css(styles.codeBlock)}
              >
                <code>{text}</code>
              </pre>
            );
            return;
          }

          if (attributes.header) {
            const HeaderTag = `h${attributes.header}` as keyof JSX.IntrinsicElements;
            result.push(
              <HeaderTag key={`h-${blockIndex}-${index}`} className={css(styles.header)}>
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
                className={css(styles.link)}
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
            <p key={`p-${blockIndex}`} className={css(styles.paragraph)}>
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
              className={css(styles.image)}
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
