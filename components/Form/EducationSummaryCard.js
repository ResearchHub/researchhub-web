import React, { useState } from "react";
import { StyleSheet, css } from "aphrodite";

import FormInput from "~/components/Form/FormInput";

// Config
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";

const EducationSummaryCard = (props) => {
  const { index, label, value, onClick, onRemove } = props;
  const [hover, setHover] = useState(false);

  return (
    <div
      className={css(styles.educationRow)}
      onMouseEnter={() => !hover && setHover(true)}
      onMouseLeave={() => hover && setHover(false)}
    >
      <FormInput
        label={label}
        containerStyle={styles.formEducationInput}
        value={value.summary}
        onClick={onClick}
      />
      {(index === 0 && value.summary) ||
        (index !== 0 && (
          <div
            className={css(
              styles.trashIcon,
              index === 0 && styles.indexZero,
              hover && styles.reveal
            )}
            onClick={onRemove}
          >
            {icons.trash}
          </div>
        ))}
    </div>
  );
};

const styles = StyleSheet.create({
  educationRow: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  formEducationInput: {
    padding: 0,
    margin: 0,
    marginBottom: 10,
    width: "100%",
    minHeight: "unset",
  },
  trashIcon: {
    position: "absolute",
    cursor: "pointer",
    color: colors.BLACK(0.3),
    paddingLeft: 20,
    top: 15,
    right: 10,
    opacity: 0,
    ":hover": {
      color: colors.BLACK(0.7),
    },
  },
  indexZero: {
    top: 45,
  },
  reveal: {
    opacity: 1,
  },
});

export default EducationSummaryCard;
