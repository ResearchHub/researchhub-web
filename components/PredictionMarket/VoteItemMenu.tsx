import { faEllipsisH } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/pro-light-svg-icons";
import { css, StyleSheet } from "aphrodite";
import { ReactElement, useContext, useRef, useState } from "react";
import { useEffectHandleClick } from "~/config/utils/clickEvent";
import IconButton from "../Icons/IconButton";
import { isEmpty } from "~/config/utils/nullchecks";
import { useSelector } from "react-redux";
import { RootState } from "~/redux";
import { parseUser } from "~/config/types/root_types";
import { PredictionMarketVote } from "./lib/types";
import { deleteVote } from "./api/votes";
import colors from "~/config/themes/colors";
import { VoteTreeContext } from "./lib/contexts";

type Args = {
  vote: PredictionMarketVote;
};

const VoteItemMenu = ({ vote }: Args): ReactElement | null => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef(null);
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );
  const voteTreeState = useContext(VoteTreeContext);

  useEffectHandleClick({
    ref: dropdownRef,
    exclude: [".comment-menu-trigger"],
    onOutsideClick: () => setIsOpen(false),
    onInsideClick: () => setIsOpen(false),
  });

  const _handleDelete = async () => {
    if (confirm("Delete vote?")) {
      await deleteVote({
        voteId: vote.id,
      });
      voteTreeState.onRemove(vote);
    }
  };

  if (!currentUser) return null;
  if (currentUser.id !== vote.createdBy.id) return null;

  return (
    <div className={css(styles.wrapper)}>
      <div className={`${css(styles.trigger)} comment-menu-trigger`}>
        <IconButton
          overrideStyle={styles.labelWrapper}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          <FontAwesomeIcon icon={faEllipsisH} style={{ fontSize: 16 }} />
        </IconButton>
      </div>
      <div
        ref={dropdownRef}
        className={css(styles.dropdown, isOpen && styles.dropdownOpen)}
      >
        <div
          className={css(styles.option)}
          onClick={(e) => {
            e.stopPropagation();
            _handleDelete();
            setIsOpen(false);
          }}
        >
          <FontAwesomeIcon
            icon={faTrashAlt}
            style={{ color: colors.BLACK(0.6), fontSize: 18 }}
          />

          <div className={css(styles.dropdownLabel)}>Remove</div>
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    userSelect: "none",
  },
  labelWrapper: {
    marginTop: 5,
    display: "flex",
    columnGap: "4px",
    color: colors.BLACK(1.0),
    alignItems: "center",
    fontWeight: 400,
    fontSize: 16,
  },
  trigger: {},
  dropdown: {
    display: "none",
    position: "absolute",
    top: 30,
    zIndex: 2,
    right: 0,
    height: "auto",
    width: 100,
    background: "white",
    padding: 0,
    borderRadius: 4,
    marginTop: 5,
    marginLeft: 5,
    boxShadow:
      "rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px",
  },
  dropdownOpen: {
    display: "block",
  },
  option: {
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    columnGap: "7px",
    padding: "7px 12px",
    position: "relative",
    boxSizing: "border-box",
    fontSize: 14,
    width: "100%",
    ":hover": {
      background: colors.LIGHTER_GREY(1.0),
      transition: "0.2s",
    },
  },
  dropdownIcon: {
    fontSize: 12,
  },
  dropdownLabel: {},
});

export default VoteItemMenu;
