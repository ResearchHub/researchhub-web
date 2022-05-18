import { Fragment, ReactElement, ReactNode, SyntheticEvent } from "react";
import { NullableString } from "~/config/types/root_types";
import { silentEmptyFnc } from "~/config/utils/nullchecks";
import CheckBox from "~/components//Form/CheckBox";
import { css, StyleSheet } from "aphrodite";

export type RhRadioInputOption = {
  id: string;
  label: ReactNode;
  description?: string;
};
type Props = {
  inputOptions: RhRadioInputOption[];
  inputWrapStyle?: any;
  labelDescriptionStyle?: any;
  onChange: (id: string) => void;
  selectedID: NullableString;
};

export default function ResearchHubRadioChoices({
  inputOptions,
  inputWrapStyle,
  labelDescriptionStyle,
  onChange,
  selectedID,
}: Props): ReactElement {
  const formattedInputs = inputOptions.map(
    ({ label, id, description }: RhRadioInputOption) => (
      <div
        className={css(styles.inputWrap, inputWrapStyle)}
        key={`wrap-${id}`}
        onClick={(event: SyntheticEvent): void => {
          event.preventDefault();
          event.stopPropagation();
          onChange(id);
        }}
      >
        <div className={css(styles.checkboxWrap)}>
          <CheckBox
            active={selectedID === id}
            isSquare={false}
            onChange={silentEmptyFnc}
            small
          />
        </div>
        <div className={css(styles.contentWrap)}>
          <label htmlFor={id}>{label}</label>
          {description &&
            <div className={css(labelDescriptionStyle, styles.labelDescription)}>{description}</div>
          }
        </div>
      </div>
    )
  );
  return <Fragment>{formattedInputs}</Fragment>;
}

const styles = StyleSheet.create({
  inputWrap: {
    display: "flex",
    width: "100%",
    cursor: "pointer",
  },
  checkboxWrap: {
    display: "flex",
    paddingTop: 3,
  },
  contentWrap: {
    display: "flex",
    flexDirection: "column"
  },
  labelDescription: {
    marginTop: 4,
    fontSize: 14,
  },
});
