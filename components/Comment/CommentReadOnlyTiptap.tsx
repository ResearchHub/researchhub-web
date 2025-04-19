'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/pro-solid-svg-icons";
import { Comment, ContentFormat } from "./lib/types";
import 'highlight.js/styles/atom-one-dark.css';
import React, { ReactNode, useState } from 'react';
import { parseContent, extractTextFromTipTap } from './lib/commentContentUtils';
import { renderQuillContent, truncateContent } from './lib/renderUtils';
import TipTapRenderer from './lib/TipTapRenderer';
import { CommentContent } from './lib/types';

interface CommentReadOnlyProps {
  content: CommentContent;
  contentFormat?: ContentFormat;
  debug?: boolean;
  maxLength?: number;
  initiallyExpanded?: boolean;
  showReadMoreButton?: boolean;
}

// Replace Star component with FontAwesome
const ReadOnlyStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <FontAwesomeIcon
          key={star}
          icon={faStar}
          className={`mr-0.5 ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

interface SectionHeaderProps {
  title: string;
  description?: string;
  rating?: number;
}

// Review section header component
const ReviewSectionHeader = ({ title, description, rating }: SectionHeaderProps) => {
  return (
    <div className="mb-4 border-b pb-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{title}</h3>
        {rating && rating > 0 && <ReadOnlyStars rating={rating} />}
      </div>
      {description && <p className="text-gray-600 mt-1">{description}</p>}
    </div>
  );
};

export const CommentReadOnlyTiptap = ({
  content,
  contentFormat = 'TIPTAP',
  maxLength = 300,
  initiallyExpanded = false,
  showReadMoreButton = true,
}: CommentReadOnlyProps) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  const parsedContent = parseContent(content, contentFormat);

  const textContent =
    contentFormat === 'TIPTAP'
      ? extractTextFromTipTap(parsedContent)
      : typeof content === 'string'
        ? content
        : JSON.stringify(content);

  const shouldTruncate = textContent.length > maxLength;

  const getFormattedContent = () => {
    if (!parsedContent) {
      return null;
    }

    let renderedContent: ReactNode[] = [];

    // Check if content is actually in Quill format regardless of contentFormat setting
    const isQuillFormat = parsedContent.ops && Array.isArray(parsedContent.ops);

    // Use the correct renderer based on actual content format
    if (isQuillFormat) {
      try {
        renderedContent = [];
      } catch (error) {
        console.error('[CommentReadOnly] Error rendering QUILL content:', error);
      }
    } else if (contentFormat === 'TIPTAP') {
      try {
        // Force debug to true to see what's happening
        const debugEnabled = true;

        // Use the TipTapRenderer component
        renderedContent = [
          <TipTapRenderer
            key="tiptap-renderer"
            content={parsedContent}
            renderSectionHeader={(props) => (
              <ReviewSectionHeader key={`section-${props.title}`} {...props} />
            )}
            truncate={shouldTruncate && !isExpanded}
            maxLength={maxLength}
            debug={debugEnabled}
          />,
        ];
      } catch (error) {
        console.error('[CommentReadOnly] Error rendering TIPTAP content:', error);
      }
    } else {
      // For plain text, handle truncation directly
      let displayContent = String(content);
      if (!isExpanded && shouldTruncate) {
        displayContent = displayContent.substring(0, maxLength) + '...';
      }
      renderedContent = [<p key="default">{displayContent}</p>];
    }

    if (renderedContent.length === 0) {
      return null;
    }

    if (contentFormat === 'QUILL_EDITOR') {
      try {
        // Group list items for better HTML representation
        let htmlContent = '';
        let currentListType: string | null = null;
        let isInList = false;

        // Process each op and build a better HTML representation
        parsedContent.ops?.forEach((op: any) => {
          if (typeof op.insert === 'string') {
            const attributes = op.attributes || {};

            // Handle list items
            if (attributes.list) {
              // Start a new list if needed
              if (!isInList || currentListType !== attributes.list) {
                // Close previous list if any
                if (isInList) {
                  htmlContent += currentListType === 'ordered' ? '</ol>' : '</ul>';
                }

                // Start new list
                htmlContent +=
                  attributes.list === 'ordered'
                    ? '<ol class="debug-ordered-list">'
                    : '<ul class="debug-bullet-list">';
                isInList = true;
                currentListType = attributes.list;
              }

              // Add list item with formatting
              let itemContent = op.insert;
              if (attributes.bold) itemContent = `<strong>${itemContent}</strong>`;
              if (attributes.italic) itemContent = `<em>${itemContent}</em>`;
              if (attributes.link) itemContent = `<a href="${attributes.link}">${itemContent}</a>`;

              htmlContent += `<li>${itemContent}</li>`;
            } else {
              // Close any open list
              if (isInList) {
                htmlContent += currentListType === 'ordered' ? '</ol>' : '</ul>';
                isInList = false;
                currentListType = null;
              }

              // Handle normal text with formatting
              let textContent = op.insert;
              if (attributes.bold) textContent = `<strong>${textContent}</strong>`;
              if (attributes.italic) textContent = `<em>${textContent}</em>`;
              if (attributes.link) textContent = `<a href="${attributes.link}">${textContent}</a>`;

              if (op.insert === '\n') {
                htmlContent += '<br/>';
              } else {
                htmlContent += textContent;
              }
            }
          }
        });

        // Close any remaining list
        if (isInList) {
          htmlContent += currentListType === 'ordered' ? '</ol>' : '</ul>';
        }
      } catch (error) {
        console.error('[CommentReadOnly] Error creating HTML debug output:', error);
      }
    }

    // Only show the Read more button if content should be truncated and showReadMoreButton is true
    return (
      <>
        <div className={contentFormat === 'QUILL_EDITOR' ? 'quill-content-container' : ''}>
          {renderedContent}
        </div>
        {shouldTruncate && showReadMoreButton && (
          <button
            className="text-blue-600 hover:text-blue-800 hover:underline text-sm cursor-pointer mt-1"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </>
    );
  };

  return (
    <div className="comment-content prose prose-sm max-w-none">
      <style jsx global>{`
        /* Maintain common styling for backwards compatibility */
        .quill-content ol,
        .quill-document ol {
          list-style-type: decimal !important;
          padding-left: 2rem !important;
          margin: 1rem 0 !important;
          display: block !important;
          counter-reset: none !important;
        }
        .quill-content ol li,
        .quill-document ol li {
          display: list-item !important;
          position: relative !important;
          list-style-type: decimal !important;
          list-style-position: outside !important;
          margin-left: 0.5rem !important;
        }
        .quill-content ol li::before,
        .quill-document ol li::before {
          content: none !important;
        }
        .quill-content ul,
        .quill-document ul {
          list-style-type: disc !important;
          padding-left: 2rem !important;
          margin: 1rem 0 !important;
          display: block !important;
        }
        .quill-content li,
        .quill-document li {
          margin-bottom: 0.5rem !important;
          display: list-item !important;
        }
        .quill-content p,
        .quill-document p {
          margin: 0.75rem 0 !important;
        }
        .quill-content a,
        .quill-document a {
          color: #3b82f6 !important;
          text-decoration: none !important;
        }
        .quill-content a:hover,
        .quill-document a:hover {
          text-decoration: underline !important;
        }
        .quill-content strong,
        .quill-document strong {
          font-weight: 600 !important;
        }
        .quill-content > p + p,
        .quill-document > p + p {
          margin-top: 1rem !important;
        }
        .quill-content h1,
        .quill-content h2,
        .quill-content h3,
        .quill-content h4,
        .quill-content h5,
        .quill-content h6,
        .quill-document h1,
        .quill-document h2,
        .quill-document h3,
        .quill-document h4,
        .quill-document h5,
        .quill-document h6 {
          margin-top: 1.5rem !important;
          margin-bottom: 1rem !important;
          font-weight: 600 !important;
        }

        /* Debug classes - only visible when debug is enabled */
        .quill-content-container {
          /* Commented out for production use */
          /*
          border: 1px dashed rgba(0, 0, 255, 0.2);
          padding: 5px;
          */
        }
        .quill-content-container::before {
          /* Commented out for production use */
          /*
          content: 'Quill Container';
          display: block;
          font-size: 10px;
          color: blue;
          opacity: 0.5;
          */
        }
      `}</style>
      {getFormattedContent()}
    </div>
  );
};
