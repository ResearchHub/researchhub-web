import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import ReactTooltip from "react-tooltip";

type Args = {
  onClick?: Function;
  children?: any;
  overrideStyle?: any;
  variant?: "round";
  tooltip?: string;
};

const IconButton = ({
  onClick,
  children,
  overrideStyle,
  variant,
  tooltip,
}: Args) => {
  return (
    <>
      <ReactTooltip effect="solid" />
      <div
        data-tip={tooltip}
        className={css(
          styles.root,
          styles.withAnimation,
          variant && styles[`variant-${variant}`],
          overrideStyle
        )}
        onClick={(e) => onClick && onClick(e)}
      >
        {children}
      </div>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: "5px",
    color: colors.MEDIUM_GREY(1.0),
    cursor: "pointer",
    justifyContent: "center",
    display: "inline-flex",
    userSelect: "none",
    alignItems: "center",
    columnGap: "5px",
    borderRadius: 3,
  },
  [`variant-round`]: {
    display: "inline-flex",
    fontWeight: 500,
    columnGap: "7px",
    alignItems: "center",
    padding: "6px 12px",
    height: 36,
    boxSizing: "border-box",
    borderRadius: "50px",
    border: `1px solid ${colors.GREY_LINE()}`,
  },
  withAnimation: {
    ":hover": {
      background: colors.LIGHTER_GREY(),
      transition: "0.3s",
    },
  },
});

export default IconButton;
