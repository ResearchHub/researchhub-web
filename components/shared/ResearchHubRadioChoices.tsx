import { Fragment, ReactElement, ReactNode, SyntheticEvent } from "react";
import { NullableString } from "~/config/types/root_types";
import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";

export type RhRadioInputOption = { id: string; label: ReactNode };
type Props = {
  inputOptions: RhRadioInputOption[];
  inputWrapStyle?: string;
  onChange: (id: string) => void;
  selectedID: NullableString;
};

export default function ResearchHubRadioChoices({
  inputOptions,
  inputWrapStyle,
  onChange,
  selectedID,
}: Props): ReactElement {
  const formattedInputs = inputOptions.map(
    ({ label, id }: RhRadioInputOption) => (
      <div
        className={inputWrapStyle}
        key={`wrap-${id}`}
        onClick={(event: SyntheticEvent): void => {
          event.preventDefault();
          event.stopPropagation();
          onChange(id);
        }}
      >
        <div
          className={css(
            styles.button,
            selectedID === id ? styles.buttonActive : styles.buttonInactive
          )}
          id={id}
        />
        <label htmlFor={id}>{label}</label>
      </div>
    )
  );
  return <Fragment>{formattedInputs}</Fragment>;
}

const styles = StyleSheet.create({
  button: {
    width: 8,
    height: 8,
    borderRadius: 50,
    border: `2px solid ${colors.LIGHT_GREY_BORDER}`,
  },
  buttonActive: { background: colors.BLUE(1) },
  buttonInactive: { background: colors.LIGHT_GREY(1) },
});
