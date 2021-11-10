import { css, StyleSheet } from "aphrodite";
import { ReactElement } from "react";

export type TextDropdownOption = {
  label: string;
  value: string;
};
export type TextDropdownOptions = TextDropdownOption[];

type Props = {
  className: string;
  options: TextDropdownOptions;
  value: TextDropdownOption;
};

export default function TextDropdown({
  className,
}: Props): ReactElement<"div"> {
  return <div className={css(styles.) + className}>
    
  </div>;
}

const styles= StyleSheet.create({
  textDropdown: {}
});