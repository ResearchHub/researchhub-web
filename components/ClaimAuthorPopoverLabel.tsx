import { css, StyleSheet } from "aphrodite";
import React, { Fragment, ReactElement, useCallback, useState } from "react";
import ResearchHubPopover from "./ResearchHubPopover";
import icons from "../config/themes/icons";
import AuthorClaimModal from "./AuthorClaimModal/AuthorClaimModal";
import colors from "../config/themes/colors";

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
        author={author}
        firstPrompt="enterEmail"
        isOpen={isClaimModalOpen}
        setIsOpen={setIsClaimModalOpen}
        user={user}
      />
      <div className={css(styles.claimAuthorPopoverLabel)}>
        <span className={css(styles.popoverLabelText)}>
          {"Unclaimed profile"}
        </span>
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
                  {"Claim your profile and receive up to 1000 RSC"}
                </div>
              </div>
              <div
                className={css(styles.claimProfileButton)}
                role="button"
                onClick={handleClaimButtonClick}
              >
                {"Claim Profile"}
              </div>
            </div>
          }
          setIsPopoverOpen={setIsPopoverOpen}
          targetContent={
            <span
              className={css(styles.popoverIcon)}
              onClick={() => {
                setIsPopoverOpen(!isPopoverOpen);
              }}
            >
              {icons.exclamationCircle}
            </span>
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
    fontFamily: "Montserrat",
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 8,
  },
  bodySubheader: {
    color: "#272727",
    fontFamily: "Poppins",
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
    width: 175,
  },
  claimProfileButton: {
    alignItems: "center",
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
    height: 90,
    justifyContent: "space-between",
    padding: 16,
    width: 320,
  },
  popoverIcon: { cursor: "pointer" },
  popoverLabelText: {
    fontFamily: "Roboto",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: 500,
    letterSpacing: 0,
    marginRight: 4,
  },
});
