import HubTag from "~/components/Hubs/HubTag";
import { Hub } from "~/config/types/hub";
import { StyleSheet, css } from "aphrodite";
import { PaperIcon } from "~/config/themes/icons";
import { faComments } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import colors from "~/config/themes/colors";
import Link from "next/link";
import { truncateText } from "~/config/utils/string";

const HubCard = ({ hub }: { hub: Hub }) => {
  const numPapers = hub.numDocs || 0;
  const numComments = hub.numComments || 0;
  const description = truncateText(hub.description, 150);

  return (
    <div className={css(styles.hubCard)}>
      <Link href={`/hubs/${hub.slug}`} style={{ textDecoration: "none" }}>
        <HubTag hub={hub} />
        <div className={css(styles.description)}>{description}</div>
        <div className={css(styles.metadata)}>
          <div className={css(styles.dataPoint)}>
            {/* @ts-ignore */}
            <PaperIcon height={13} width={14} />
            <span>
              {numPapers === 1 ? `${numPapers} Paper` : `${numPapers} Papers`}
            </span>
          </div>
          <div className={css(styles.dataPoint)}>
            <FontAwesomeIcon icon={faComments} />
            <span>
              {numComments === 1
                ? `${numComments} Comment`
                : `${numComments} Comments`}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

const styles = StyleSheet.create({
  hubCard: {
    border: "1px solid #E9EAEF",
    borderRadius: 4,
    width: `calc(25% - 20px)`,
    height: 220,
    padding: 15,
    boxSizing: "border-box",
    ":hover": {
      background: colors.LIGHTER_GREY(1),
      transition: "0.2s",
      cursor: "pointer",
    },
    ":nth-child(4n)": {
      width: "25%",
    },
    [`@media only screen and (max-width: 1340px)`]: {
      width: "33.3%",
    },
  },
  description: {
    marginTop: 20,
    fontWeight: 400,
    fontSize: 16,
    lineHeight: "22px",
    color: "#7C7989",
    height: 120,
    overflow: "hidden",
    // whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    "::first-letter": {
      textTransform: "uppercase",
    },
  },
  metadata: {
    borderTop: `1px solid ${colors.GREY_BORDER}`,
    width: "100%",
    height: 35,
    display: "flex",
    alignItems: "center",
    columnGap: "25px",
    color: "#545161",
  },
  dataPoint: {
    fontSize: 12,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    columnGap: "5px",
  },
});

export default HubCard;
