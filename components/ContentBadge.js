import Badge from "~/components/Badge";
import { StyleSheet, css } from "aphrodite";
import colors, { badgeColors } from "~/config/themes/colors";
import icons, {
  PostIcon,
  PaperIcon,
  HypothesisIcon,
  ResearchCoinIcon,
  QuestionIcon,
} from "~/config/themes/icons";
import { useRouter } from "next/router";
import { getFEUnifiedDocType } from "~/config/utils/getUnifiedDocType";
import { breakpoints } from "~/config/themes/screen";
import { POST_TYPES } from "./TextEditor/config/postTypes";

const ContentBadge = ({ contentType, label = null, onClick = null }) => {
  const router = useRouter();

  const _onClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const isCurrentRouteAFeed = ["/hubs/[slug]", "/"].includes(router.pathname);
    if (isCurrentRouteAFeed) {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, type: getFEUnifiedDocType(docType) },
      });
    } else {
      router.push({
        pathname: "/",
        query: { type: getFEUnifiedDocType(docType) },
      });
    }
  };

  return (
    <Badge badgeClassName={[styles.badge, styles["badgeFor_" + contentType]]}>
      {contentType === "paper" ? (
        <>
          <span className={css(styles.icon)}>
            <PaperIcon withAnimation={false} />
          </span>
          <span>Paper</span>
        </>
      ) : contentType === "post" ? (
        <>
          <span className={css(styles.icon)}>
            <PostIcon withAnimation={false} />
          </span>
          <span>Post</span>
        </>
      ) : contentType === "hypothesis" ? (
        <>
          <span className={css(styles.icon)}>
            <HypothesisIcon withAnimation={false} />
          </span>
          <span>Meta Study</span>
        </>
      ) : contentType === "question" ? (
        <>
          <span className={css(styles.icon)}>
            <QuestionIcon withAnimation={false} />
          </span>
          <span>Question</span>
        </>
      ) : contentType === POST_TYPES.DISCUSSION ? (
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
      ) : null}
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
    background: "rgb(252 242 220)",
    color: colors.ORANGE_DARK2(),
  },
  badgeFor_bounty: {
    background: "rgb(252 242 220)",
    color: colors.ORANGE_DARK2(),
  },
  badgeFor_DISCUSSION: {
    background: colors.NEW_BLUE(0.1),
    color: colors.NEW_BLUE(1.0),
  },
  badgeFor_ANSWER: {
    background: colors.NEW_GREEN(0.1),
    color: colors.NEW_GREEN(),
  },
  rscContent: {
    color: colors.ORANGE_DARK2(),
  },
  badge: {
    background: colors.LIGHT_GREY(),
    color: colors.BLACK(),
    // color: colors.BLACK(0.6),
    // background: colors.LIGHTER_GREY(1.0),
    display: "flex",
    padding: "4px 8px 1px 8px",
    textTransform: "capitalize",
    borderRadius: "4px",
    marginBottom: 0,
    marginRight: 0,
    fontSize: 14,
    lineHeight: "17px",
    fontWeight: 500,
    ":hover": {
      background: badgeColors.HOVER,
      color: badgeColors.HOVER_COLOR,
      boxShadow: "unset",
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginBottom: 0,
    },
  },
});

export default ContentBadge;
