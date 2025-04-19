"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/pro-solid-svg-icons";
import { ContentFormat } from "./lib/types";
import "highlight.js/styles/atom-one-dark.css";
import React, { ReactNode, useState } from "react";
import { parseContent, extractTextFromTipTap } from "./lib/commentContentUtils";
import TipTapRenderer from "./lib/TipTapRenderer";
import { CommentContent } from "./lib/types";
import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";

interface CommentReadOnlyProps {
  content: CommentContent;
  contentFormat?: ContentFormat;
  debug?: boolean;
  maxLength?: number;
  initiallyExpanded?: boolean;
  showReadMoreButton?: boolean;
}

const ReadOnlyStars = ({ rating }: { rating: number }) => {
  return (
    <div className={css(styles.starContainer)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FontAwesomeIcon
          key={star}
          icon={faStar}
          className={css(
            star <= rating ? styles.starActive : styles.starInactive
          )}
        />
      ))}
    </div>
  );
};

export interface SectionHeaderProps {
  title: string;
  description?: string;
  rating: number;
}

// Review section header component
const ReviewSectionHeader = ({
  title,
  description,
  rating,
}: SectionHeaderProps) => {
  return (
    <div className={css(styles.sectionHeader)}>
      <div className={css(styles.headerContent)}>
        <h3 className={css(styles.headerTitle)}>{title}</h3>
        {rating && rating > 0 && <ReadOnlyStars rating={rating} />}
      </div>
      {description && (
        <p className={css(styles.headerDescription)}>{description}</p>
      )}
    </div>
  );
};

export const CommentReadOnlyTiptap = ({
  content,
  contentFormat = "TIPTAP",
  maxLength = 300,
  initiallyExpanded = false,
  showReadMoreButton = true,
  debug = false,
}: CommentReadOnlyProps) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  const parsedContent = parseContent(content, contentFormat);

  const textContent =
    contentFormat === "TIPTAP"
      ? extractTextFromTipTap(parsedContent)
      : typeof content === "string"
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
        console.error(
          "[CommentReadOnly] Error rendering QUILL content:",
          error
        );
      }
    } else if (contentFormat === "TIPTAP") {
      try {
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
            debug={debug}
          />,
        ];
      } catch (error) {
        console.error(
          "[CommentReadOnly] Error rendering TIPTAP content:",
          error
        );
      }
    } else {
      // For plain text, handle truncation directly
      let displayContent = String(content);
      if (!isExpanded && shouldTruncate) {
        displayContent = displayContent.substring(0, maxLength) + "...";
      }
      renderedContent = [<p key="default">{displayContent}</p>];
    }

    if (renderedContent.length === 0) {
      return null;
    }


    // Only show the Read more button if content should be truncated and showReadMoreButton is true
    return (
      <>
        <div>
          {renderedContent}
        </div>
        {shouldTruncate && showReadMoreButton && (
          <span
            role="button"
            tabIndex={0}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Show less content" : "Show more content"}
            className={css(styles.readMoreButton)}
            onClick={() => setIsExpanded(!isExpanded)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsExpanded(!isExpanded);
              }
            }}
          >
            {isExpanded ? "Show less" : "Read more"}
          </span>
        )}
      </>
    );
  };

  return (
    <div className={`${css(styles.commentContent)} rh-comment-content`}>
      <style jsx global>{`
        .rh-comment-content strong {
          font-weight: 700 !important;
        }
        .rh-comment-content {
          margin-bottom: 15px;
        }
      `}</style>
      {getFormattedContent()}
    </div>
  );
};

const styles = StyleSheet.create({
  commentContent: {
    fontFamily: '"Prose", sans-serif',
    fontSize: 16,
    maxWidth: "none",
    lineHeight: 1.6,
  },
  starContainer: {
    display: "flex",
    alignItems: "center",
  },
  starActive: {
    color: "#FACC15",
    marginRight: 2,
  },
  starInactive: {
    color: "#D1D5DB",
    marginRight: 2,
  },
  sectionHeader: {
    marginBottom: 16,
    borderBottom: `1px solid ${colors.GREY_LINE(1)}`,
    paddingBottom: 8,
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontWeight: 600,
    fontSize: 18,
  },
  headerDescription: {
    color: colors.GREY_TEXT(0.6),
    marginTop: 4,
    fontSize: 14,
  },
  readMoreButton: {
    color: colors.NEW_BLUE(),
    fontSize: 14,
    cursor: "pointer",
    marginTop: 4,
    display: "inline-flex",
    alignItems: "center",
    ":hover": {
      textDecoration: "underline",
    },
  },
});
