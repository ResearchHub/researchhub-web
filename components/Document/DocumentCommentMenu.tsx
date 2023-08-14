import { StyleSheet, css } from "aphrodite";
import colors from "~/config/themes/colors";
import GenericMenu from "../shared/GenericMenu";
import IconButton from "../Icons/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { VisibilityPreferenceForViewingComments } from "./lib/DocumentViewerContext";
import {
  faGlobe,
  faMessageLines,
  faMessageSlash,
} from "@fortawesome/pro-regular-svg-icons";
import { faLockKeyhole, faSitemap } from "@fortawesome/pro-solid-svg-icons";

const DocumentCommentMenu = ({
  annotationCount = 0,
  selected,
  onSelect,
}: {
  annotationCount?: number;
  selected: VisibilityPreferenceForViewingComments;
  onSelect: Function;
}) => {
  const options = [
    {
      value: "PUBLIC",
      disableHover: true,
      disableStyle: true,
      icon: <FontAwesomeIcon icon={faGlobe} />,
      label: "All comments",
    },
    {
      value: "WORKSPACE",
      disableHover: true,
      disableStyle: true,
      icon: <FontAwesomeIcon icon={faSitemap} />,
      label: "Organization comments only",
    },
    {
      value: "PRIVATE",
      disableHover: true,
      disableStyle: true,
      icon: <FontAwesomeIcon icon={faLockKeyhole} />,
      label: "Private comments only",
    },
    {
      value: "OFF",
      preventDefault: true,
      disableHover: true,
      disableStyle: true,
      icon: <FontAwesomeIcon icon={faMessageSlash} />,
      label: "No comments",
    },
  ];

  return (
    <div>
      <GenericMenu
        softHide={true}
        options={options}
        selected={selected || "PUBLIC"}
        width={250}
        onSelect={(selected) => {
          onSelect(selected.value);
        }}
        direction="bottom-right"
        id="document-comment-menu"
      >
        <IconButton overrideStyle={styles.btn}>
          <FontAwesomeIcon icon={faMessageLines} />
          <div className={css(styles.pillContent)}>{annotationCount}</div>
        </IconButton>
      </GenericMenu>
    </div>
  );
};

const styles = StyleSheet.create({
  btn: {
    display: "flex",
    alignItems: "center",
    fontSize: 20,
    color: colors.MEDIUM_GREY2(),
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
  pillContent: {
    background: "#F5F5F9",
    borderRadius: "5px",
    padding: "2px 10px",
    color: colors.BLACK(0.5),
    fontSize: 14,
    fontWeight: 500,
  },
});

export default DocumentCommentMenu;
