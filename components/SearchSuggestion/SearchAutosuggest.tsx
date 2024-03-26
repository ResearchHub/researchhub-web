import colors from "~/config/themes/colors";
import AuthorAvatar from "../AuthorAvatar";
import {
  PaperSuggestion,
  Suggestion,
  PostSuggestion,
  SuggestedUser,
  QuestionSuggestion,
  HubSuggestion,
} from "./lib/types";
import { css, StyleSheet } from "aphrodite";
import { PostIcon, PaperIcon, QuestionIcon } from "~/config/themes/icons";
import { CondensedAuthorList } from "../Author/AuthorList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGrid2 } from "@fortawesome/pro-solid-svg-icons";
import { toTitleCase } from "~/config/utils/string";
import { formatNumber } from "~/config/utils/number";
import { highlightTextInSuggestion } from "./lib/util";
import { useEffect, useState } from "react";
import { faSearch } from "@fortawesome/pro-light-svg-icons";

interface SearchSuggestionProps {
  suggestions: Suggestion[];
  searchString?: string;
  handleSuggestionSelect: (suggestion: Suggestion) => void;
  handleAllResultsSelect: () => void;
  handleClose: () => void;
}

const SearchSuggestions = ({
  suggestions,
  searchString,
  handleSuggestionSelect,
  handleAllResultsSelect,
  handleClose,
}: SearchSuggestionProps) => {
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] =
    useState<number>(0);

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Enter":
          if (selectedSuggestionIndex === 0) {
            handleAllResultsSelect();
          } else {
            handleSuggestionSelect(suggestions[selectedSuggestionIndex - 1]);
          }
          break;
        case "Escape":
          handleClose();
          break;
        case "ArrowUp":
          if (selectedSuggestionIndex === -1 || selectedSuggestionIndex === 0) {
            setSelectedSuggestionIndex(suggestions.length);
          } else {
            setSelectedSuggestionIndex(selectedSuggestionIndex - 1);
          }          
          break;
        case "ArrowDown":
          if (
            selectedSuggestionIndex === -1 ||
            selectedSuggestionIndex >= suggestions.length
          ) {
            setSelectedSuggestionIndex(0);
          } else {
            setSelectedSuggestionIndex(selectedSuggestionIndex + 1);
          }
          break;
      }
    };

    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [suggestions, selectedSuggestionIndex]);

  return (
    <div>
      <div
        className={css(
          styles.query,
          styles.recordWrapper,
          selectedSuggestionIndex === 0 && styles.selected
        )}
        onClick={handleAllResultsSelect}
      >
        <div className={css(styles.iconWrapper, styles.searchIconWrapper)}>
          <FontAwesomeIcon
            style={{ fontSize: 16 }}
            icon={faSearch}
          ></FontAwesomeIcon>
        </div>
        <div>
          {searchString}{" "}
          <span className={css(styles.seeAllResults)}>- See all results</span>
        </div>
      </div>

      {suggestions.map((suggestion, index) => {
        const isSuggestionSelected = index + 1 === selectedSuggestionIndex;
        return (
          <div
            className={css(isSuggestionSelected && styles.selected)}
            key={`suggest-result-` + index}
            onClick={() => handleSuggestionSelect(suggestion)}
          >
            {suggestion.suggestionType === "paper" && (
              <PaperSuggestion
                suggestion={suggestion.data as PaperSuggestion}
                searchString={searchString}
              />
            )}
            {suggestion.suggestionType === "post" && (
              <PostSuggestion
                suggestion={suggestion.data as PostSuggestion}
                searchString={searchString}
              />
            )}
            {suggestion.suggestionType === "user" && (
              <UserSuggestion
                suggestion={suggestion.data as SuggestedUser}
                searchString={searchString}
              />
            )}
            {suggestion.suggestionType === "hub" && (
              <HubSuggestion
                suggestion={suggestion.data as HubSuggestion}
                searchString={searchString}
              />
            )}
            {suggestion.suggestionType === "question" && (
              <QuestionSuggestion
                suggestion={suggestion.data as QuestionSuggestion}
                searchString={searchString}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

const HubSuggestion = ({
  suggestion,
  searchString,
}: {
  suggestion: HubSuggestion;
  searchString?: string;
}) => {
  const hubName = toTitleCase(suggestion.hub.name);
  const titleWithHighlightedPortions = highlightTextInSuggestion(
    hubName,
    searchString,
    css(styles.highlightedPortion)
  );
  const formattedNumDocs = formatNumber(suggestion.hub.numDocs || 0);

  return (
    <div className={css(styles.recordWrapper)}>
      <div className={css(styles.iconWrapper)}>
        <FontAwesomeIcon
          style={{ fontSize: 20 }}
          icon={faGrid2}
        ></FontAwesomeIcon>
      </div>
      <div className={css(styles.record)}>
        <div
          className={css(styles.recordTitle)}
          dangerouslySetInnerHTML={{ __html: titleWithHighlightedPortions }}
        />
        <div className={css(styles.metadata)}>
          <div>Hub</div>
          {suggestion.hub.numDocs && suggestion.hub.numDocs > 0 && (
            <>
              <div className={css(styles.divider)} />
              <div>{formattedNumDocs} papers</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const PaperSuggestion = ({
  suggestion,
  searchString,
}: {
  suggestion: PaperSuggestion;
  searchString?: string;
}) => {
  const titleWithHighlightedPortions = highlightTextInSuggestion(
    suggestion.title,
    searchString,
    css(styles.highlightedPortion)
  );

  const authorsWithHighlightedPortions: Array<string> = suggestion.authors.map(
    (author) => {
      const authorNameWithHighlights = highlightTextInSuggestion(
        author.firstName + " " + author.lastName,
        searchString,
        css(styles.highlightedPortion)
      );

      return authorNameWithHighlights;
    }
  );

  return (
    <div className={css(styles.recordWrapper)}>
      <div className={css(styles.iconWrapper)}>
        <PaperIcon
          height={23}
          width={23}
          withAnimation={false}
          onClick={undefined}
        />
      </div>
      <div className={css(styles.record)}>
        <div
          className={css(styles.recordTitle)}
          dangerouslySetInnerHTML={{ __html: titleWithHighlightedPortions }}
        />
        <div className={css(styles.metadata)}>
          <div>Paper</div>
          {suggestion.authors.length > 0 && (
            <>
              <div className={css(styles.divider)} />
              <CondensedAuthorList
                authorNames={authorsWithHighlightedPortions}
                numPrimaryAuthorsToShow={1}
                allowAuthorNameToIncludeHtml={true}
              />
            </>
          )}
          {suggestion.publishedDate && (
            <>
              <div className={css(styles.divider)} />
              <div>{suggestion.publishedDate}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const PostSuggestion = ({
  suggestion,
  searchString,
}: {
  suggestion: PostSuggestion;
  searchString?: string;
}) => {
  const titleWithHighlightedPortions = highlightTextInSuggestion(
    suggestion.title,
    searchString,
    css(styles.highlightedPortion)
  );

  const authorsWithHighlightedPortions: Array<string> = suggestion.authors.map(
    (author) => {
      const authorNameWithHighlights = highlightTextInSuggestion(
        author.firstName + " " + author.lastName,
        searchString,
        css(styles.highlightedPortion)
      );

      return authorNameWithHighlights;
    }
  );

  return (
    <div className={css(styles.recordWrapper)}>
      <div className={css(styles.iconWrapper)}>
        <PostIcon
          height={25}
          width={25}
          withAnimation={false}
          onClick={undefined}
        />
      </div>
      <div className={css(styles.record)}>
        <div
          className={css(styles.recordTitle)}
          dangerouslySetInnerHTML={{ __html: titleWithHighlightedPortions }}
        />
        <div className={css(styles.metadata)}>
          <div>Post</div>
          {suggestion.authors.length > 0 && (
            <>
              <div className={css(styles.divider)} />
              <CondensedAuthorList
                authorNames={authorsWithHighlightedPortions}
                allowAuthorNameToIncludeHtml={true}
                numPrimaryAuthorsToShow={1}
              />
            </>
          )}
          {suggestion.createdDate && (
            <>
              <div className={css(styles.divider)} />
              <div>{suggestion.createdDate}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const QuestionSuggestion = ({
  suggestion,
  searchString,
}: {
  suggestion: PostSuggestion;
  searchString?: string;
}) => {
  const titleWithHighlightedPortions = highlightTextInSuggestion(
    suggestion.title,
    searchString,
    css(styles.highlightedPortion)
  );

  const authorsWithHighlightedPortions: Array<string> = suggestion.authors.map(
    (author) => {
      const authorNameWithHighlights = highlightTextInSuggestion(
        author.firstName + " " + author.lastName,
        searchString,
        css(styles.highlightedPortion)
      );

      return authorNameWithHighlights;
    }
  );

  return (
    <div className={css(styles.recordWrapper)}>
      <div className={css(styles.iconWrapper)}>
        <QuestionIcon size={25} withAnimation={false} onClick={undefined} />
      </div>
      <div className={css(styles.record)}>
        <div
          className={css(styles.recordTitle)}
          dangerouslySetInnerHTML={{ __html: titleWithHighlightedPortions }}
        />
        <div className={css(styles.metadata)}>
          <div>Question</div>
          {suggestion.authors.length > 0 && (
            <>
              <div className={css(styles.divider)} />
              <CondensedAuthorList
                authorNames={authorsWithHighlightedPortions}
                allowAuthorNameToIncludeHtml={true}
                numPrimaryAuthorsToShow={1}
              />
            </>
          )}
          {suggestion.createdDate && (
            <>
              <div className={css(styles.divider)} />
              <div>{suggestion.createdDate}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const UserSuggestion = ({
  suggestion,
  searchString,
}: {
  suggestion: SuggestedUser;
  searchString?: string;
}) => {
  const fullName = suggestion.fullName;
  const fullNameWithHighlightedPortions = highlightTextInSuggestion(
    fullName,
    searchString,
    css(styles.highlightedPortion)
  );

  return (
    <div className={css(styles.recordWrapper)}>
      <div className={css(styles.iconWrapper)}>
        <AuthorAvatar
          author={suggestion.authorProfile}
          size={25}
          trueSize={true}
          disableLink={true}
          anonymousAvatarStyle={styles.anonymousAvatar}
        />
      </div>
      <div className={css(styles.record)}>
        <div>
          <div
            dangerouslySetInnerHTML={{
              __html: fullNameWithHighlightedPortions,
            }}
          />
        </div>
        <div className={css(styles.metadata)}>
          <div>User since {suggestion.createdDate}</div>
          <div className={css(styles.divider)} />
          <div>{suggestion.reputation} Rep</div>
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  query: {
    height: 50,
    boxSizing: "border-box",
  },
  selected: {
    backgroundColor: colors.GREY(0.14),
  },
  seeAllResults: {
    color: colors.BLACK(0.6),
    fontSize: 14,
    fontWeight: 400,
  },
  iconWrapper: {
    color: colors.BLACK(0.5),
    height: 25,
  },
  searchIconWrapper: {
    color: colors.BLACK(0.5),
    height: 15,
  },
  anonymousAvatar: {
    marginTop: -2,
  },
  record: {
    width: "100%",
    color: colors.BLACK(1.0),
  },
  recordTitle: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "90%",
  },
  divider: {
    borderLeft: "1px solid #7C7989",
    height: 14,
    top: 2,
    position: "relative",
    margin: "0 8px",
  },
  metadata: {
    color: "#7C7989",
    fontSize: 13,
    display: "flex",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "85%",
  },
  recordWrapper: {
    display: "flex",
    alignItems: "center",
    columnGap: "15px",
    fontSize: 14,
    lineHeight: "18px",
    fontWeight: 400,
    padding: "10px",
    ":hover": {
      transition: "0.2s",
      backgroundColor: colors.GREY(0.14),
      cursor: "pointer",
    },
  },
  highlightedPortion: {
    fontWeight: 600,
    color: colors.BLACK(),
  },
});

export default SearchSuggestions;
