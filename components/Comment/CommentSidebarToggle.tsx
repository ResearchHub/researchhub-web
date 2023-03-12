import { css, StyleSheet } from "aphrodite";

type Args = {
  setIsOpen: Function;
  isOpen: boolean;
};

const CommentSidebarToggle = ({ isOpen, setIsOpen }: Args) => {
  return (
    <div className={css(styles.toggle)} onClick={() => setIsOpen(!isOpen)}>
      Toggle
    </div>
  );
};

const styles = StyleSheet.create({
  toggle: {
    position: "fixed",
    left: "50%",
    bottom: 50,
    transform: "translate(-50%, -50%)",
    zIndex: 2,
    borderRadius: 100,
    height: 25,
    width: 50,
    background: "white",
    border: "1px solid",
    padding: "5px 10px",
    cursor: "pointer",
    ":hover": {
      background: "gray",
    },
  },
});

export default CommentSidebarToggle;
