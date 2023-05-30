import { ReactElement } from "react";
import Switch from "@mui/material/Switch";
import { css, StyleSheet } from "aphrodite";

type Props = {
  id: string;
  anonymous: boolean;
  onToggle: () => void;
};

const AnonymousToggle = ({ id, anonymous, onToggle }: Props): ReactElement => {
  return (
    <div className={css(styles.toggleContainer)}>
      toggle anonymity
      <Switch onChange={onToggle} checked={anonymous} />
    </div>
  );
};

export default AnonymousToggle;

const styles = StyleSheet.create({
  toggleContainer: {
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 4,
    boxSizing: "border-box",
  },
});
