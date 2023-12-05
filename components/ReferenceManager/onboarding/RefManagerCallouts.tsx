import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography } from "@mui/material";
import { StyleSheet, css } from "aphrodite";
import Image from "next/image";
import { ReactElement, ReactNode } from "react";
import ALink from "~/components/ALink";
import Button from "~/components/Form/Button";
import colors from "~/config/themes/colors";

type Props = {
  handleClose: () => void;
};

export default function RefManagerCallouts({
  handleClose,
}: Props): ReactElement {
  return (
    <Box
      key={"org-references"}
      className={css(styles.container)}
      sx={{
        alignItems: "center",
        background: "#3971FF",
        boxSizing: "border-box",
        // display: "flex",
        justifyContent: "space-between",
        padding: "20px",
        // width: "100%",
        color: "#fff",
        position: "fixed",
        bottom: 16,
        right: 16,
        maxWidth: 300,
        zIndex: 10,
      }}
    >
      <FontAwesomeIcon
        icon={faTimes}
        className={css(styles.icon)}
        onClick={handleClose}
      />
      <Image
        src={"/static/icons/word-plugin.png"}
        alt="Microsoft"
        height={32}
        width={32}
      />
      <h3 style={{ marginTop: 16, marginBottom: 8, fontSize: 20 }}>
        Microsoft Word Plugin
      </h3>
      <div style={{ fontSize: 14, lineHeight: "19px" }}>
        Seamlessly insert references and bibliographies into your document using
        our citation add-in for Microsoft® Word.
      </div>
      <div>
        <a
          target="_blank"
          rel="noopener"
          className={css(styles.link)}
          onClick={handleClose}
          href="https://appsource.microsoft.com/en-US/product/office/WA200005973?tab=Overview"
        >
          <div className={css(styles.button)}>Download Plugin</div>
        </a>
      </div>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  button: {
    backgroundColor: "#fff",
    color: "#3971FF",
    padding: "10px 18px",
    width: "fit-content",
    borderRadius: 4,
    marginTop: 16,
    fontWeight: 500,
  },
  link: {
    textDecoration: "none",
  },
  icon: {
    top: 0,
    right: 0,
    padding: 16,
    position: "absolute",
    cursor: "pointer",
  },
});
