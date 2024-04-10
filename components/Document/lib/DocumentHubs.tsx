import { toTitleCase } from "~/config/utils/string";
import Link from "next/link";
import { Hub } from "~/config/types/hub";
import IconButton from "~/components/Icons/IconButton";
import { useState } from "react";
import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import HubTag from "~/components/Hubs/HubTag";
import { breakpoints } from "~/config/themes/screen";

const DocumentHubs = ({
  hubs,
  withShowMore = true,
  hideOnSmallerResolution = false,
  containerStyle = null,
  numOfVisibleHubs = 3,
}: {
  hubs: Hub[];
  withShowMore?: boolean;
  hideOnSmallerResolution?: boolean;
  containerStyle?: any;
  numOfVisibleHubs?: number;
}) => {
  const [showMore, setShowMore] = useState<boolean>(false);
  const sortedHubs = hubs.sort((a, b) => {
    return a.relevancyScore > b.relevancyScore ? -1 : 1;
  });
  const visibleHubs = showMore ? sortedHubs : sortedHubs.slice(0, numOfVisibleHubs);

  return (
    <div className={css(styles.wrapper, containerStyle)}>
      {visibleHubs.map((h, index) => (
        <div
          key={index}
          className={css(
            index === 0 || index === 1 || !hideOnSmallerResolution
              ? [styles.wrapper, styles.primaryHub]
              : [styles.wrapper, styles.secondaryHub]
          )}
        >
          <HubTag hub={h} />
        </div>
      ))}
      {withShowMore && hubs.length > numOfVisibleHubs && (
        <IconButton
          variant="round"
          overrideStyle={styles.moreLessBtn}
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "Show Less" : "Show More"}
        </IconButton>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    fontSize: 14,
    display: "flex",
    columnGap: "7px",
    rowGap: "10px",
  },
  primaryHub: {},
  secondaryHub: {
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
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
    fontWeight: 400,
  },
});

export default DocumentHubs;
