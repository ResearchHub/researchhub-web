import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faLayerGroup,
  faComments,
} from "@fortawesome/pro-solid-svg-icons";
import { faCheck } from "@fortawesome/pro-solid-svg-icons";
import Badge from "~/components/Badge";
import { StyleSheet, css } from "aphrodite";
import colors, { bountyColors } from "~/config/themes/colors";
import {
  PostIcon,
  PaperIcon,
  HypothesisIcon,
  QuestionIcon,
} from "~/config/themes/icons";
import { breakpoints } from "~/config/themes/screen";
import ResearchCoinIcon from "~/components/Icons/ResearchCoinIcon";
import { POST_TYPES } from "./TextEditor/config/postTypes";
import { ReactElement, useRef, useState } from "react";
import { useExchangeRate } from "./contexts/ExchangeRateContext";

type Args = {
  contentType: string;
  size?: "small" | "medium" | "large";
  label: string | ReactElement;
  onClick?: null | Function;
  rscContentOverride?: any;
  badgeOverride?: any;
  bountyAmount?: number;
  badgeHovered?: boolean;
  keepPositionAbsolute?: boolean;
  tooltip?: string;
};

const ContentBadgeBase = ({
  contentType,
  size = "medium",
  label = "",
  onClick = null,
  rscContentOverride,
  badgeOverride,
  bountyAmount,
  badgeHovered,
  keepPositionAbsolute,
  tooltip,
}: Args) => {
  const { rscToUSDDisplay } = useExchangeRate();

  return (
    <Badge
      badgeClassName={[
        styles.badge,
        styles["badgeFor_" + contentType],
        styles[size],
        badgeOverride,
        badgeHovered && contentType === "bounty" && styles.bountyHovered,
        keepPositionAbsolute && styles.keepPositionAbsolute,
      ]}
    >
      <div data-delay-show={500} data-tip={tooltip} style={{ display: "flex" }}>
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
        ) : contentType === POST_TYPES.DISCUSSION ||
          contentType === "comment" ? (
          <>
            <span className={css(styles.icon)}>
              {<FontAwesomeIcon icon={faComments}></FontAwesomeIcon>}
            </span>
            <span>Comment</span>
          </>
        ) : contentType === POST_TYPES.ANSWER ? (
          <>
            <span className={css(styles.icon)}>
              {
                <FontAwesomeIcon
                  style={{ fontSize: 17 }}
                  icon={faCheck}
                ></FontAwesomeIcon>
              }
            </span>
            <span>Answer</span>
          </>
        ) : contentType === POST_TYPES.SUMMARY ? (
          <>
            <span className={css(styles.icon)}>
              {<FontAwesomeIcon icon={faLayerGroup}></FontAwesomeIcon>}
            </span>
            <span>Summary</span>
          </>
        ) : contentType === POST_TYPES.REVIEW ? (
          <>
            <span className={css(styles.icon)}>
              {<FontAwesomeIcon icon={faStar}></FontAwesomeIcon>}
            </span>
            <span>Peer Review</span>
          </>
        ) : contentType === "rsc_support" ? (
          <>
            <span className={css(styles.icon, styles.rscIcon)}>
              <ResearchCoinIcon version={4} height={16} width={16} />
              {` `}
            </span>
            <span className={css(styles.rscContent)}>{label}</span>
          </>
        ) : contentType === "award" ? (
          <>
            <span className={css(styles.icon)}>
              <ResearchCoinIcon
                color="rgb(232, 181, 4)"
                version={4}
                height={16}
                width={16}
              />
              {` `}
            </span>
            <span>{label}</span>
          </>
        ) : contentType === "bounty" ? (
          <div>
            <div className={css(styles.row)}>
              <span
                className={css(
                  styles.icon,
                  size === "small" && styles.iconSmall,
                  styles.rscIcon
                )}
              >
                <ResearchCoinIcon
                  version={4}
                  height={size === "small" ? 14 : 16}
                  width={size === "small" ? 14 : 16}
                />
                {` `}
              </span>
              <span className={css(styles.rscContent, rscContentOverride)}>
                {label}
              </span>
            </div>
            <div
              className={css(
                styles.usdAmount,
                badgeHovered && styles.transitionOpacity
              )}
            >
              {" "}
              ≈ {rscToUSDDisplay(bountyAmount || 0)}
            </div>
          </div>
        ) : contentType === "closedBounty" ? (
          <>
            <span
              className={css(styles.icon, size === "small" && styles.iconSmall)}
            >
              <ResearchCoinIcon
                version={4}
                color={colors.BLACK(0.5)}
                height={size === "small" ? 14 : 16}
                width={size === "small" ? 14 : 16}
              />
              {` `}
            </span>
            <span>{label}</span>
          </>
        ) : (
          <></>
        )}
      </div>
    </Badge>
  );
};

