import Badge from "~/components/Badge";
import { StyleSheet, css } from "aphrodite";
import { badgeColors } from "~/config/themes/colors";
import icons, {
  PostIcon,
  PaperIcon,
  HypothesisIcon,
} from "~/config/themes/icons";
import { useRouter } from "next/router";
import { getBEUnifiedDocType } from "~/config/utils/getUnifiedDocType";
import { breakpoints } from "~/config/themes/screen";

const DocumentBadge = ({ docType, label, onClick }) => {
  const router = useRouter();

  const _onClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (onClick) {
      return onClick(getBEUnifiedDocType(docType));
    } else {
      const isCurrentRouteAFeed = ["/hubs/[slug]", "/"].includes(
        router.pathname
      );
      if (isCurrentRouteAFeed) {
        router.push({
          pathname: router.pathname,
          query: { ...router.query, type: getBEUnifiedDocType(docType) },
        });
      } else {
        router.push({
          pathname: "/",
          query: { type: getBEUnifiedDocType(docType) },
        });
      }
    }
  };

  return (
    <Badge onClick={_onClick} badgeClassName={styles.badge}>
      <span className={css(styles.icon)}>
        {docType === "paper" ? (
          <PaperIcon withAnimation={false} />
        ) : docType === "post" ? (
          <PostIcon withAnimation={false} />
        ) : docType === "hypothesis" ? (
          <HypothesisIcon withAnimation={false} />
        ) : null}
      </span>
      <span>{label}</span>
    </Badge>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 6,
    color: "gray",
    fontSize: 16,
  },
  badge: {
    display: "flex",
    padding: "6px 12px 3px 6px",
    textTransform: "capitalize",
    backgroundColor: "unset",
    color: badgeColors.COLOR,
    marginBottom: 0,
    marginRight: 0,
    fontSize: 14,
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

export default DocumentBadge;
