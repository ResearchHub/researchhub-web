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

const DocumentBadge = ({ docType, label, onClick }) => {
  const router = useRouter();

  const _onClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    onClick
      ? onClick(getBEUnifiedDocType(docType))
      : ["/hubs/[slug]", "/"].includes(router.pathname)
      ? router.push({
          pathname: router.pathname,
          query: { ...router.query, type: getBEUnifiedDocType(docType) },
        })
      : router.push({
          pathname: "/",
          query: { type: getBEUnifiedDocType(docType) },
        });
  };

  return (
    <Badge onClick={_onClick} badgeClassName={styles.badge}>
      {docType === "paper" ? (
        <span className={css(styles.icon)}>
          <PaperIcon withAnimation={false} />
        </span>
      ) : docType === "post" ? (
        <span className={css(styles.icon)}>
          <PostIcon withAnimation={false} />
        </span>
      ) : docType === "hypothesis" ? (
        <span className={css(styles.icon)}>
          <HypothesisIcon withAnimation={false} />
        </span>
      ) : null}
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
  },
});

export default DocumentBadge;
