import { BodyTypeVals, NEW_SOURCE_BODY_TYPES } from "./modalBodyTypes";
import { css, StyleSheet } from "aphrodite";
import { breakpoints } from "../../../../config/themes/screen.js";
import Button from "../../../Form/Button";
import React, { ReactElement, useState } from "react";
import ResearchhubOptionCard from "../../../ResearchhubOptionCard";

const { NEW_PAPER_UPLOAD, SEARCH } = NEW_SOURCE_BODY_TYPES;

type Props = {
  setBodyType: (bodyType: BodyTypeVals) => void;
};

export default function AddNewSourceBodyStandBy({
  setBodyType,
}: Props): ReactElement<"div"> {
  const [activeBodyType, setActiveBodyType] = useState<BodyTypeVals>(SEARCH);
  return (
    <div className={css(styles.addNewSourceBodyStandBy)}>
      <ResearchhubOptionCard
        description="I would like to cite a source that already exists on ResearchHub"
        header="Search for a source on ResearchHub"
        imgSrc="/static/icons/search.png"
        isActive={activeBodyType === SEARCH}
        isCheckboxSquare={false}
        key={SEARCH}
        onSelect={(): void => setActiveBodyType(SEARCH)}
      />
      <ResearchhubOptionCard
        description="Upload a new paper that does not exist on ResearchHub"
        header="Upload a new paper"
        imgSrc="/static/icons/uploadPaper.png"
        isActive={activeBodyType === NEW_PAPER_UPLOAD}
        isCheckboxSquare={false}
        key={SEARCH}
        onSelect={(): void => setActiveBodyType(NEW_PAPER_UPLOAD)}
      />
      <div className={css(styles.buttonWrap)}>
        <Button
          customButtonStyle={styles.buttonCustomStyle}
          customLabelStyle={styles.buttonLabel}
          label="Next"
          onClick={(): void => setBodyType(activeBodyType)}
        />
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  addNewSourceBodyStandBy: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    margin: "36px 36px 26px",
  },
  buttonCustomStyle: {
    height: "50px",
    width: "160px",
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      width: "160px",
      height: "50px",
    },
  },
  buttonLabel: {
    alignItems: "center",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
  buttonWrap: {
    marginTop: 16,
  },
});
