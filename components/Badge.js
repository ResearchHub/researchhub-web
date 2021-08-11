import { StyleSheet, css } from "aphrodite";
import PropTypes from "prop-types";

import { CloseIcon } from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import { isDevEnv } from "~/config/utils/env";

const Badge = ({
  label,
  id,
  onClick = null,
  onRemove = null,
  badgeClassName = null,
}) => {
  return (
    <div
      className={css(styles.badge, badgeClassName)}
      onClick={onClick}
      data-test={isDevEnv() ? `badge-${id}` : undefined}
    >
      <div className={css(styles.badgeLabel)}>{label}</div>
      <div className={css(styles.badgeRemove)} onClick={onRemove}>
        <CloseIcon />
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  badge: {
    display: "flex",
    margin: "0px 10px 0px 0",
    minWidth: "0",
    boxSizing: "border-box",
    backgroundColor: colors.LIGHT_BLUE(),
    borderRadius: "2px",
    color: colors.BLUE(),
    cursor: "pointer",
    padding: "5px 8px",
    ":hover": {
      boxShadow: `inset 0px 0px 0px 1px ${colors.BLUE()}`,
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      margin: "0px 6px 6px 0",
    },
  },
  badgeLabel: {
    borderRadius: "2px",
    fontSize: "85%",
    overflow: "hidden",
    padding: "3px 3px 3px 6px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  badgeRemove: {
    display: "flex",
    paddingLeft: "4px",
    paddingRight: "4px",
    boxSizing: "border-box",
    alignItems: "center",
    borderRadius: "2px",
  },
});

Badge.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onRemove: PropTypes.func,
};

export default Badge;
