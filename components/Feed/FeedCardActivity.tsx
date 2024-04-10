import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faBookmark as solidBookmark,
} from "@fortawesome/pro-solid-svg-icons";
import { css, StyleSheet } from "aphrodite";
import { UnifiedDocument } from "~/config/types/root_types";
import colors from "~/config/themes/colors";
import SaveToRefManager from "~/components/Document/lib/SaveToRefManager";
import { faBookmark } from "@fortawesome/pro-regular-svg-icons";
import IconButton from "../Icons/IconButton";

const FeedCardActivity = ({
  unifiedDocument,
  discussionCount,
}: {
  unifiedDocument: UnifiedDocument;
  discussionCount: number;
}) => {
  return (
    <div className={css(styles.wrapper)}>
      <IconButton variant="round">
        <div className={css(styles.discussionCount)}>
          <FontAwesomeIcon icon={faComments}></FontAwesomeIcon>
          <span>{discussionCount}</span>
        </div>
      </IconButton>
      <IconButton variant="round">
        <SaveToRefManager
          unifiedDocument={unifiedDocument}
          unsavedBtnComponent={
            <div>
              <FontAwesomeIcon icon={faBookmark} style={{ marginRight: 3 }} />
              <span>Save</span>
            </div>
          }
          savedBtnComponent={
            <div>
              <FontAwesomeIcon
                icon={solidBookmark}
                style={{ marginRight: 3, color: colors.MEDIUM_GREY2() }}
              />
              <span>Save</span>
            </div>
          }
        />
      </IconButton>
    </div>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    display: "flex",
  },
  discussionCount: {},
});

export default FeedCardActivity;
