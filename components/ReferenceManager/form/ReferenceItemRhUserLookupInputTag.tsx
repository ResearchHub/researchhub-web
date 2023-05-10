import { ReactElement, SyntheticEvent } from "react";
import { StyleSheet, css } from "aphrodite";
import { SuggestedUser } from "~/components/SearchSuggestion/lib/types";
import AuthorAvatar from "~/components/AuthorAvatar";
import colors from "~/config/themes/colors";

export default function ReferenceItemRhUserLookupInputTag({
  isSelectable,
  onSelect,
  user: { firstName, lastName, reputation, authorProfile, id },
}: {
  isSelectable?: boolean;
  onSelect?: (event: SyntheticEvent) => void;
  user: SuggestedUser;
}): ReactElement {
  return (
    <div
      className={css([
        styles.referenceItemRhUserLookupInputTag,
        isSelectable && styles.selectable,
      ])}
      key={`ReferenceItemRhUserLookupInputTag-${id}-${firstName}-${lastName}-${reputation}`}
      onClick={isSelectable ? onSelect : undefined}
    >
      <AuthorAvatar author={authorProfile} size={20} trueSize />
      <div style={{ marginLeft: 8, fontSize: 16 }}>
        <span>{`${firstName} ${lastName}`}</span>
        <span>{" • "}</span>
        <span>{`${reputation} Rep`} </span>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  referenceItemRhUserLookupInputTag: {
    alignItems: "center",
    display: "flex",
    height: "36px",
    minHeight: "36px",
    maxHeight: "36px",
    width: "100%",
    justifyContent: "flex-start",
    padding: "0 12px",
  },
  selectable: {
    cursor: "pointer",
    ":hover": {
      background: colors.LIGHT_GREY_BACKGROUND,
    },
  },
});
