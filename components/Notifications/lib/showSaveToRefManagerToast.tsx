import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import IconButton from "~/components/Icons/IconButton";
import { StyleSheet, css } from "aphrodite";
import showToast from "./showToast";
import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import { Organization } from "~/config/types/root_types";
import colors from "~/config/themes/colors";

interface Props {
  action: "ADD" | "REMOVE";
  project: any;
  org: Organization;
  actionLabel?: string;
  onActionClick?: Function;
}

const showSaveToRefManagerToast = ({
  action,
  project,
  org,
  actionLabel = "View",
  onActionClick,
}: Props) => {
  showToast({
    content: (
      <div className={css(toastStyles.root)}>
        <div className={css(toastStyles.body)}>
          {action === "ADD" && (
            <>
              <FontAwesomeIcon
                icon={faCheckCircle}
                style={{ marginRight: 10 }}
              />
              <div style={{ marginRight: 10 }}>
                Saved to <span style={{ fontWeight: 600 }}>{project.name}</span>
              </div>
            </>
          )}
          {action === "REMOVE" && (
            <>
              <div style={{ marginRight: 10 }}>
                Removed from{" "}
                <span style={{ fontWeight: 600 }}>{project.name}</span>
              </div>
            </>
          )}
        </div>
        <div className={css(toastStyles.actionWrapper)}>
          {onActionClick ? (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onActionClick(e);
              }}
              variant="round"
              overrideStyle={toastStyles.primaryCTA}
            >
              <span className={css(toastStyles.viewLabel)}>{actionLabel}</span>
            </IconButton>
          ) : (
            <Link href={`/reference-manager/${org.slug}/${project.slug}`}>
              <IconButton
                variant="round"
                overrideStyle={toastStyles.primaryCTA}
              >
                <span className={css(toastStyles.viewLabel)}>View</span>
              </IconButton>
            </Link>
          )}
        </div>
      </div>
    ),
    options: {
      style: {
        background: colors.BLACK(),
      },
      closeButton: false,
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

export default showSaveToRefManagerToast;
