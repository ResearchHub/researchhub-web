import { ReactElement, useEffect, useRef, useState } from "react";
import { StyleSheet, css } from "aphrodite";

// Components
import ResearchHubPopover from "~/components/ResearchHubPopover";

// Utils
import Link from "next/link";
import OrgAvatar from "~/components/Org/OrgAvatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import ReactPlaceholder from "react-placeholder/lib";
import { isEmpty } from "~/config/utils/nullchecks";
import OrgEntryPlaceholder from "~/components/Placeholders/OrgEntryPlaceholder";
import { DownIcon } from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import ManageOrgModal from "~/components/Org/ManageOrgModal";
import NewOrgModal from "~/components/Org/NewOrgModal";
import { breakpoints } from "~/config/themes/screen";
import { useRouter } from "next/router";
import { useOrgs } from "~/components/contexts/OrganizationContext";

type Props = {
  isReferenceManager: boolean;
};

export default function OrganizationPopover({
  isReferenceManager,
}: Props): ReactElement {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [showNewOrgModal, setShowNewOrgModal] = useState(false);
  const [showManageOrgModal, setShowManageOrgModal] = useState(false);
  const router = useRouter();

  const { organization } = router.query;

  const { orgs, setCurrentOrg, currentOrg } = useOrgs();

  useEffect(() => {
    if (organization && orgs.length) {
      const curOrg = orgs.find((org) => org.slug === organization);
      setCurrentOrg(curOrg);
    }
  }, [organization, orgs]);

  const onOrgChange = () => {};

  return (
    <>
      <ManageOrgModal
        org={currentOrg}
        isOpen={showManageOrgModal}
        closeModal={() => setShowManageOrgModal(false)}
        onOrgChange={onOrgChange}
      />
      <NewOrgModal
        isOpen={showNewOrgModal}
        closeModal={() => setShowNewOrgModal(false)}
        onOrgChange={onOrgChange}
      />
      <ResearchHubPopover
        containerStyle={{ marginLeft: "10px", marginTop: "-10px", zIndex: 11 }}
        isOpen={isPopoverOpen}
        popoverContent={
          <div className={css(styles.popoverBodyContent)}>
            <div className={css(styles.userOrgs)}>
              {orgs.map((org) => (
                <Link
                  href={{
                    pathname: isReferenceManager
                      ? `/reference-manager/${org.slug}/`
                      : `/${org.slug}/notebook/`,
                  }}
                  key={org.id.toString()}
                  className={css(styles.popoverBodyItem)}
                  onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                >
                  <div className={css(styles.avatarWrapper)}>
                    <OrgAvatar org={org} />
                  </div>
                  <div className={css(styles.popoverBodyItemText)}>
                    <div className={css(styles.popoverBodyItemTitle)}>
                      {org.name}
                    </div>
                    <div className={css(styles.popoverBodyItemSubtitle)}>
                      {!org.member_count
                        ? ""
                        : org.member_count === 1
                        ? "1 member"
                        : `${org.member_count} members`}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div
              className={css(styles.popoverBodyItem, styles.newOrgContainer)}
              onClick={() => {
                setShowNewOrgModal(true);
                setIsPopoverOpen(false);
              }}
            >
              <div className={css(styles.newOrgButton)}>
                {<FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>}
              </div>
              New Organization
            </div>
          </div>
        }
        positions={["bottom"]}
        onClickOutside={() => setIsPopoverOpen(false)}
        targetContent={
          <div
            className={css(styles.popoverTarget)}
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          >
            <ReactPlaceholder
              ready={!isEmpty(currentOrg)}
              showLoadingAnimation
              customPlaceholder={<OrgEntryPlaceholder color="#d3d3d3" />}
            >
              <div className={css(styles.avatarWrapper)}>
                <OrgAvatar org={currentOrg} />
              </div>
              {currentOrg?.name}
            </ReactPlaceholder>
            <DownIcon withAnimation={false} />
          </div>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  sidebarOrgContainer: {
    borderBottom: `1px solid ${colors.GREY(0.3)}`,
  },
  avatarWrapper: {
    marginRight: 10,
  },
  userOrgs: {
    maxHeight: 300,
    overflowY: "auto",
  },
  newOrgContainer: {
    color: colors.PURPLE(),
    fontWeight: 500,
    ":last-child": {
      borderRadius: "0px 0px 4px 4px",
    },
  },
  newOrgButton: {
    alignItems: "center",
    background: colors.LIGHT_GREY(),
    border: "1px solid #ddd",
    borderRadius: "50%",
    boxSizing: "border-box",
    cursor: "pointer",
    display: "flex",
    fontSize: 16,
    height: 30,
    justifyContent: "center",
    marginRight: 10,
    transition: "all ease-in-out 0.1s",
    width: 30,
  },
  sidebar: {
    background: colors.GREY_ICY_BLUE_HUE,
    borderRight: `1px solid ${colors.GREY(0.3)}`,
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 68px)",
    left: 0,
    maxWidth: 300,
    minWidth: 240,
    // position: "fixed",
    top: 68,
    width: "16%",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      display: "none",
    },
  },
  popoverTarget: {
    alignItems: "center",
    width: "100%",
    color: colors.BLACK(0.6),
    cursor: "pointer",
    display: "flex",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 1.1,
    padding: 16,
    textTransform: "uppercase",
    userSelect: "none",
    wordBreak: "break-word",
    ":hover": {
      backgroundColor: colors.GREY(0.3),
    },
  },
  popoverBodyContent: {
    backgroundColor: colors.WHITE(),
    borderRadius: 4,
    boxShadow: `0px 0px 10px 0px ${colors.PURE_BLACK(0.15)}`,
    display: "flex",
    flexDirection: "column",
    userSelect: "none",
    width: 270,
  },
  popoverBodyItem: {
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    padding: 15,
    textDecoration: "none",
    wordBreak: "break-word",
    ":hover": {
      backgroundColor: colors.GREY(0.2),
    },
    ":first-child": {
      borderRadius: "4px 4px 0px 0px",
    },
  },
  popoverBodyItemText: {
    display: "flex",
    flexDirection: "column",
  },
  popoverBodyItemTitle: {
    color: colors.BLACK(),
    fontWeight: 500,
  },
  popoverBodyItemSubtitle: {
    color: colors.BLACK(0.5),
    fontSize: 13,
    marginTop: 2,
  },
  scrollable: {
    overflow: "auto",
  },
  sidebarButtonsContainer: {
    margin: "0px 10px 10px 10px",
  },
  sidebarButton: {
    border: "none",
    color: colors.BLACK(0.6),
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    maxWidth: "fit-content",
    padding: 10,
    ":hover": {
      color: colors.BLUE(),
    },
  },
  sidebarButtonText: {
    marginLeft: 10,
  },
});
