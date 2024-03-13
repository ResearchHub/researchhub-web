import AuthorAvatar from "../AuthorAvatar";
import { PaperSuggestion, Suggestion, PostSuggestion, SuggestedUser } from "./lib/types";
import { css, StyleSheet } from "aphrodite";

interface SearchSuggestionProps {
  suggestions: Suggestion[];
}

const SearchSuggestions = ({ suggestions }: SearchSuggestionProps) => {
  return (
    <div>
      {suggestions.map((suggestion, index) => (
        <div key={index}>
          {suggestion.suggestionType === "paper" && <PaperSuggestion suggestion={suggestion.data as PaperSuggestion} />}
          {suggestion.suggestionType === "paper" && <PostSuggestion suggestion={suggestion.data as PostSuggestion} />}
          {suggestion.suggestionType === "user" && <UserSuggestion suggestion={suggestion.data as SuggestedUser} />}
        </div>
      ))}
    </div>
  );
}

const PaperSuggestion = ({ suggestion }: { suggestion: PaperSuggestion }) => {
  return <div>{suggestion.title}</div>;
}

const PostSuggestion = ({ suggestion }: { suggestion: PostSuggestion }) => {
  return <div>{suggestion.title}</div>;
}

const UserSuggestion = ({ suggestion }: { suggestion: SuggestedUser }) => {
  return (
    <div className={css(styles.record)}>
      {suggestion.firstName + " " + suggestion.lastName}
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
    alignItems: "center",
    justifyContent: "space-between",
  }
})

export default SearchSuggestions;
