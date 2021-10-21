import { FC } from "react";
import { StyleSheet, css } from "aphrodite";

// Config
import icons from "~/config/themes/icons";
import colors from "../../config/themes/colors";

type CheckBoxProps = {
  id: string;
  active: boolean;
  label: string;
  isSquare?: boolean;
  labelStyle?: any;
  onChange?: (id: string, active: boolean) => void;
};

const CheckBox: FC<CheckBoxProps> = ({
  id,
  active,
  label,
  isSquare = false,
  onChange,
  labelStyle,
}) => {
  return (
    <div className={css(styles.checkboxContainer)}>
      <div
        className={css(
          styles.checkBox,
          active && styles.active,
          isSquare && styles.square
        )}
        onClick={() => {
          const state = !active;
          onChange && onChange(id, state);
        }}
      >
        {isSquare ? (
          <span style={{ color: `${active ? "#FFF" : "#FBFBFD"}` }}>
            {icons.check}
          </span>
        ) : (
          <div className={css(styles.dot, active && styles.white)} />
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
    height: 26,
    // minWidth: 87,
  },
  checkBox: {
    height: 24,
    width: 24,
    borderRadius: "50%",
    border: "1px solid #e8e8f1",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FBFBFD",
    ":hover": {
      borderColor: "#D2D2E6",
    },
  },
  dot: {
    height: 12,
    width: 12,
    borderRadius: "50%",
    backgroundColor: "#FBFBFD",
  },
  centered: {
    // transform: "translate(-53%, -44.5%)",
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
    backgroundColor: "#FFF",
  },
  label: {
    fontFamily: "Roboto",
    // fontSize: 16,
    fontSize: 15,
    margin: 0,
    padding: 0,
    marginLeft: 8,
  },
});

export default CheckBox;
