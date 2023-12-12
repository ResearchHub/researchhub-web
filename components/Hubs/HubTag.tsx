import { toTitleCase } from "~/config/utils/string";
import Link from "next/link";
import { Hub } from "~/config/types/hub";
import IconButton from "~/components/Icons/IconButton";
import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";

export const HubBadge = ({ name, size }: { name: string; size?: string }) => {
  return (
    <IconButton
      variant="round"
      overrideStyle={[styles.hubBtn, styles[`hubBtn--${size}`]]}
    >
      <span className={css(styles.text)}>{toTitleCase(name)}</span>
    </IconButton>
  );
};

const HubTag = ({
  hub,
  overrideStyle,
  preventLinkClick = false,
}: {
  hub: Hub;
  preventLinkClick?: boolean;
  overrideStyle?: any;
}) => {
  if (preventLinkClick) {
    return (
      <div className={css(styles.noUnderline, overrideStyle)}>
        <HubBadge name={hub.name} />
      </div>
    );
  } else {
    return (
      <Link
        key={`/hubs/${hub.slug ?? ""}-index`}
        href={`/hubs/${hub.slug}`}
        className={css(styles.noUnderline, overrideStyle)}
        onClick={(e) => e.stopPropagation()}
      >
        <HubBadge name={hub.name} />
      </Link>
    );
  }
};

const styles = StyleSheet.create({
  text: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  [`hubBtn--small`]: {
    padding: "2px 8px",
    fontSize: 13,
  },
  hubBtn: {
    border: 0,
    maxWidth: "100%",
    background: colors.NEW_BLUE(0.1),
    padding: "4px 12px",
    height: "unset",
    textDecoration: "none",
    fontWeight: 400,
    color: colors.NEW_BLUE(),
    ":hover": {
      background: colors.NEW_BLUE(0.2),
    },
  },
  noUnderline: {
    textDecoration: "none",
  },
  moreLessBtn: {
    padding: "4px 12px",
    height: "unset",
    border: 0,
  },
});

export default HubTag;
