import { css, StyleSheet } from "aphrodite";
import { RHUser } from "~/config/types/root_types";
import AuthorAvatar from "../AuthorAvatar";
import UserTooltip from "../Tooltips/User/UserTooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import colors from "./lib/colors";

type CommentAvatarsArgs = {
  people: Array<RHUser | null>;
  withTooltip?: boolean;
  spacing?: number;
  size?: number;
  wrapperStyle?: any;
  maxPeople?: number;
};

const CommentAvatars = ({
  people,
  withTooltip = false,
  spacing = 0,
  size = 30,
  wrapperStyle,
  maxPeople = 3,
}: CommentAvatarsArgs) => {
  const avatarPeople = people.slice(0, maxPeople);
  const remainderPeople = people.length - maxPeople;

  return (
    <div className={css(styles.avatarsWrapper, wrapperStyle)}>
      {avatarPeople.map((p, idx) => {
        const avatarEl = (
          <div className={css(styles.avatarWrapper)}>
            <AuthorAvatar
              author={p?.authorProfile}
              size={size}
              trueSize={true}
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
      {remainderPeople > 0 && (
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
    border: `2px solid ${colors.white}`,
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
  avatarWrapper: {},
});

export default CommentAvatars;
