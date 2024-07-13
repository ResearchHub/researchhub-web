import Link from "next/link";
import IconButton from "~/components/Icons/IconButton";
import { StyleSheet, css } from "aphrodite";
import showToast from "./showToast";
import colors from "~/config/themes/colors";

interface Props {
  body: any;
  href?: string;
  label?: string;
  closeLabel?: string;
  withCloseBtn?: boolean;
}

const showGenericToast = ({
  body,
  label,
  href,
  withCloseBtn,
  closeLabel = "Close",
}: Props) => {
  showToast({
    content: (
      <div className={css(toastStyles.root)}>
        <div className={css(toastStyles.body)}>{body}</div>
        <div className={css(toastStyles.actionWrapper)}>
          {withCloseBtn && (
            <IconButton variant="round" overrideStyle={toastStyles.primaryCTA}>
              <span className={css(toastStyles.viewLabel)}>{closeLabel}</span>
            </IconButton>
          )}
          {label && href && (
            <Link href={href}>
              <IconButton
                variant="round"
                overrideStyle={toastStyles.primaryCTA}
              >
                <span className={css(toastStyles.viewLabel)}>{label}</span>
              </IconButton>
            </Link>
          )}
        </div>
      </div>
    ),
    options: {
      toastId: "profile-ready-toast",
      style: {
        background: "white",
      },
      closeButton: false,
    },
  });
};

const toastStyles = StyleSheet.create({
  actionWrapper: {
    marginRight: 10,
    display: "flex",
    alignItems: "center",
  },
  root: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    fontSize: 14,
    color: colors.BLACK(),
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
      background: `rgba(240, 240, 240, 0.65)`,
    },
  },
  closeButton: {
    border: "none",
    marginRight: 10,
  },
  viewLabel: {
    fontWeight: 500,
    color: colors.NEW_BLUE(),
  },
});

export default showGenericToast;
