import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/pro-solid-svg-icons";
import { faTrash } from "@fortawesome/pro-solid-svg-icons";
import { useState } from "react";
import { StyleSheet, css } from "aphrodite";

import FormInput from "~/components/Form/FormInput";

// Config
import colors from "~/config/themes/colors";

const EducationSummaryCard = (props) => {
  const { index, label, value, onClick, onRemove, onActive } = props;
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
      {((index === 0 && value.summary) || index !== 0) && (
        <div
          className={css(
            styles.trashIcon,
            index === 0 && styles.indexZero,
            hover && styles.reveal
          )}
          onClick={onRemove}
        >
          {<FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>}
        </div>
      )}
      <div
        className={css(
          styles.checkboxContainer,
          index === 0 && styles.indexZero
        )}
        onClick={() => onActive && onActive(index)}
      >
        {value.is_public && (
          <span className={css(styles.checkIcon)}>
            {<FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>}
          </span>
        )}
      </div>
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
  checkboxContainer: {
    position: "absolute",
    cursor: "pointer",
    background: colors.ICY_GREY,
    border: `1px solid ${colors.LIGHT_GREYISH_BLUE}`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    top: 15,
    right: -30,
    height: 20,
    width: 20,
    borderRadius: "50%",
    ":hover": {
      borderColor: colors.GRAY179(),
    },
  },
  checkIcon: {
    fontSize: 13,
    color: colors.BLUE(),
  },
  trashIcon: {
    position: "absolute",
    cursor: "pointer",
    background: colors.LIGHT_GRAY_BACKGROUND3(),
    color: colors.BLACK(0.7),
    top: 15,
    right: 10,
    opacity: 0,
    ":hover": {
      color: colors.BLACK(0.9),
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
