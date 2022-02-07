import { css, StyleSheet } from "aphrodite";
import { ReactElement, useMemo } from "react";
import colors from "~/config/themes/colors";

export type FormTypes = "add" | "delete";

type Props = {
  currentFormType: string;
  setFormType: (type: FormTypes) => void;
};

const buttonConfigs: { label: string; id: FormTypes }[] = [
  /* logical ordering */
  { label: "Add", id: "add" },
  { label: "Remove", id: "delete" },
];

export default function PermissionsDashboardNavbar({
  currentFormType,
  setFormType,
}: Props): ReactElement<"div"> {
  const navButtons = useMemo(
    () =>
      buttonConfigs.map(({ label, id }: { label: string; id: FormTypes }) => (
        <div
          className={css(
            styles.permissionsDashboardNavbarButton,
            id === currentFormType && styles.isButtonActive
          )}
          onClick={(): void => setFormType(id)}
          role="button"
        >
          <div>{label}</div>
        </div>
      )),
    [currentFormType]
  );

  return (
    <div className={css(styles.permissionsDashboardNavbar)}>
      <div className={css(styles.innerElementWrap)}>
        <div className={css(styles.navRow)}>{navButtons}</div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  permissionsDashboardNavbar: {
    alignItems: "center",
    backgroundColor: "#FFF",
    display: "flex",
    width: "100%",
    maxWidth: 800,
  },
  permissionsDashboardNavbarButton: {
    alignItems: "center",
    boxSizing: "border-box",
    color: "##241F3A",
    cursor: "pointer",
    display: "flex",
    fontSize: 18,
    height: 44,
    padding: "4px 0",
    marginRight: 24,
  },
  isButtonActive: {
    borderBottom: `2px solid ${colors.BLUE(1)}`,
    color: colors.BLUE(1),
  },
  innerElementWrap: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    maxWidth: "90%",
  },
  navRow: {
    alignItems: "center",
    display: "flex",
    height: 60,
    width: "100%",
  },
});
