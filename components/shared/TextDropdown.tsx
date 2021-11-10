import { css, StyleDeclarationValue, StyleSheet } from "aphrodite";
import { ReactElement, SyntheticEvent, useMemo, useState } from "react";
import { ValidCitationType } from "../Hypothesis/Citation/modal/AddNewSourceBodySearch";
import ResearchHubPopover from "../ResearchHubPopover";

export type TextDropdownOption = {
  label: string;
  value: ValidCitationType;
};
export type TextDropdownOptions = TextDropdownOption[];

type Props = {
  className?: StyleDeclarationValue | StyleDeclarationValue[];
  dropdownStyle?: StyleDeclarationValue | StyleDeclarationValue[];
  labelStyle?: StyleDeclarationValue | StyleDeclarationValue[];
  onSelect: (selected: TextDropdownOption) => void;
  options: TextDropdownOptions;
  selected: TextDropdownOption;
};

function TextDropdownOption({ label, onSelect }) {
  return <div onClick={onSelect}>{label}</div>;
}
export default function TextDropdown({
  className: classNameOverride,
  dropdownStyle: dropdownOverride,
  labelStyle: labelOverride,
  onSelect,
  selected,
  options,
}: Props): ReactElement<typeof ResearchHubPopover> {
  const { label: currLabel, value: selectedValue } = selected;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const optionElements = useMemo(
    (): ReactElement<typeof TextDropdownOption>[] =>
      options.map(
        (
          option: TextDropdownOption
        ): ReactElement<typeof TextDropdownOption> => {
          const { label, value } = option;
          return (
            <TextDropdownOption
              key={`${label}-${value}`}
              label={label}
              onSelect={(event: SyntheticEvent): void => {
                event.stopPropagation();
                onSelect(option);
              }}
            />
          );
        }
      ),
    [options]
  );

  return (
    <ResearchHubPopover
      isOpen={isOpen}
      targetContent={
        <div
          className={css(styles.label, labelOverride)}
          onClick={(event: SyntheticEvent): void => {
            event.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          {currLabel}
        </div>
      }
      align="start"
      containerStyle={styles.textDropdown}
      padding={0}
      popoverContent={
        <div className={css(styles.optionsContainer)}>{optionElements}</div>
      }
      positions={["bottom"]}
      setIsPopoverOpen={setIsOpen}
      withArrow={false}
    />
  );
}

const styles = StyleSheet.create({
  textDropdown: {
    height: "100%",
    position: "relative",
    width: "100%",
  },
  label: {
    cursor: "pointer",
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    width: 1000,
    backgroundColor: "red",
  },
});
