import { css, StyleSheet } from "aphrodite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ID } from "config/types/root_types";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import { ReactElement, SyntheticEvent, useState } from "react";
import { ValidCitationType } from "./modal/AddNewSourceBodySearch";
import AddNewSourceModal from "./modal/AddNewSourceModal";
import Button from "../../Form/Button";
import colors from "~/config/themes/colors";

type Props = {
  citationType: ValidCitationType;
  hypothesisID: ID;
  lastFetchTime: number | null;
  updateLastFetchTime: Function;
};

export default function CitationAddNewButton({
  citationType,
  hypothesisID,
  updateLastFetchTime,
}: Props): ReactElement<"div"> {
  const [shouldOpenModal, setShouldOpenModal] = useState<boolean>(false);

  return (
    <Button
      customButtonStyle={styles.citationAddNewButton}
      onClick={(): void => setShouldOpenModal(true)}
      role="button"
      label={
        <div className={css(styles.buttonInner)}>
          <AddNewSourceModal
            citationType={citationType}
            hypothesisID={hypothesisID}
            isModalOpen={shouldOpenModal}
            onCloseModal={(event: SyntheticEvent): void => {
              if (!isNullOrUndefined(event)) {
                event.preventDefault();
                event.stopPropagation();
              }
              setShouldOpenModal(false);
            }}
            updateLastFetchTime={updateLastFetchTime}
          />
          <FontAwesomeIcon
            icon={"plus-circle"}
            className={css(styles.plusCircle)}
          />
          <span>{"Add New Source"}</span>
        </div>
      }
    />
  );
}

const styles = StyleSheet.create({
  citationAddNewButton: {
    alignItems: "center",
    color: colors.BLUE(1),
    cursor: "pointer",
    display: "flex",
    fontSize: 16,
    height: 50,
    width: 180,
    userSelect: "none",
  },
  plus: {
    // color: colors.BLUE(1),
    left: 5,
    position: "absolute",
    top: -1,
  },
  plusCircle: {
    // fontSize: ,
    marginRight: 6,
  },
  buttonInner: {
    display: "flex",
    alignItems: "center",
  },
});
