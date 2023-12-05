import { StyleSheet } from "aphrodite";

export const customModalStyle = StyleSheet.create({
  closeButton: {
    height: 12,
    width: 12,
    position: "absolute",
    top: 6,
    right: 0,
    padding: 16,
    cursor: "pointer",
  },
  modalStyle: {
    // maxHeight: "400px",
    width: "625px",
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
  },
  modalContentStyle: {
    overflowY: "visible",
    overflow: "visible",
    padding: "60px 40px",
  },
});
