import { css, StyleSheet } from "aphrodite";
import { Fragment, ReactElement, useCallback, useState } from "react";
import ResearchHubPopover from "./ResearchHubPopover";
import icons from "../config/themes/icons";
import AuthorClaimModal from "./AuthorClaimModal/AuthorClaimModal";
import colors from "../config/themes/colors";
import PermissionNotificationWrapper from "./PermissionNotificationWrapper";

type Props = {
  auth: any;
  author: any;
  user: any;
};

export default function ClaimAuthorPopoverLabel({
  auth,
  author,
  user,
}: Props): ReactElement<typeof Fragment> {
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState<boolean>(false);
  const { first_name: authorFirstName, last_name: authorLastName } = author;

  const handleClaimButtonClick = useCallback((): void => {
    setIsClaimModalOpen(!isClaimModalOpen);
    setIsPopoverOpen(false);
  }, [setIsPopoverOpen]);

  return (
    <Fragment>
      <AuthorClaimModal
        auth={auth}
        authors={[author]}
        isOpen={isClaimModalOpen}
        setIsOpen={setIsClaimModalOpen}
      />
      <div className={css(styles.claimAuthorPopoverLabel)}>
        <ResearchHubPopover
          isOpen={isPopoverOpen}
          popoverContent={
            <div className={css(styles.popoverBodyContent)}>
              <div className={css(styles.bodyTextWrap)}>
                <div className={css(styles.bodyHeader)}>
                  {`Are you ${authorFirstName} ${authorLastName}? `}
                  <img
                    className={css(styles.headerCoinIcon)}
                    src={"/static/icons/coin-filled.png"}
                    alt="RSC Coin"
                  />
                </div>
                <div className={css(styles.bodySubheader)}>
                  {`Claim your profile to receive ${author.total_score} RSC.`}
                </div>
              </div>
              {/* @ts-ignore */}
              <PermissionNotificationWrapper
                onClick={handleClaimButtonClick}
                modalMessage="claim this author profile"
                loginRequired={true}
              >
                <button
                  className={css(styles.claimProfileButton)}
                  role="button"
                >
                  {"Claim Profile"}
                </button>
              </PermissionNotificationWrapper>
            </div>
          }
          setIsPopoverOpen={setIsPopoverOpen}
          targetContent={
            <div
              className={css(styles.popoverTarget)}
              onMouseEnter={() => {
                setIsPopoverOpen(!isPopoverOpen);
              }}
              onClick={() => {
                setIsPopoverOpen(!isPopoverOpen);
              }}
            >
              <span className={css(styles.popoverLabelText)}>
                {`Are you ${author.first_name}? Claim your profile`}
              </span>
              <span className={css(styles.popoverIcon)}>
                {icons.exclamationCircle}
              </span>
            </div>
          }
        />
      </div>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  bodyHeader: {
    alignItems: "center",
    display: "flex",
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 8,
  },
  bodySubheader: {
    color: "#272727",
    fontSize: 14,
    marginBottom: 16,
  },
  bodyTextWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: 286,
  },
  claimAuthorPopoverLabel: {
    alignItems: "center",
    display: "flex",
    marginBottom: 16,
    color: colors.NEW_BLUE(1),
    // borderBottom: '',
  },
  popoverTarget: {
    cursor: "pointer",
  },
  claimProfileButton: {
    alignItems: "center",
    border: "none",
    backgroundColor: "#3971FF",
    borderRadius: 4,
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    fontSize: 16,
    fontWeight: 400,
    minHeight: 30,
    justifyContent: "center",
    width: 286,
    ":hover": {
      backgroundColor: colors.NAVY(1),
    },
  },
  headerCoinIcon: {
    height: 18,
    marginLeft: 8,
    marginRight: 8,
    "@media only screen and (max-width: 760px)": {
      height: 18,
    },
    "@media only screen and (max-width: 415px)": {
      height: 16,
    },
  },
  popoverBodyContent: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 4,
    boxShadow: "0px 0px 10px 0px #00000026",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 16,
    width: 320,
  },
  popoverIcon: { cursor: "pointer" },
  popoverLabelText: {
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: 500,
    letterSpacing: 0,
    marginRight: 8,
  },
});
