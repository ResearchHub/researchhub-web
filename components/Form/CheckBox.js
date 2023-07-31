import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/pro-solid-svg-icons";
import { StyleSheet, css } from "aphrodite";

// Config

import colors from "../../config/themes/colors";

const CheckBox = ({
  active,
  id = 0,
  isSquare,
  label,
  labelStyle,
  onChange,
  small,
  onClickLabel = false,
  checkboxStyleOverride = null,
  checkStyleOverride = null,
}) => {
  return (
    <div
      className={css(styles.checkboxContainer, onClickLabel && styles.pointer)}
      onClick={
        onClickLabel
          ? () => {
              let state = !active;
              onChange && onChange(id, state);
            }
          : null
      }
    >
      <div
        className={css(
          small ? styles.checkBoxSmall : styles.checkBox,
          active && styles.active,
          isSquare && styles.square,
          checkboxStyleOverride
        )}
        onClick={
          !onClickLabel
            ? (event) => {
                let state = !active;
                onChange && onChange(id, state, event);
              }
            : null
        }
      >
        {isSquare ? (
          <span
            style={{
              color: `${active ? colors.WHITE() : colors.LIGHT_GREY_BLUE2}`,
            }}
            className={css(checkStyleOverride)}
          >
            {<FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>}
          </span>
        ) : (
          <div
            className={css(
              small ? styles.dotSmall : styles.dot,
              active && styles.white
            )}
          />
        )}
      </div>
      <p className={css(styles.label, labelStyle && labelStyle)}>
        {label && label}
      </p>
    </div>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  checkBox: {
    minHeight: 24,
    minWidth: 24,
    borderRadius: "50%",
    border: "1px solid #e8e8f1",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.LIGHT_GREY_BLUE2,
    ":hover": {
      borderColor: "#D2D2E6",
    },
  },
  checkBoxSmall: {
    minHeight: 12,
    minWidth: 12,
    borderRadius: "50%",
    border: "1px solid #e8e8f1",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.LIGHT_GREY_BLUE2,
    ":hover": {
      borderColor: "#D2D2E6",
    },
  },
  dot: {
    height: 12,
    width: 12,
    borderRadius: "50%",
    backgroundColor: colors.LIGHT_GREY_BLUE2,
  },
  dotSmall: {
    height: 6,
    width: 6,
    borderRadius: "50%",
    backgroundColor: colors.LIGHT_GREY_BLUE2,
  },
  centered: {
    transform: "translate(-53%, -44.5%)",
  },
  active: {
    backgroundColor: colors.BLUE(1),
    border: `1px solid ${colors.BLUE(1)}`,
    ":hover": {
      borderColor: colors.BLUE(1),
    },
  },
  square: {
    borderRadius: 0,
  },
  white: {
    backgroundColor: colors.WHITE(),
  },
  label: {
    fontFamily: "Roboto",
    fontSize: 15,
    margin: 0,
    padding: 0,
    marginLeft: 8,
  },
  pointer: {
    cursor: "pointer",
  },
});

export default CheckBox;
