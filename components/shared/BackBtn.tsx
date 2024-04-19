import IconButton from "../Icons/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/pro-regular-svg-icons";
import { StyleSheet, css } from "aphrodite";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const referrer = document.referrer;
    const currentDomain = window.location.origin;
    const isSameDomain = referrer.startsWith(currentDomain);
    const hasHistory = window.history.length > 2 && isSameDomain;

    setCanGoBack(hasHistory);
  }, []);

  const handleBackClick = (e) => {
    e.preventDefault();
    if (canGoBack) {
      router.back();
    } else {
      router.push(href);  // Redirect to homepage or a default route
    }
  };

  return (
    <div className={css(styles.backToPrev)}>
      <IconButton variant="round" overrideStyle={styles.backButton} onClick={handleBackClick}>
        <FontAwesomeIcon icon={faArrowLeftLong} style={{ color: "black" }} />
      </IconButton>
      <div className={css(styles.label, labelStyle)}>{label}</div>
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
  },
});

export default BackBtn;
