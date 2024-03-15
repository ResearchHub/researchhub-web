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
import Link from "next/link";
import { buildPageUrlFromSuggestion } from "./lib/util";

interface SearchSuggestionProps {
  suggestions: Suggestion[];
  textToHighlight?: string;
}

const SearchSuggestions = ({
  suggestions,
  textToHighlight,
}: SearchSuggestionProps) => {
  return (
    <div>
      {suggestions.map((suggestion, index) => {
        const href = buildPageUrlFromSuggestion(suggestion);
        return (
          <Link href={href} key={index} style={{ textDecoration: "none" }}>
            {suggestion.suggestionType === "paper" && (
              <PaperSuggestion
                suggestion={suggestion.data as PaperSuggestion}
                textToHighlight={textToHighlight}
              />
            )}
            {suggestion.suggestionType === "post" && (
              <PostSuggestion
                suggestion={suggestion.data as PostSuggestion}
                textToHighlight={textToHighlight}
              />
            )}
            {suggestion.suggestionType === "user" && (
              <UserSuggestion
                suggestion={suggestion.data as SuggestedUser}
                textToHighlight={textToHighlight}
              />
            )}
            {suggestion.suggestionType === "hub" && (
              <HubSuggestion
                suggestion={suggestion.data as HubSuggestion}
                textToHighlight={textToHighlight}
              />
            )}
            {suggestion.suggestionType === "question" && (
              <QuestionSuggestion
                suggestion={suggestion.data as QuestionSuggestion}
                textToHighlight={textToHighlight}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
};

const HubSuggestion = ({
  suggestion,
  textToHighlight,
}: {
  suggestion: HubSuggestion;
  textToHighlight?: string;
}) => {
  const hubName = toTitleCase(suggestion.hub.name);
  const titleWithHighlightedPortions = highlightTextInSuggestion(
    hubName,
    textToHighlight
  );

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
              <div>{suggestion.hub.numDocs} papers</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const PaperSuggestion = ({
  suggestion,
  textToHighlight,
}: {
  suggestion: PaperSuggestion;
  textToHighlight?: string;
}) => {
  const titleWithHighlightedPortions = highlightTextInSuggestion(
    suggestion.title,
    textToHighlight
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
          <div className={css(styles.divider)} />
          <div>
            <CondensedAuthorList authors={suggestion.authors} />
          </div>
          <div className={css(styles.divider)} />
          <div>{suggestion.publishedDate}</div>
        </div>
      </div>
    </div>
  );
};

const PostSuggestion = ({
  suggestion,
  textToHighlight,
}: {
  suggestion: PostSuggestion;
  textToHighlight?: string;
}) => {
  const titleWithHighlightedPortions = highlightTextInSuggestion(
    suggestion.title,
    textToHighlight
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
          <div className={css(styles.divider)} />
          <div>
            <CondensedAuthorList authors={suggestion.authors} />
          </div>
          <div className={css(styles.divider)} />
          <div>{suggestion.createdDate}</div>
        </div>
      </div>
    </div>
  );
};

const QuestionSuggestion = ({
  suggestion,
  textToHighlight,
}: {
  suggestion: PostSuggestion;
  textToHighlight?: string;
}) => {
  const titleWithHighlightedPortions = highlightTextInSuggestion(
    suggestion.title,
    textToHighlight
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
          <div className={css(styles.divider)} />
          <div>
            <CondensedAuthorList authors={suggestion.authors} />
          </div>
          <div className={css(styles.divider)} />
          <div>{suggestion.createdDate}</div>
        </div>
      </div>
    </div>
  );
};

const highlightTextInSuggestion = (text: string, textToHighlight?: string) => {
  if (textToHighlight) {
    const regExp = new RegExp(textToHighlight, "gi");
    return text.replace(
      regExp,
      (match) => `<span class=${css(styles.highlightedPortion)}>${match}</span>`
    );
  }

  return text;
};

const UserSuggestion = ({
  suggestion,
  textToHighlight,
}: {
  suggestion: SuggestedUser;
  textToHighlight?: string;
}) => {
  const fullName = suggestion.fullName;
  const fullNameWithHighlightedPortions = highlightTextInSuggestion(
    fullName,
    textToHighlight
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
  iconWrapper: {
    color: colors.BLACK(0.5),
    height: 25,
  },
  anonymousAvatar: {
    marginTop: -2,
  },
  record: {
    width: "100%",
    color: colors.BLACK(1.0),
  },
  recordTitle: {
    whiteSpace: "nowrap" /* Prevents the text from wrapping */,
    overflow: "hidden" /* Keeps the text from flowing outside its container */,
    textOverflow:
      "ellipsis" /* Adds ellipsis (...) at the end when text is clipped */,
    maxWidth: "90%" /* Adjust this value based on your container's size */,
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
  },
});

export default SearchSuggestions;
