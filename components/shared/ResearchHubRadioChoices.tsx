import { Fragment, ReactElement, ReactNode, SyntheticEvent } from "react";
import { NullableString } from "~/config/types/root_types";
import { silentEmptyFnc } from "~/config/utils/nullchecks";
import CheckBox from "~/components//Form/CheckBox";

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
        <CheckBox
          active={selectedID === id}
          isSquare={false}
          onChange={silentEmptyFnc}
          small
        />
        <label htmlFor={id}>{label}</label>
      </div>
    )
  );
  return <Fragment>{formattedInputs}</Fragment>;
}
