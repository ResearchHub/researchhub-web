import React from "react";
import { StyleSheet, css } from "aphrodite";
import colors from "../../config/themes/colors";
import TagsInput from "react-tagsinput";

const AuthorInput = ({
  tags,
  required,
  label,
  error,
  inputValue,
  containerStyle,
  inputStyle,
  labelStyle,
  onChange,
  onChangeInput,
}) => {
  function renderTag(props) {
    let { tag, key, disabled, onRemove, classNameRemove, ...other } = props;
    return (
      <span key={key} {...other}>
        {`${tag.first_name} ${tag.last_name}`}
        {!disabled && (
          <a className={classNameRemove} onClick={(e) => onRemove(key)} />
        )}
      </span>
    );
  }

  return (
    <div
      className={css(styles.container, containerStyle && styles.containerStyle)}
    >
      <div
        className={css(
          styles.inputLabel,
          labelStyle && labelStyle,
          styles.text
        )}
      >
        {label && label}
        {required && <div className={css(styles.asterick)}>*</div>}
      </div>
      <TagsInput
        onlyUnique={true}
        style={styles.input}
        value={tags && tags}
        onChange={onChange}
        onChangeInput={(value) => tags.length !== 3 && onChangeInput(value)}
        inputValue={inputValue}
        className={error ? css(styles.error) : "react-tagsinput"}
        maxTags={3}
        renderTag={(props) => renderTag(props)}
        inputProps={{
          placeholder: "Search for author",
        }}
      />
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    height: 79,
    marginTop: 20,
    marginBottom: 20,
  },
  inputLabel: {
    height: 19,
    fontWeight: "500",
    width: "100%",
    color: "#232038",
    display: "flex",
    justifyContent: "flex-start",
    textAlign: "left",
    marginBottom: 10,
  },
  input: {
    height: 50,
    width: 600,
    overflowX: "scroll",
  },
  text: {
    fontFamily: "Roboto",
  },
  asterick: {
    color: colors.BLUE(1),
  },
  error: {
    backgroundColor: "rgb(251, 251, 253)",
    border: "1px solid rgb(232, 232, 242)",
    overflow: "hidden",
    paddingLeft: 15,
    paddingTop: 0,
    width: 585,
    height: 49,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderColor: colors.RED(1),
  },
  searchIcon: {
    height: 18,
    width: 18,
    position: "absolute",
    left: 15,
    bottom: 10,
  },
});

export default AuthorInput;
