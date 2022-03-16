import { css, StyleSheet } from "aphrodite";
import { ChangeEvent, ReactElement, SyntheticEvent } from "react";
import colors from "~/config/themes/colors";

type Props = {
  error?: boolean;
  label: string;
  onChange: (inputValue: null | string) => void;
  placeholder?: string;
  required?: boolean;
  value: null | string;
};

export default function PaperUploadWizardInput({
  error,
  label,
  onChange,
  placeholder,
  required,
  value,
}): ReactElement<"div"> {
  const valueLength = value !== null ? value.length : 0;
  console.warn("error: ", error);
  return (
    <div className={css(styles.paperUploadWizardInput)}>
      <div className={css(styles.label)}>
        {label}
        {required && <span style={{ color: colors.BLUE(1) }}>{" * "}</span>}
      </div>
      <div className={css(styles.inputWrap)}>
        <input
          className={css(styles.input, error && styles.inputError)}
          maxLength={250}
          onChange={(event: ChangeEvent<HTMLInputElement>): void =>
            onChange(event.target?.value)
          }
          placeholder={placeholder ?? ""}
          required={required}
          type="string"
          value={value}
        />
        <div className={css(styles.valueLengthIndicator)}>
          {valueLength} {" / 250"}
        </div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  paperUploadWizardInput: { boxSizing: "border-box" },
  input: {
    border: `1px solid ${colors.LIGHT_GREY_BORDER}`,
    borderRadius: 3,
    boxSizing: "border-box",
    fontSize: 16,
    fontWeight: 400,
    height: 52,
    padding: "0 80px 0 16px",
    width: "100%",
    ":focus": { outline: "none" },
  },
  inputError: {
    border: `1px solid ${colors.RED(1)}`,
  },
  inputWrap: { boxSizing: "border-box", position: "relative", width: "100%" },
  label: { fontWeight: 500, fontSize: 18, paddingBottom: 8 },
  valueLengthIndicator: {
    color: colors.LIGHT_GREY_TEXT,
    fontSize: 16,
    height: 52,
    position: "absolute",
    right: 12,
    top: 16,
  },
});
