import IconButton from "../Icons/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/pro-regular-svg-icons";
import { StyleSheet, css } from "aphrodite";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useHistory } from "../contexts/HistoryManagerContext";

const BackBtn = ({
  label,
  href = "/",  // Default to home page if no specific href provided
  labelStyle,
}: {
  label: string;
  href?: string;
  labelStyle?: any;
}) => {
  const router = useRouter();
  const historyManager = useHistory();
  

  const handleBackClick = (e) => {
    e.preventDefault();
    if (historyManager.canGoBack()) {
      router.back();
    } else {
      router.push(href);
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
