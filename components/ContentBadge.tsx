import Badge from "~/components/Badge";
import { StyleSheet, css } from "aphrodite";
import colors, { bountyColors } from "~/config/themes/colors";
import icons, {
  PostIcon,
  PaperIcon,
  HypothesisIcon,
  QuestionIcon,
} from "~/config/themes/icons";
import { useRouter } from "next/router";
import { breakpoints } from "~/config/themes/screen";
import { POST_TYPES } from "./TextEditor/config/postTypes";
import ResearchCoinIcon from "~/components/Icons/ResearchCoinIcon";

const ContentBadge = ({ contentType, label = null, onClick = null }) => {
  const router = useRouter();

  return (
    <Badge badgeClassName={[styles.badge, styles["badgeFor_" + contentType]]}>
      {contentType === "paper" ? (
        <>
          <span className={css(styles.icon)}>
            <PaperIcon withAnimation={false} onClick={undefined} />
          </span>
          <span>Paper</span>
        </>
      ) : contentType === "post" ? (
        <>
          <span className={css(styles.icon)}>
            <PostIcon withAnimation={false} onClick={undefined} />
          </span>
          <span>Post</span>
        </>
      ) : contentType === "hypothesis" ? (
        <>
          <span className={css(styles.icon)}>
            <HypothesisIcon withAnimation={false} onClick={undefined} />
          </span>
          <span>Meta Study</span>
        </>
      ) : contentType === "question" ? (
        <>
          <span className={css(styles.icon)}>
            <QuestionIcon withAnimation={false} onClick={undefined} />
          </span>
          <span>Question</span>
        </>
      ) : contentType === POST_TYPES.DISCUSSION || contentType === "comment" ? (
        <>
          <span className={css(styles.icon)}>{icons.commentsSolid}</span>
          <span>Comment</span>
        </>
      ) : contentType === POST_TYPES.ANSWER ? (
        <>
          <span className={css(styles.icon)}>{icons.commentAltLineSolid}</span>
          <span>Answer</span>
        </>
      ) : contentType === POST_TYPES.SUMMARY ? (
        <>
          <span className={css(styles.icon)}>{icons.layerGroup}</span>
          <span>Summary</span>
        </>
      ) : contentType === POST_TYPES.REVIEW ? (
        <>
          <span className={css(styles.icon)}>{icons.starFilled}</span>
          <span>Review</span>
        </>
      ) : contentType === "rsc_support" ? (
        <>
          <span className={css(styles.icon)}>
            <ResearchCoinIcon version={4} height={16} width={16} />
            {` `}
          </span>
          <span className={css(styles.rscContent)}>{label}</span>
        </>
      ) : contentType === "bounty" ? (
        <>
          <span className={css(styles.icon)}>
            <ResearchCoinIcon version={4} height={16} width={16} />
            {` `}
          </span>
          <span className={css(styles.rscContent)}>{label}</span>
        </>
      ) : <></>}
    </Badge>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 6,
    fontSize: 16,
    height: 21,
  },
  badgeFor_rsc_support: {
    background: bountyColors.BADGE_BACKGROUND,
    color: bountyColors.BADGE_TEXT,
  },
  badgeFor_bounty: {
    background: bountyColors.BADGE_BACKGROUND,
    color: bountyColors.BADGE_TEXT,
  },
  rscContent: {
    color: colors.ORANGE_DARK2(),
  },
  badge: {
    color: colors.BLACK(0.5),
    background: colors.LIGHT_GREY(1.0),
    display: "flex",
    padding: "4px 10px 1px 10px",
    textTransform: "capitalize",
    borderRadius: "4px",
    marginBottom: 0,
    marginRight: 0,
    fontSize: 14,
    lineHeight: "17px",
    fontWeight: 500,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginBottom: 0,
    },
  },
});

export default ContentBadge;
