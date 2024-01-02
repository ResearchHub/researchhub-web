import { css, StyleSheet } from "aphrodite";
import { ID, RHUser } from "~/config/types/root_types";
import AuthorAvatar from "../AuthorAvatar";
import UserTooltip from "../Tooltips/User/UserTooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import colors from "./lib/colors";
import globalColors from "~/config/themes/colors";

const _dedupePeople = (people: Array<RHUser | null>): Array<RHUser | null> => {
  const uniquePeople: Array<RHUser | null> = [];
  const ids: Array<ID> = [];

  people.forEach((p) => {
    if (!ids.includes(p?.id)) {
      uniquePeople.push(p);
      ids.push(p?.id);
    }
  });

  return uniquePeople;
};

type CommentAvatarsArgs = {
  people: Array<RHUser | null>;
  withTooltip?: boolean;
  spacing?: number;
  size?: number;
  wrapperStyle?: any;

  // we can either show +{n} or just the total number of people
  maxPeople?: number;
  showTotal?: boolean;
  totalNoun?: string; // e.g. "people" or "contributors"
};

const CommentAvatars = ({
  people,
  withTooltip = false,
  spacing = 0,
  size = 30,
  wrapperStyle,
  maxPeople = 3,
  showTotal = false,
  totalNoun = "people",
}: CommentAvatarsArgs) => {
  const avatarPeople = _dedupePeople(people).slice(0, maxPeople);
  const remainderPeople = avatarPeople.length - maxPeople;

  return (
    <div className={css(styles.avatarsWrapper, wrapperStyle)}>
      {avatarPeople.map((p, idx) => {
        const avatarEl = (
          <div className={css(styles.avatarWrapper)}>
            <AuthorAvatar
              author={p?.authorProfile || p?.author_profile}
              size={size}
              trueSize={true}
              disableLink={true}
              anonymousAvatarStyle={styles.anonymousAvatar}
            />
          </div>
        );

        return (
          <div
            className={css(styles.person)}
            key={`avatar-${idx}`}
            style={{ marginLeft: idx === 0 ? 0 : spacing }}
          >
            {withTooltip ? (
              <UserTooltip
                createdBy={p}
                overrideTargetStyle={styles.avatarWrapper}
                targetContent={avatarEl}
              />
            ) : (
              avatarEl
            )}
          </div>
        );
      })}
      {!showTotal && remainderPeople > 0 && (
        <div className={css(styles.person)} style={{ marginLeft: spacing }}>
          <div className={css(styles.avatarWrapper)}>
            <div
              className={css(styles.remainderAvatar)}
              style={{ height: size, width: size }}
            >
              <FontAwesomeIcon icon={faPlus} style={{ fontSize: 12 }} />
              <span>{remainderPeople}</span>
            </div>
          </div>
        </div>
      )}
      {showTotal && (
        <div className={css(styles.person)} style={{ marginLeft: spacing }}>
          <div
            className={css(styles.avatarWrapper, styles.totalWrapper)}
            style={{ borderRadius: size / 2 }}
          >
            <div
              className={css(styles.totalAvatar)}
              style={{
                height: size,
                paddingLeft: 12,
                paddingRight: 12,
                minWidth: size,
                borderRadius: size / 2,
              }}
            >
              <span>{avatarPeople.length}</span>
              <span style={{ marginLeft: 3 }}>
                {totalNoun}
                {avatarPeople.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  avatarsWrapper: {
    display: "flex",
    alignItems: "center",
    columnGap: "7px",
    fontSize: 15,
    marginTop: 3,
  },
  anonymousAvatar: {
    marginTop: -2,
  },
  person: {
    zIndex: 2,
    border: `2px solid white`,
    borderRadius: "50px",
  },
  remainderAvatar: {
    background: colors.avatar.background,
    fontWeight: 500,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  totalWrapper: {
    background: "white",
  },
  totalAvatar: {
    background: colors.avatar.background,
    fontWeight: 400,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    ":hover": {
      cursor: "pointer",
      background: globalColors.NEW_BLUE(0.1),
      color: globalColors.NEW_BLUE(),
    },
  },
  avatarWrapper: {},
});

export default CommentAvatars;
