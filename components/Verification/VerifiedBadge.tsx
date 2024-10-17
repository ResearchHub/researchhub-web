import { genClientId } from "~/config/utils/id";
import { useState } from "react";
import Image from "next/image";
import ReactTooltip from "react-tooltip";
import { css, StyleSheet } from "aphrodite";
import colors from "~/config/themes/colors";

interface Props {
  height: number;
  width: number;
  variation?: "blue" | "grey";
  showTooltipOnHover?: boolean;
}

export const VerifiedBadge = ({
  height = 25,
  width = 25,
  variation = "blue",
  showTooltipOnHover = true,
}: Props) => {
  const id = genClientId();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Image
        src={
          variation === "grey"
            ? "/static/verified-grey.svg"
            : "/static/verified.svg"
        }
        width={width}
        height={height}
        alt="Verified"
        data-for={`verified-${id}`}
        data-tip={""}
        style={{ cursor: "pointer" }}
      />
      {showTooltipOnHover && (
        <ReactTooltip
          arrowColor={"white"}
          id={`verified-${id}`}
          className={css(verifiedBadgeStyles.tooltip)}
          place="bottom"
          effect="solid"
          delayShow={500}
          delayHide={500}
          delayUpdate={500}
        >
          <div className={css(verifiedBadgeStyles.verifiedWrapper)}>
            <div>Verified Account</div>
            <Image
              src="/static/verified.svg"
              width={width}
              height={height}
              alt="Verified"
            />
          </div>
          <div className={css(verifiedBadgeStyles.learnMoreWrapper)}>
            {/* <span
              className={css(verifiedBadgeStyles.learnMore)}
              onClick={(e) => {
                // stopPropagation is necessary because this component is included various card components with a click action.
                // We need this stopPropagation to prevent the click action on the card from taking place.
                e.stopPropagation();
                e.preventDefault();
                setIsOpen(true);
              }}
            >
              Learn More
            </span> */}
          </div>
        </ReactTooltip>
      )}
    </>
  );
};

const verifiedBadgeStyles = StyleSheet.create({
  tooltip: {
    color: "black",
    background: "#fff",
    transition: "unset",
    opacity: 1,
    boxShadow: "0px 0px 10px 0px #00000026",
    ":after": {
      display: "none",
    },
  },
  verifiedWrapper: {
    background: "white",
    columnGap: "5px",
    display: "flex",
    alignItems: "center",
  },
  learnMoreWrapper: {
    marginTop: 0,
  },
  learnMore: {
    color: colors.NEW_BLUE(),
    textDecoration: "underline",
    cursor: "pointer",
  },
});

export default VerifiedBadge;
