import HubTag from "~/components/Hubs/HubTag";
import { Hub } from "~/config/types/hub";
import { StyleSheet, css } from "aphrodite";
import { PaperIcon } from "~/config/themes/icons";
import { faComments } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import colors from "~/config/themes/colors";
import Link from "next/link";
import { truncateText } from "~/config/utils/string";
import { formatNumber } from "~/config/utils/number";
import { faCheckCircle, faPenToSquare } from "@fortawesome/pro-light-svg-icons";
import { useState } from "react";
import EditHubModal from "../Modals/EditHubModal";
import { ModalActions } from "~/redux/modals";
import { connect } from "react-redux";

interface Props {
  hub: Hub;
  cardStyle?: any;
  descriptionStyle?: any;
  metadataStyle?: any;
  preventLinkClick?: boolean;
  showCommentCount?: boolean;
  isSelected?: boolean;
  numberCharactersToShow?: number;
  openEditHubModal: (boolean: boolean, hub) => void;
  canEdit?: boolean;
  handleClick?: (hub) => void;
}

const HubCard = ({
  hub,
  cardStyle,
  descriptionStyle,
  handleClick,
  metadataStyle,
  preventLinkClick,
  canEdit,
  openEditHubModal,
  showCommentCount = true,
  isSelected = false,
  numberCharactersToShow = 150,
}: Props) => {
  const numPapers = formatNumber(hub.numDocs || 0);
  const numComments = formatNumber(hub.numComments || 0);
  const description = truncateText(hub.description, numberCharactersToShow);

  const [hoverEditIcon, setHoverEditIcon] = useState(false);
  const hubCardContent = (
    <>
      <HubTag hub={hub} preventLinkClick={preventLinkClick} />
      <div className={css(styles.description, descriptionStyle)}>
        {description}
      </div>
      <div className={css(styles.metadata, metadataStyle)}>
        <div className={css(styles.dataPoint)}>
          {/* @ts-ignore */}
          <PaperIcon height={13} width={14} />
          <span>
            {numPapers === "1" ? `${numPapers} Paper` : `${numPapers} Papers`}
          </span>
        </div>
        {showCommentCount && (
          <div className={css(styles.dataPoint)}>
            <FontAwesomeIcon icon={faComments} />
            <span>
              {numComments === "1"
                ? `${numComments} Discussion`
                : `${numComments} Discussions`}
            </span>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div
      className={css(styles.hubCard, cardStyle, isSelected && styles.selected)}
    >
      {isSelected && (
        <FontAwesomeIcon
          className={css(styles.selectedCheck)}
          icon={faCheckCircle}
        />
      )}
      {!!canEdit && (
        <div
          className={css(
            styles.editIcon,
            hoverEditIcon && styles.hoverEditIcon
          )}
          onClick={() => {
            openEditHubModal(true, hub);
          }}
          onMouseEnter={() => setHoverEditIcon(true)}
          onMouseLeave={() => setHoverEditIcon(false)}
        >
          <FontAwesomeIcon icon={faPenToSquare} />
        </div>
      )}
      {handleClick ? (
        <div onClick={() => handleClick(hub)}>{hubCardContent}</div>
      ) : preventLinkClick ? (
        <div>{hubCardContent}</div>
      ) : (
        <Link href={`/hubs/${hub.slug}`} style={{ textDecoration: "none" }}>
          {hubCardContent}
        </Link>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  hubCard: {
    border: "1px solid #E9EAEF",
    position: "relative",
    borderRadius: 4,
    width: `100%`,
    height: 220,
    padding: 15,
    fontSize: 16,
    boxSizing: "border-box",
    ":hover": {
      background: colors.LIGHTER_GREY(0.5),
      transition: "0.2s",
      cursor: "pointer",
    },
  },
  selected: {
    background: colors.NEW_BLUE(0.1),
    ":hover": {
      background: colors.NEW_BLUE(0.1),
    },
  },
  selectedCheck: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 8,
    fontSize: 24,
    color: colors.NEW_BLUE(1),
  },
  description: {
    marginTop: 20,
    fontWeight: 400,
    fontSize: "1em",
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
    fontSize: "0.75em",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    columnGap: "5px",
  },
  hoverEditIcon: {
    background: colors.GREY_BORDER,
  },
  editIcon: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 8,
    borderRadius: "0px 4px 0px 4px",
  },
});

const mapDispatchToProps = {
  openEditHubModal: ModalActions.openEditHubModal,
};
export default connect(null, mapDispatchToProps)(HubCard);