const ContentBadge = (props) => {
  const [badgeHovered, setBadgeHovered] = useState(false);
  const [keepPositionAbsolute, setKeepPositionAbsolute] = useState(false);
  // TODO type this properly with a timeout
  const mouseLeaveTimeout = useRef();
  return (
    <div
      className={css(styles.badgeContainer, props.badgeContainerOverride)}
      onMouseMove={() => {
        if (!mouseLeaveTimeout.current) {
          setBadgeHovered(props.contentType === "bounty");
          setKeepPositionAbsolute(props.contentType === "bounty");
        }
      }}
      onMouseLeave={() => {
        clearTimeout(mouseLeaveTimeout.current);
        setBadgeHovered(false);

        // @ts-ignore
        mouseLeaveTimeout.current = setTimeout(() => {
          setKeepPositionAbsolute(false);
          // @ts-ignore
          mouseLeaveTimeout.current = null;
        }, 300);
      }}
    >
      <ContentBadgeBase
        {...props}
        badgeHovered={badgeHovered}
        keepPositionAbsolute={keepPositionAbsolute}
      />
      {keepPositionAbsolute && (
        <ContentBadgeBase {...props} badgeHovered={false} />
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    position: "relative",
  },
  small: {
    fontSize: 12,
    padding: "3px 6px 1px",
  },
  medium: {},
  large: {
    fontSize: 16,
  },
  withTooltip: {
    cursor: "default",
  },
  icon: {
    marginRight: 6,
    fontSize: 13,
    height: 21,
  },
  rscIcon: {
    height: "16px",
    display: "flex",
  },
  iconSmall: {
    height: 14,
  },
  wrapper: {
    display: "flex",
  },
  badgeFor_rsc_support: {
    background: bountyColors.BADGE_BACKGROUND,
    color: bountyColors.BADGE_TEXT,
    padding: "5px 10px",
    paddingTop: 4,
  },
  badgeFor_bounty: {
    background: bountyColors.BADGE_BACKGROUND,
    color: bountyColors.BADGE_TEXT,
    padding: "5px 10px",
    paddingTop: 4,

    ":after": {
      content: "''",
      position: "absolute",
      zIndex: -1,
      width: "100%",
      height: "100%",
      opacity: 0,
      borderRadius: 5,
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      transition: "opacity 0.3s ease-in-out",
      top: 0,
      left: 0,
    },
  },
  badgeFor_closedBounty: {
    color: colors.BLACK(0.5),
    background: colors.LIGHT_GREY(1.0),
  },
  badgeFor_award: {
    color: "rgba(232, 181, 4, 1)",
    background: "#FDF8E6",
  },
  badgeFor_ANSWER: {
    background: colors.GREEN(0.1),
    color: colors.GREEN(1.0),
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
  row: {
    display: "flex",
    aliggItems: "center",
  },
  keepPositionAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  bountyHovered: {
    position: "absolute",
    transform: "scale(1.1)",
    ":after": {
      opacity: 1,
    },
  },
  usdAmount: {
    fontSize: 12,
    color: colors.LIGHT_GREY_TEXT,
    textAlign: "right",
    opacity: 0,
    transition: "all .3s ease-in-out",
    height: 0,
  },
  transitionOpacity: {
    opacity: 1,
    height: 17,
  },
});

export default ContentBadge;
