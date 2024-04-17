import IconButton from "../Icons/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/pro-regular-svg-icons";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import { useRouter } from "next/router";

const BackBtn = ({
  label,
  href,
  labelStyle,
}: {
  label: string;
  href: string;
  labelStyle?: any;
}) => {
  const router = useRouter();
  const hasHistory = false; //typeof window !== "undefined" && window.history.length > 2;

  const handleBackClick = (e) => {
    const shouldOpenNewTab = e.metaKey || e.ctrlKey; // metaKey is for Command on Mac
    // if (shouldOpenNewTab && document.referrer) {
    //   window.open(document.referrer, "_blank");
    // } else {
    //   router.back();
    // }
    // router.back();
  };

  return (
    <div className={css(styles.backToPrev)}>
      <div className={css(styles.backToPrev)}>
        <IconButton variant="round" overrideStyle={styles.backButton}>
          {hasHistory ? (
            <div onClick={handleBackClick}>
              <FontAwesomeIcon
                icon={faArrowLeftLong}
                style={{ color: "black" }}
              />
            </div>
          ) : (
            <Link href={href}>
              <FontAwesomeIcon
                icon={faArrowLeftLong}
                style={{ color: "black" }}
              />
            </Link>
          )}
        </IconButton>
        <div className={css(styles.label, labelStyle)}>{label}</div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  backToPrev: {
    display: "flex",
    alignItems: "center",
  },
  label: {},
  backButton: {
    border: 0,
    marginRight: 3,
    paddingLeft: 0,
  },
});

export default BackBtn;
