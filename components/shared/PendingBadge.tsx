import { faExclamationCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import colors from "~/config/themes/colors";
import { css, StyleSheet } from "aphrodite";

const PendingBadge = () => {
  return (
    <div className={css(styles.badge)}>
      <FontAwesomeIcon icon={faExclamationCircle} style={{ marginRight: 5 }} />
      <span>pending</span>
    </div>    
  )
}

const styles = StyleSheet.create({
  badge: {
    background: colors.YELLOW2(),
    display: "flex",
    alignItems: "center",
    textTransform: "lowercase",
    color: "white",
    borderRadius: "4px",
    padding: "2px 4px",
    fontWeight: 500,
    fontSize: 12
  }
})

export default PendingBadge;