import ResearchHubRadioChoices from "../shared/ResearchHubRadioChoices";
import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import { DocumentContext } from "./lib/DocumentContext";
import { useContext } from "react";
import GenericMenu from "../shared/GenericMenu";
import IconButton from "../Icons/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/pro-light-svg-icons";

const DocumentCommentMenu = ({}) => {
  const documentContext = useContext(DocumentContext);

  const options = [
    {
      value: "toggle-visibility",
      group: "Comments",
      preventDefault: true,
      disableHover: true,
      disableStyle: true,
      html: (
        <div
          style={{
            flexDirection: "column",
            display: "flex",
            cursor: "pointer",
          }}
        >
          <ResearchHubRadioChoices
            checkboxStyleOverride={styles.checkbox}
            inputWrapStyle={styles.checkboxRowWrapper}
            inputOptions={[
              {
                id: "all",
                label: "All comments",
              },
              {
                id: "mine",
                label: "Mine only",
              },
              {
                id: "none",
                label: "No comments",
              },
            ]}
            onChange={(selected) => {
              documentContext.setPreference({
                key: "comments",
                value: selected,
              });
            }}
            selectedID={documentContext.preferences.comments}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <GenericMenu
        softHide={true}
        options={options}
        width={150}
        direction="top-center"
        id="document-comment-menu"
      >
        <IconButton overrideStyle={styles.btnDots}>
          <FontAwesomeIcon icon={faComments} />
        </IconButton>
      </GenericMenu>
    </div>
  );
};

const styles = StyleSheet.create({
  btnDots: {
    fontSize: 22,
    color: colors.BLACK(1.0),
    padding: "6px 12px",
  },
  checkbox: {
    minHeight: 14,
    minWidth: 14,
  },
  checkboxRowWrapper: {
    cursor: "pointer",
    padding: "8px 12px",
    boxSizing: "border-box",
    fontSize: 14,
    borderRadius: 4,
    ":hover": {
      background: colors.LIGHTER_GREY(1.0),
      transition: "0.2s",
    },
  },
});

export default DocumentCommentMenu;
