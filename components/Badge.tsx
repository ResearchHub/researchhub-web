import { StyleSheet, css } from "aphrodite";
import { CloseIcon } from "~/config/themes/icons";
import colors, { badgeColors } from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import { isDevEnv } from "~/config/utils/env";
import { ReactNode } from "react";

type Args = {
  label: string,
  id?: string,
  children?: ReactNode[],
  onClick?: Function,
  onRemove?: Function,
  badgeClassName: any,
}

const Badge = ({
  label,
  id,
  children,
  onClick,
  onRemove,
  badgeClassName,
}: Args) => {
  return (
    <div
      className={css(styles.badge, onClick && styles.badgeWithOnClick, badgeClassName)}
      onClick={(event) => onClick && onClick(event)}
      data-test={isDevEnv() ? `badge-${id}` : undefined}
    >
      {children}
      {!children && label && (
        <div className={css(styles.badgeLabel)}>{label}</div>
      )}
      {onRemove && (
        <div className={css(styles.badgeRemove)} onClick={(event) => onRemove && onRemove(event)}>
          <CloseIcon
            width={8}
            height={8}
            overrideStyle={null}
            onClick={undefined}
          />
        </div>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  badge: {
    display: "flex",
    margin: "0px 10px 0px 0",
    minWidth: "0",
    boxSizing: "border-box",
    backgroundColor: colors.NEW_BLUE(0.1),
    borderRadius: "4px",
    color: colors.NEW_BLUE(1.0),
    padding: "5px 8px",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      margin: "0px 6px 6px 0",
    },
  },
  badgeWithOnClick: {
    ":hover": {
      background: badgeColors.HOVER,
      color: badgeColors.HOVER_COLOR,
      boxShadow: "unset",
    },
  },  
  badgeLabel: {
    borderRadius: "2px",
    overflow: "hidden",
    padding: "3px 3px 3px 6px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 1,
  },
  badgeRemove: {
    display: "flex",
    paddingLeft: "4px",
    paddingRight: "4px",
    boxSizing: "border-box",
    alignItems: "center",
    borderRadius: "2px",
  },
  closeIconOverride: {
    padding: 6,
  },
});


export default Badge;
