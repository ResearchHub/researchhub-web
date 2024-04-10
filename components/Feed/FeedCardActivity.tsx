import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faStar,
  faBookmark as solidBookmark,
} from "@fortawesome/pro-solid-svg-icons";
import { css, StyleSheet } from "aphrodite";
import { ID } from "~/config/types/root_types";
import SaveToRefManager from "~/components/Document/lib/SaveToRefManager";
import { faBookmark } from "@fortawesome/pro-regular-svg-icons";
import IconButton from "../Icons/IconButton";
import Image from "next/image";
import ReactTooltip from "react-tooltip";
import numeral from "numeral";
import { ReferenceProjectsUpsertContextProvider } from "~/components/ReferenceManager/references/reference_organizer/context/ReferenceProjectsUpsertContext";

const FeedCardActivity = ({
  unifiedDocumentId,
  contentId,
  contentType,
  discussionCount,
  citationCount,
  reviewScore,
}: {
  contentId: ID;
  contentType: "paper" | "post";
  unifiedDocumentId: ID;
  discussionCount: number;
  citationCount: number;
  reviewScore: number;
}) => {
  return (
    <div className={css(styles.wrapper)} onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}>
      <ReferenceProjectsUpsertContextProvider>
        <ReactTooltip effect="solid" />
        {reviewScore > 0 && (
          <>
            <IconButton variant="round" overrideStyle={styles.iconButton}>
              <div
                className={css(styles.discussionCount)}
                data-tip={`Average review score received from community`}
              >
                <FontAwesomeIcon icon={faStar}></FontAwesomeIcon>
                <span>{numeral(reviewScore).format("0.0a")}</span>
              </div>
            </IconButton>
            <div className={css(styles.divider)} />
          </>
        )}
        {citationCount > 0 && (
          <>
            <IconButton variant="round" overrideStyle={styles.iconButton}>
              <div
                className={css(styles.citationCount)}
                data-tip={`Times paper has been cited`}
              >
                <Image
                  alt="Review"
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
        {unifiedDocumentId && (
          <>
            <div className={css(styles.divider)} />
            <IconButton variant="round" overrideStyle={styles.iconButton}>
              <SaveToRefManager
                unifiedDocumentId={unifiedDocumentId}
                contentId={contentId}
                contentType={contentType}
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
          </>
        )}
      </ReferenceProjectsUpsertContextProvider>
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
