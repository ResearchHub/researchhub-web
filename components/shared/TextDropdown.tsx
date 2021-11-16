import { css, StyleDeclarationValue, StyleSheet } from "aphrodite";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactElement, SyntheticEvent, useMemo, useState } from "react";
import { ValidCitationType } from "../Hypothesis/Citation/modal/AddNewSourceBodySearch";
import colors from "~/config/themes/colors";
import ResearchHubPopover from "../ResearchHubPopover";

export type TextDropdownOption = {
  label: string;
  optionLabel?: string;
  value: ValidCitationType;
};
export type TextDropdownOptions = TextDropdownOption[];

type Props = {
  dropdownStyle?: StyleDeclarationValue | StyleDeclarationValue[];
  labelStyle?: StyleDeclarationValue | StyleDeclarationValue[];
  onSelect: (selected: TextDropdownOption) => void;
  options: TextDropdownOptions;
  selected: TextDropdownOption;
};

function TextDropdownOption({ label, onSelect }) {
  return (
    <div className={css(styles.optionElements)} onClick={onSelect}>
      {label}
    </div>
  );
}
export default function TextDropdown({
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
          const { label, value, optionLabel } = option;
          return (
            <TextDropdownOption
              key={`${label}-${value}`}
              label={optionLabel ?? label}
              onSelect={(event: SyntheticEvent): void => {
                event.stopPropagation();
                onSelect(option);
                setIsOpen(false);
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
          <div className={css(styles.labelText)}>{currLabel}</div>
          <div className={css(styles.labelArrow)}>
            {isOpen ? (
              <FontAwesomeIcon icon={faCaretUp} />
            ) : (
              <FontAwesomeIcon icon={faCaretDown} />
            )}
          </div>
        </div>
      }
      align="start"
      containerStyle={styles.textDropdown}
      padding={0}
      popoverContent={
        <div className={css(styles.optionsContainer, dropdownOverride)}>
          {optionElements}
        </div>
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
    width: "100%",
  },
  label: {
    cursor: "pointer",
    display: "flex",
  },
  labelArrow: {
    color: colors.TEXT_GREY(1),
    fontSize: 18,
    marginTop: 2,
  },
  labelText: {
    marginRight: 8,
  },
  optionsContainer: {
    backgroundColor: colors.ICY_GREY,
    border: `1px solid ${colors.LIGHT_GREY_BORDER}`,
    borderBottom: "none",
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    width: 200,
  },
  optionElements: {
    alignItems: "center",
    borderBottom: `1px solid ${colors.LIGHT_GREY_BORDER}`,
    boxSizing: "border-box",
    cursor: "pointer",
    display: "flex",
    fontSize: 14,
    fontWeight: "normal",
    height: 44,
    maxWidth: 200,
    overflow: "hidden",
    padding: 16,
    textOverflow: "ellipsis",
    width: "100%",
    ":hover": {
      backgroundColor: colors.LIGHT_GREY_BACKGROUND,
    },
  },
});
