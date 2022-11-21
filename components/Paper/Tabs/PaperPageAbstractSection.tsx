import { css, StyleSheet } from "aphrodite";
import { ReactElement, useState } from "react";
import SimpleEditor from "~/components/CKEditor/SimpleEditor";
import Button from "~/components/Form/Button";
import colors from "~/config/themes/colors";
import { silentEmptyFnc } from "~/config/utils/nullchecks";

export default function PaperPageAbstractSection(): ReactElement {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  return (
    <div className={css(styles.paperPageAbstractSection)}>
      <div>
        <h2>Abstract</h2>
      </div>
      {!isEditMode ? (
        <div>
          <SimpleEditor
            containerStyle={null}
            editing={undefined}
            id={"postBody"}
            initialData="Testing"
            isBalloonEditor
            noTitle
            onChange={silentEmptyFnc}
            readOnly
            required={false}
          />
        </div>
      ) : (
        <div>
          <SimpleEditor
            containerStyle={null}
            editing
            id="editPostBody"
            initialData="Testing"
            isBalloonEditor
            noTitle
            onChange={() => {}}
            readOnly={false}
          />
          <div className={css(styles.editButtonRow)}>
            <Button
              isWhite={true}
              label={"Cancel"}
              onClick={(): void => setIsEditMode(false)}
              size={"small"}
            />
            <Button label={"Save"} onClick={() => {}} size={"small"} />
          </div>
        </div>
      )}
    </div>
  );
}

const styles = StyleSheet.create({
  paperPageAbstractSection: {
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "column",
    "@media only screen and (max-width: 500px)": {
      marginTop: 15,
    },
  },
  editButtonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
  },
  tab: {
    padding: "4px 12px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    marginRight: 8,
    color: "rgba(36, 31, 58, 0.6)",
    borderRadius: 4,
    ":hover": {
      color: colors.NEW_BLUE(),
    },
    "@media only screen and (max-width: 967px)": {
      marginRight: 0,
    },
    "@media only screen and (max-width: 415px)": {
      fontSize: 12,
    },
  },
});
