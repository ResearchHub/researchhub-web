import { ReactElement } from "react";
import { StyleSheet, css } from "aphrodite";
import { SuggestedUser } from "~/components/SearchSuggestion/lib/types";
import AuthorAvatar from "~/components/AuthorAvatar";
import colors from "~/config/themes/colors";

export default function ReferenceItemRhUserLookupInputTag({
  isSelectable,
  user: { firstName, lastName, reputation, authorProfile },
}: {
  isSelectable?: boolean;
  user: SuggestedUser;
}): ReactElement {
  return (
    <div
      className={css([
        styles.referenceItemRhUserLookupInputTag,
        isSelectable && styles.selectable,
      ])}
    >
      <AuthorAvatar author={authorProfile} size={20} trueSize />
      <div style={{ marginLeft: 8, lineHeight: 16, fontSize: 16}}>
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
