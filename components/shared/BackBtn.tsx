import IconButton from "../Icons/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/pro-regular-svg-icons";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import { breakpoints } from "~/config/themes/screen";

const BackBtn = ({
  label,
  href,
  labelStyle,
}: {
  label: string;
  href: string;
  labelStyle?: any;
}) => {
  return (
    <div className={css(styles.backToPrev)}>
      <div className={css(styles.backToPrev)}>
        <IconButton variant="round" overrideStyle={styles.backButton}>
          <Link href={href}>
            <FontAwesomeIcon
              icon={faArrowLeftLong}
              style={{ color: "black" }}
            />
          </Link>
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
  },
});

export default BackBtn;
