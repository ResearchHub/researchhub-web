import Link from "next/link";
import IconButton from "~/components/Icons/IconButton";
import { StyleSheet, css } from "aphrodite";
import showToast from "./showToast";

interface Props {
  body: any,
  label: string,
  href: string,
}

const showGenericToast = ({ body, label, href }: Props) => {

  showToast({
    content: (
      <div className={css(toastStyles.root)}>
        <div className={css(toastStyles.body)}>
          {body}
        </div>
        <div className={css(toastStyles.actionWrapper)}>
          <Link href={href}>
            <IconButton
              variant="round"
              overrideStyle={toastStyles.primaryCTA}
            >
              <span className={css(toastStyles.viewLabel)}>{label}</span>
            </IconButton>
          </Link>
        </div>
      </div>
    ),
    options: {
      toastId: "profile-ready-toast",
      style: {
        background: "green",
      },
      closeButton: false,
      autoClose: false,
    },
  });
};

const toastStyles = StyleSheet.create({
  actionWrapper: {
    marginRight: 10,
  },
  root: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    color: "white",
    fontSize: 14,
  },
  message: {
    marginRight: 10,
    whiteSpace: "nowrap",
  },
  body: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  primaryCTA: {
    border: "none",
    whiteSpace: "nowrap",
    ":hover": {
      background: `rgba(255, 255, 255, 0.15)`,
    },
  },
  viewLabel: {
    fontWeight: 600,
    color: "rgb(110 141 255)",
  },
});

export default showGenericToast;
