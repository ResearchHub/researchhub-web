import AuthorAvatar from "../AuthorAvatar";
import { PaperSuggestion, Suggestion, PostSuggestion, SuggestedUser } from "./lib/types";
import { css, StyleSheet } from "aphrodite";

interface SearchSuggestionProps {
  suggestions: Suggestion[];
  textToHighlight?: string;
}

const SearchSuggestions = ({ suggestions, textToHighlight }: SearchSuggestionProps) => {
  return (
    <div>
      {suggestions.map((suggestion, index) => (
        <div key={index}>
          {suggestion.suggestionType === "paper" && <PaperSuggestion suggestion={suggestion.data as PaperSuggestion} textToHighlight={textToHighlight} />}
          {suggestion.suggestionType === "paper" && <PostSuggestion suggestion={suggestion.data as PostSuggestion} textToHighlight={textToHighlight} />}
          {suggestion.suggestionType === "user" && <UserSuggestion suggestion={suggestion.data as SuggestedUser} textToHighlight={textToHighlight} />}
        </div>
      ))}
    </div>
  );
}

const PaperSuggestion = ({ suggestion, textToHighlight }: { suggestion: PaperSuggestion, textToHighlight?: string }) => {
  const titleWithHighlightedPortions = highlightTextInSuggestion(suggestion.title, textToHighlight);

  return (
    <div className={css(styles.record)}>
      <div>
        <div dangerouslySetInnerHTML={{ __html: titleWithHighlightedPortions }} />
      </div>
    </div>
  );
}

const PostSuggestion = ({ suggestion, textToHighlight }: { suggestion: PostSuggestion, textToHighlight?: string }) => {
  const titleWithHighlightedPortions = highlightTextInSuggestion(suggestion.title, textToHighlight);

  return (
    <div className={css(styles.record)}>
      <div>
        <div dangerouslySetInnerHTML={{ __html: titleWithHighlightedPortions }} />
      </div>
    </div>
  );
}

const highlightTextInSuggestion = (text: string, textToHighlight?: string) => {
  if (textToHighlight) {
    const regExp = new RegExp(textToHighlight, 'gi');
    return text.replace(regExp, (match) => `<span class=${css(styles.highlightedPortion)}>${match}</span>`);
  }
  
  return text;
}


const UserSuggestion = ({ suggestion, textToHighlight }: { suggestion: SuggestedUser, textToHighlight?: string }) => {
  const fullName = suggestion.firstName + " " + suggestion.lastName;
  const fullNameWithHighlightedPortions = highlightTextInSuggestion(fullName, textToHighlight);

  return (
    <div className={css(styles.record)}>
      <div>
        <div dangerouslySetInnerHTML={{ __html: fullNameWithHighlightedPortions }} />
      </div>
      <AuthorAvatar
          author={suggestion.authorProfile}
          size={25}
          trueSize={true}
          disableLink={true}
          anonymousAvatarStyle={styles.anonymousAvatar}
        />
    </div>
  );
}

const styles = StyleSheet.create({
  anonymousAvatar: {
    marginTop: -2,
  },
  record: {
    display: "flex",
    fontSize: 14,
    lineHeight: "22px",
    fontWeight: 400,
    alignItems: "center",
    justifyContent: "space-between",
  },
  highlightedPortion: {
    fontWeight: 500,
  }
})

export default SearchSuggestions;
