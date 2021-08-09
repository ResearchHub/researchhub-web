import { css, StyleSheet } from "aphrodite";
import React, { ReactElement, useState } from "react";
import colors from "../../../config/themes/colors";
import icons from "../../../config/themes/icons";

type Props = {};

export default function CitationAddNewButton({  }: Props): ReactElement<"div"> {
  const [shouldOpenModal, setShouldOpenModal] = useState<boolean>(false);
  return (
    <div
      className={css(styles.citationAddNewButton)}
      onClick={(): void => setShouldOpenModal(true)}
      role="button"
    >
      <span className={css(styles.plusIcon)}>{icons.plusCircleSolid}</span>
      <span>{"Add new source"}</span>
    </div>
  );
}

const styles = StyleSheet.create({
  citationAddNewButton: {
    alignItems: "center",
    color: colors.BLUE(1),
    cursor: "pointer",
    display: "flex",
    fontSize: 16,
    height: 21,
    width: 200,
  },
  plusIcon: {
    backgroundColor: colors.BLUE(1),
    color: "#fff",
    borderRadius: "50%",
    height: 14,
    width: 14,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: `1px solid ${colors.GREY(1)}`,
    marginRight: 8,
  },
});
