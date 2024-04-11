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
import numeral from "numeral";
import { ReferenceProjectsUpsertContextProvider } from "~/components/ReferenceManager/references/reference_organizer/context/ReferenceProjectsUpsertContext";
import colors from "~/config/themes/colors";
import Link from "next/link";

const FeedCardActivity = ({
  unifiedDocumentId,
  docUrl,
  contentId,
  contentType,
  discussionCount,
  citationCount,
  reviewScore,
}: {
  contentId: ID;
  contentType: "paper" | "post";
  unifiedDocumentId: ID;
  docUrl: string;
  discussionCount: number;
  citationCount: number;
  reviewScore: number;
}) => {
  return (
    <div className={css(styles.wrapper)} onClick={(e) => {
      e.preventDefault();
    }}>
      <ReferenceProjectsUpsertContextProvider>
        {reviewScore > 0 && (
          <>
            <Link href={docUrl + "/reviews"}>
              <IconButton variant="round" overrideStyle={styles.iconButton}>
                <div
                  className={css(styles.discussionCount)}
                >
                  <FontAwesomeIcon icon={faStar}></FontAwesomeIcon>
                  <span>{numeral(reviewScore).format("0.0a")}</span>
                </div>
              </IconButton>
            </Link>
            <div className={css(styles.divider)} />
          </>
        )}
        {citationCount > 0 && (
          <>
            <Link href={docUrl}>
              <IconButton variant="round" overrideStyle={styles.iconButton}>
                <div
                  className={css(styles.citationCount)}
                  data-tip={`Times paper has been cited`}
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
            </Link>
            <div className={css(styles.divider)} />
          </>
        )}
        <Link href={docUrl + "/conversation"}>
          <IconButton variant="round" overrideStyle={styles.iconButton}>
            <div className={css(styles.discussionCount)}>
              <FontAwesomeIcon icon={faComments}></FontAwesomeIcon>
              <span>{discussionCount}</span>
            </div>
          </IconButton>
        </Link>
        {unifiedDocumentId && (
          <>
            <div className={css(styles.divider)} />
            <SaveToRefManager
              unifiedDocumentId={unifiedDocumentId}
              contentId={contentId}
              contentType={contentType}
              unsavedBtnComponent={
                <IconButton variant="round" overrideStyle={styles.iconButton}>
                  <FontAwesomeIcon
                    icon={faBookmark}
                    style={{ fontSize: 14 }}
                  />
                  <span>Save</span>
                </IconButton>
              }
              savedBtnComponent={
                <IconButton variant="round" overrideStyle={styles.iconButton}>
                  <FontAwesomeIcon
                    icon={solidBookmark}
                    style={{ color: "#909090", fontSize: 14 }}
                  />
                  <span>Save</span>
                </IconButton>
              }
            />
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
    ":hover": {
      backgroundColor: colors.GREY(0.3),
    }
  },
});

export default FeedCardActivity;
