import { css, StyleSheet } from "aphrodite";
import { getCurrentUser } from "~/config/utils/getCurrentUser";
import { ModalActions } from "~/redux/modals";
import { ReactElement, SyntheticEvent } from "react";
import { useDispatch } from "react-redux";
import ALink from "../ALink";
import colors from "~/config/themes/colors";

type Props = { closeDropdown: () => void };

export default function RscBalanceHistoryDropContent({
  closeDropdown,
}: Props): ReactElement {
  const dispatch = useDispatch();
  const currentUser = getCurrentUser();

  return (
    <div className={css(styles.rscBalanceHistoryDropContent)}>
      <div className={css(styles.historyHeader)}>
        <div
          className={css(styles.withdrawButton)}
          onClick={(event: SyntheticEvent): void => {
            event.preventDefault();
            closeDropdown();
            dispatch(ModalActions.openWithdrawalModal(true));
          }}
        >
          {"Withdraw RSC"}
        </div>
        <ALink href={`/user/${currentUser?.id}/rsc`}>{"View all"}</ALink>
      </div>
      <div className={css(styles.historyContent)}></div>
    </div>
  );
}

const styles = StyleSheet.create({
  rscBalanceHistoryDropContent: {
    background: "#fff",
    border: `2px solid ${colors.LIGHT_GREY_BORDER}`,
    borderRadius: 4,
  },
  historyHeader: {
    alignItems: "center",
    borderBottom: `2px solid ${colors.LIGHT_GREY_BORDER}`,
    display: "flex",
    fontSize: 14,
    height: 44,
    justifyContent: "space-between",
    padding: "0 16px",
  },
  historyContent: {},
  withdrawButton: {
    alignItems: "center",
    background: colors.NEW_BLUE(),
    borderRadius: 4,
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    fontSize: 12,
    height: 20,
    justifyContent: "center",
    padding: "4px 8px",
  },
});
