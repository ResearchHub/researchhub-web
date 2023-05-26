import { ReactElement, SyntheticEvent } from "react";
import { StyleSheet, css } from "aphrodite";
import { SuggestedUser } from "~/components/SearchSuggestion/lib/types";
import AuthorAvatar from "~/components/AuthorAvatar";
import colors from "~/config/themes/colors";
import DropdownMenu from "../menu/DropdownMenu";
import ExpandMore from "@mui/icons-material/ExpandMore";

export type Role = "EDITOR" | "VIEWER";
export type LookupSuggestedUser = SuggestedUser & {
  role?: Role;
};

type ComponentProps = {
  isSelectable?: boolean;
  onSelect?: (event: SyntheticEvent) => void;
  onUserRoleChange: (rold: Role) => void;
  showRoleDrop?: boolean;
  user: LookupSuggestedUser;
};

export default function ReferenceItemRhUserLookupInputTag({
  isSelectable,
  onSelect,
  onUserRoleChange,
  showRoleDrop,
  user: { firstName, lastName, reputation, authorProfile, id, role },
}: ComponentProps): ReactElement {
  return (
    <div
      className={css([
        styles.referenceItemRhUserLookupInputTag,
        isSelectable && styles.selectable,
      ])}
      key={`ReferenceItemRhUserLookupInputTag-${id}-${firstName}-${lastName}-${reputation}`}
      onClick={isSelectable ? onSelect : undefined}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "flex-start",
        }}
      >
        <AuthorAvatar author={authorProfile} size={20} trueSize />
        <div style={{ marginLeft: 8, fontSize: 16 }}>
          <span>{`${firstName} ${lastName}`}</span>
          <span>{" • "}</span>
          <span>{`${reputation} Rep`} </span>
        </div>
      </div>
      {showRoleDrop && (
        <DropdownMenu
          menuItemProps={[
            {
              itemLabel: "Viewer",
              onClick: (): void => {
                onUserRoleChange("VIEWER");
              },
            },
            {
              itemLabel: "Editor",
              onClick: (): void => {
                onUserRoleChange("EDITOR");
              },
            },
          ]}
          menuLabel={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "80px",
                padding: "0 8px 0 0",
              }}
            >
              <ExpandMore fontSize="medium" sx={{ color: "#AAA8B4" }} />
              {role ?? "VIEWER"}
            </div>
          }
          size={"medium"}
        />
      )}
    </div>
  );
}

const styles = StyleSheet.create({
  referenceItemRhUserLookupInputTag: {
    alignItems: "center",
    display: "flex",
    height: "36px",
    justifyContent: "space-between",
    maxHeight: "36px",
    minHeight: "36px",
    padding: "0 12px",
    width: "100%",
  },
  selectable: {
    cursor: "pointer",
    ":hover": {
      background: colors.LIGHT_GREY_BACKGROUND,
    },
  },
});
