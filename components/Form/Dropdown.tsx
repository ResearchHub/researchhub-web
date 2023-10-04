import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faCheck } from "@fortawesome/pro-light-svg-icons";
import { css, StyleSheet } from "aphrodite";
import { ReactElement, useMemo, useRef, useState } from "react";
import { NullableString } from "~/config/types/root_types";
import { useEffectHandleClick } from "~/config/utils/clickEvent";
import IconButton from "../Icons/IconButton";
import colors from "~/config/themes/colors";

export type DropdownProps = {
  value: NullableString;
  handleSelect: (v: string) => void;
  sortOptions: {
    label: string;
    value: string;
    icon: ReactElement;
  }[];
  dropdownDirection?: "bottom-left" | "bottom-right";
};

const Dropdown = ({
  value,
  sortOptions,
  handleSelect,
  dropdownDirection = "bottom-left",
}: DropdownProps): ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef(null);

  const selectedOpt = useMemo(() => {
    const v = sortOptions.find((s) => s.value === value);

    return v || sortOptions[0];
  }, [value, sortOptions]);

  const directionStyles = {
    ...(dropdownDirection === "bottom-left" && { left: -5, right: "unset" }),
    ...(dropdownDirection === "bottom-right" && { right: 0, left: "unset" }),
  };

  useEffectHandleClick({
    ref: dropdownRef,
    exclude: [".dropdown-trigger"],
    onOutsideClick: () => setIsOpen(false),
  });

  return (
    <div className={css(styles.wrapper)}>
      <div className={`${css(styles.trigger)} dropdown-trigger`}>
        <IconButton
          overrideStyle={styles.labelWrapper}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className={css(styles.dropdownIcon)}>{selectedOpt.icon}</div>
          <div className={css(styles.dropdownLabel)}>{selectedOpt.label}</div>
          <FontAwesomeIcon
            icon={faAngleDown}
            style={{ marginLeft: 3, fontSize: 16 }}
          />
        </IconButton>
      </div>
      <div
        ref={dropdownRef}
        className={css(styles.dropdown, isOpen && styles.dropdownOpen)}
        style={{ ...directionStyles }}
      >
        {sortOptions.map((s) => (
          <div
            className={css(styles.option)}
            key={`sort-${s.value}`}
            onClick={() => {
              handleSelect(s.value);
              setIsOpen(false);
            }}
          >
            <div className={css(styles.dropdownIcon)}>{s.icon}</div>
            <div className={css(styles.dropdownLabel)}>{s.label}</div>
            {selectedOpt.value === s.value && (
              <div className={css(styles.check)}>
                <FontAwesomeIcon style={{ fontSize: 12 }} icon={faCheck} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    userSelect: "none",
  },
  labelWrapper: {
    marginTop: 0,
    display: "flex",
    columnGap: "4px",
    color: colors.BLACK(1),
    alignItems: "center",
    fontWeight: 500,
    padding: "6px 10px 6px 10px",
    fontSize: 16,
    border: `1px solid ${colors.GREY_LINE(1)}`,
    background: "white",
  },
  trigger: {},
  dropdown: {
    display: "none",
    position: "absolute",
    top: 30,
    zIndex: 10,
    height: "auto",
    width: 150,
    background: "white",
    padding: 0,
    borderRadius: 4,
    marginTop: 5,
    marginLeft: 5,
    boxShadow:
      "rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px",
  },
  dropdownOpen: {
    display: "block",
  },
  option: {
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    columnGap: "7px",
    padding: "7px 12px",
    position: "relative",
    boxSizing: "border-box",
    fontSize: 14,
    width: "100%",
    ":hover": {
      background: colors.LIGHTER_GREY(1.0),
      transition: "0.2s",
    },
  },
  check: {
    position: "absolute",
    right: 15,
    top: 8,
    fontSize: 12,
  },
  dropdownIcon: {
    fontSize: 12,
  },
  dropdownLabel: {},
});

export default Dropdown;
