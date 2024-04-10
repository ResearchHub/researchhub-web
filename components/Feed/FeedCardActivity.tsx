import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faBookmark as solidBookmark,
} from "@fortawesome/pro-solid-svg-icons";
import { css, StyleSheet } from "aphrodite";
import { UnifiedDocument } from "~/config/types/root_types";
import SaveToRefManager from "~/components/Document/lib/SaveToRefManager";
import { faBookmark } from "@fortawesome/pro-regular-svg-icons";
import IconButton from "../Icons/IconButton";
import Image from "next/image";
import ReactTooltip from "react-tooltip";

const FeedCardActivity = ({
  unifiedDocument,
  discussionCount,
  citationCount,
}: {
  unifiedDocument: UnifiedDocument;
  discussionCount: number;
  citationCount: number;
}) => {
  return (
    <div className={css(styles.wrapper)}>
      <ReactTooltip effect="solid" />
      {citationCount > 0 && (
        <>
          <IconButton variant="round" overrideStyle={styles.iconButton}>
            <div
              className={css(styles.citationCount)}
              data-tip={`This paper has been cited ${citationCount} times`}
            >
              <Image
                alt="Citation"
                width={15}
                height={15}
                src={"/static/citation.svg"}
              />
              <span>{citationCount}</span>
            </div>
          </IconButton>
          <div className={css(styles.divider)} />
        </>
      )}
      <IconButton variant="round" overrideStyle={styles.iconButton}>
        <div className={css(styles.discussionCount)}>
          <FontAwesomeIcon icon={faComments}></FontAwesomeIcon>
          <span>{discussionCount}</span>
        </div>
      </IconButton>
      <div className={css(styles.divider)} />
      <IconButton variant="round" overrideStyle={styles.iconButton}>
        <SaveToRefManager
          unifiedDocument={unifiedDocument}
          unsavedBtnComponent={
            <div>
              <FontAwesomeIcon
                icon={faBookmark}
                style={{ marginRight: 5, fontSize: 14 }}
              />
              <span>Save</span>
            </div>
          }
          savedBtnComponent={
            <div>
              <FontAwesomeIcon
                icon={solidBookmark}
                style={{ marginRight: 5, color: "#909090", fontSize: 14 }}
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
    alignItems: "center",
    columnGap: "3px",
  },
  divider: {
    borderRight: "1px solid #e0e0e0",
    height: 20,
  },
  discussionCount: {
    display: "flex",
    alignItems: "center",
    columnGap: "5px",
    fontSize: 14,
  },
  citationCount: {
    display: "flex",
    alignItems: "center",
    columnGap: "5px",
  },
  iconButton: {
    padding: "4px 8px",
    fontSize: 14,
    height: "auto",
    border: "none",
    fontWeight: 400,
  },
});

export default FeedCardActivity;
