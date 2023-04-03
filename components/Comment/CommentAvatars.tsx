import { css, StyleSheet } from "aphrodite";
import { RHUser } from "~/config/types/root_types";
import AuthorAvatar from "../AuthorAvatar";
import UserTooltip from "../Tooltips/User/UserTooltip";

type CommentAvatarsArgs = {
  people: RHUser[];
  withTooltip?: boolean;
  spacing: number
  size?: number
};

const CommentAvatars = ({ people, withTooltip = false, spacing = 0, size = 30 }: CommentAvatarsArgs) => {
  return (
    <div className={css(styles.avatarsWrapper)}>

      {people.map((p, idx) => {

        const avatarEl = <div className={css(styles.avatarWrapper)}>
          <AuthorAvatar
            author={p.authorProfile}
            size={30}
            trueSize={true}
          />
        </div>

        return (
          <div className={css(styles.person)} style={{marginLeft: idx === 0 ? 0 : spacing}} >
            {withTooltip ? (
              <UserTooltip
                createdBy={p}
                overrideTargetStyle={styles.avatarWrapper}
                targetContent={
                  avatarEl
                }
              />
            ) : (
              avatarEl
            )}
          </div>
        )
      })}
    </div>
  );
};

const styles = StyleSheet.create({
  avatarsWrapper: {
    display: "flex",
    alignItems: "center",
    columnGap: "7px",
    fontSize: 15,
  },
  person: {
    
  },
  avatarWrapper: {

  }
});

export default CommentAvatars;
