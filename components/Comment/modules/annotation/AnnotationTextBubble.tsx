import { truncateText } from "~/config/utils/string";
import { css, StyleSheet } from "aphrodite";
import colors from "../../lib/colors";
import { useEffect, useState } from "react";
import globalColors from "~/config/themes/colors";
import { faArrowUpRightFromSquare } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import Link from "next/link";

const AnnotationTextBubble = ({ text, threadId }) => {
  const [isHover, setIsHover] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");
  const _text = truncateText(text || "", 350);
  const router = useRouter();

  useEffect(() => {
    const url = buildUrl();
    setUrl(url);
  }, []);

  const buildUrl = () => {
    const { documentId, documentSlug } = router.query;
    const documentType = router.asPath.split("/")[1];
    return `/${documentType}/${documentId}/${documentSlug}#threadId=${threadId}`;
  };

  return (
    <div
      className={css(styles.wrapper)}
      onMouseOver={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
    >
      <Link href={url} className={css(styles.anchor)}>
        {isHover && (
          <div className={css(styles.seeInContext)}>
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </div>
        )}
        <div className={css(styles.annotationText)}>
          <div>{_text}</div>
        </div>
      </Link>
    </div>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  anchor: {
    textDecoration: "none",
    color: "inherit",
  },
  annotationText: {
    background: colors.annotation.unselected,
    padding: "15px 20px",
    borderRadius: "0 4px 4px 0",
    marginBottom: 15,
    cursor: "pointer",
    fontStyle: "italic",
    fontSize: 15,
    borderLeft: "2px solid rgb(255, 212, 0)",
    border: `1px solid ${colors.annotation.unselected}`,
    ":hover": {
      border: `1px solid ${colors.annotation.selected}`,
    },
  },
  seeInContext: {
    color: globalColors.ORANGE_DARK(),
    position: "absolute",
    top: 10,
    right: 10,
    fontSize: 14,
  },
});

export default AnnotationTextBubble;
