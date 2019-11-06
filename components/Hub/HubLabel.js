import { StyleSheet, css } from "aphrodite";
import Link from "next/link";

// Config
import colors from "~/config/themes/colors";
import { nameToUrl } from "~/config/constants";

const HubLabel = (props) => {
  let { hub, onClick } = props;
  return (
    <Link href={"/hubs/[hubname]"} as={`/hubs/${nameToUrl(hub.name)}`}>
      <div className={css(styles.hubTag)} onClick={onClick && onClick}>
        {hub.name.toUpperCase()}
      </div>
    </Link>
  );
};

const styles = StyleSheet.create({
  hubTag: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.BLUE(1),
    background: colors.BLUE(0.1),
    padding: "5px 12px",
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 13,
    borderRadius: 4,
    cursor: "pointer",
  },
});

export default HubLabel;
