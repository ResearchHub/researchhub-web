import { toTitleCase } from "~/config/utils/string";
import Link from "next/link";
import { Hub } from "~/config/types/hub";
import IconButton from "~/components/Icons/IconButton";
import { StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";

const HubTag = ({ hub }: { hub: Hub }) => {
  return (
    <Link
      key={`/hubs/${hub.slug ?? ""}-index`}
      href={`/hubs/${hub.slug}`}
      onClick={(e) => e.stopPropagation()}
    >
      <IconButton variant="round" overrideStyle={styles.hubBtn}>
        <span>{toTitleCase(hub.name)}</span>
      </IconButton>
    </Link>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    fontSize: 14,
    display: "flex",
    columnGap: "7px",
    rowGap: "10px",
    flexWrap: "wrap",
  },
  hubBtn: {
    border: 0,
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
  moreLessBtn: {
    padding: "4px 12px",
    height: "unset",
    border: 0,
  },
});

export default HubTag;
