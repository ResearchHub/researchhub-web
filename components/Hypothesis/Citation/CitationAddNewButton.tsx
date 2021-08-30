import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState } from "react";
import AddNewSourceModal from "./modal/AddNewSourceModal";
import colors from "~/config/themes/colors";
import { ID } from "config/types/root_types";

type Props = {
  hypothesisID: ID;
  lastFetchTime: number | null;
  updateLastFetchTime: Function;
};

export default function CitationAddNewButton({
  hypothesisID,
  updateLastFetchTime,
}: Props): ReactElement<"div"> {
  const [shouldOpenModal, setShouldOpenModal] = useState<boolean>(false);
  return (
    <div
      className={css(styles.citationAddNewButton)}
      onClick={(): void => setShouldOpenModal(true)}
      role="button"
    >
      <AddNewSourceModal
        hypothesisID={hypothesisID}
        isModalOpen={shouldOpenModal}
        onCloseModal={(): void => setShouldOpenModal(false)}
        updateLastFetchTime={updateLastFetchTime}
      />
      <span className={css(styles.plusCircle)}>
        <span className={css(styles.plus)}>{"+"}</span>
      </span>
      <span>{"Add new Paper"}</span>
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
    userSelect: "none",
  },
  plus: {
    color: colors.BLUE(1),
    left: 5,
    position: "absolute",
    top: -1,
  },
  plusCircle: {
    alignItems: "center",
    border: `1px solid ${colors.GREY(1)}`,
    borderRadius: "50%",
    color: "#fff",
    display: "flex",
    fontSize: 21,
    height: 21,
    justifyContent: "center",
    marginRight: 8,
    position: "relative",
    width: 21,
  },
});
