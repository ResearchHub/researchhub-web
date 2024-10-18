import { NextPage } from "next";
import { css, StyleSheet } from "aphrodite";
import { fetchBounties } from "~/components/Bounty/api/fetchBountiesAPI";
import { useEffect, useState } from "react";
import {
  BOUNTY_TYPE_MAP,
} from "~/config/types/bounty";
import VerifiedBadge from "~/components/Verification/VerifiedBadge";
import { CloseIcon } from "~/config/themes/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "~/components/Form/Button";
import colors from "~/config/themes/colors";
import ResearchCoinIcon from "~/components/Icons/ResearchCoinIcon";
import {
  faAngleDown,
  faFilter,
} from "@fortawesome/pro-solid-svg-icons";
import LiveFeedCardPlaceholder from "~/components/Placeholders/LiveFeedCardPlaceholder";
import { Hub } from "~/config/types/hub";
import LoadMore from "~/components/shared/LoadMore";
import VerifyIdentityModal from "~/components/Verification/VerifyIdentityModal";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import useCurrentUser from "~/config/hooks/useCurrentUser";
import { breakpoints } from "~/config/themes/screen";
import { useSelector } from "react-redux";
import { useDismissableFeature } from "~/config/hooks/useDismissableFeature";
import HubSelectDropdown, {
  selectDropdownStyles,
} from "~/components/Hubs/HubSelectDropdown";
import GenericMenu, { MenuOption } from "~/components/shared/GenericMenu";
import IconButton from "~/components/Icons/IconButton";
import { Checkbox } from "@mui/material";
import Badge from "~/components/Badge";
import { parseSimpleBounty, SimpleBounty } from "~/components/Bounty/lib/types";
import BountyCard from "~/components/Bounty/BountyCard";
import BountyInfoSection from "~/components/Bounty/BountyInfoSection";
import SearchEmpty from "~/components/Search/SearchEmpty";

const BountiesPage: NextPage = () => {
  const [currentBounties, setCurrentBounties] = useState<SimpleBounty[]>([]);
  const [nextPageCursor, setNextPageCursor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const currentUser = useCurrentUser();
  const auth = useSelector((state: any) => state.auth);
  const {
    isDismissed: isVerificationBannerDismissed,
    dismissFeature: dismissVerificationBanner,
    dismissStatus: verificationBannerDismissStatus,
  } = useDismissableFeature({
    auth,
    featureName: "verification-banner-in-bounties-page",
  });

  const [selectedBountyTypes, setSelectedBountyTypes] = useState<Array<string>>(
    []
  );
  const [selectedHubs, setSelectedHubs] = useState<Hub[]>([]);

  const _fetchAndParseBounties = async ({ pageCursor = null }) => {
    const bounties: any = await fetchBounties({
      personalized: true,
      pageCursor,
      hubIds: selectedHubs.map((hub) => hub.id),
      bountyTypes: selectedBountyTypes,
    });

    setNextPageCursor(bounties.next);
    const parsedBounties = (bounties?.results || [])
      .map((bounty) => {
        try {
          return parseSimpleBounty(bounty);
        } catch (e) {
          console.error("error parsing bounty", bounty, e);
        }
      })
      .filter((bounty) => bounty !== undefined);

    return parsedBounties;
  };

  useEffect(() => {
    (async () => {
      const parsedBounties = await _fetchAndParseBounties({ pageCursor: nextPageCursor });
      setCurrentBounties([...currentBounties, ...parsedBounties]);
      setIsLoading(false);
      setIsLoadingInitial(false);
    })();
  }, [currentPage]);

  useEffect(() => {
    setNextPageCursor(null);
    (async () => {
      const parsedBounties = await _fetchAndParseBounties({ pageCursor: null });
      setCurrentBounties(parsedBounties);
      setIsLoading(false);
    })();
  }, [selectedHubs, selectedBountyTypes]);

  const options: Array<MenuOption> = [
    {
      group: "Grant type",
      value: BOUNTY_TYPE_MAP["RESEARCHHUB"].value,
      html: (
        <div style={{ display: "flex" }}>
          <Checkbox
            checked={selectedBountyTypes.includes(
              BOUNTY_TYPE_MAP["RESEARCHHUB"].value
            )}
            sx={{ padding: "0px 10px 0px 0px" }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {BOUNTY_TYPE_MAP["RESEARCHHUB"].label} <VerifiedBadge height={20} width={20} />
          </div>
        </div>
      ),
    },
    {
      group: "Grant type",
      value: BOUNTY_TYPE_MAP["REVIEW"].value,
      html: (
        <div>
          <Checkbox
            checked={selectedBountyTypes.includes(BOUNTY_TYPE_MAP["REVIEW"].value)}
            sx={{ padding: "0px 10px 0px 0px" }}
          />
          {BOUNTY_TYPE_MAP["REVIEW"].label}
        </div>
      ),
    },
    {
      group: "Grant type",
      value: BOUNTY_TYPE_MAP["ANSWER"].value,
      html: (
        <div>
          <Checkbox
            checked={selectedBountyTypes.includes(BOUNTY_TYPE_MAP["ANSWER"].value)}
            sx={{ padding: "0px 10px 0px 0px" }}
          />
          {BOUNTY_TYPE_MAP["ANSWER"].label}
        </div>
      ),
    },
    {
      group: "Grant type",
      value: BOUNTY_TYPE_MAP["GENERIC_COMMENT"].value,
      html: (
        <div>
          <Checkbox
            checked={selectedBountyTypes.includes(BOUNTY_TYPE_MAP["GENERIC_COMMENT"].value)}
            sx={{ padding: "0px 10px 0px 0px" }}
          />
          {BOUNTY_TYPE_MAP["GENERIC_COMMENT"].label}
        </div>
      ),
    },
  ];

  const showVerifyBanner =
    currentUser &&
    !currentUser?.isVerified &&
    verificationBannerDismissStatus === "checked" &&
    !isVerificationBannerDismissed;
  return (
    <div className={css(styles.pageWrapper)}>
      <div className={css(styles.bountiesSection)}>
        <h1 className={css(styles.title)}>
          Grants
        </h1>
        <div className={css(styles.description)}>
          Earn ResearchCoin by completing research related grants.
        </div>

        <div className={css(styles.filters)}>
          <div className={css(styles.filterWrapper)} style={{ marginTop: -20 }}>
            <HubSelectDropdown
              label={null}
              selectedHubs={selectedHubs}
              showSelectedHubs={false}
              showCountInsteadOfLabels={true}
              dropdownStyles={{
                ...selectDropdownStyles,
                menu: {
                  width: "100%",
                },
              }}
              placeholder={
                <div className={css(styles.placeholder)}>
                  <FontAwesomeIcon icon={faFilter}></FontAwesomeIcon>
                  Keywords
                  <FontAwesomeIcon icon={faAngleDown} />
                </div>
              }
              onChange={(hubs) => {
                setSelectedHubs(hubs);
              }}
            />
          </div>

          <div className={css(styles.filterWrapper)}>
            <GenericMenu
              softHide={true}
              options={options}
              width={"95%"}
              id="bounty-type-menu"
              direction="bottom-left"
              isMultiSelect
              menuStyleOverride={styles.menuStyleOverride}
              onSelect={(option: MenuOption) => {
                if (selectedBountyTypes.includes(option.value)) {
                  setSelectedBountyTypes(
                    selectedBountyTypes.filter((type) => type !== option.value)
                  );
                } else {
                  setSelectedBountyTypes([
                    ...selectedBountyTypes,
                    option.value,
                  ]);
                }
              }}
            >
              <IconButton overrideStyle={styles.bountyDropdownTrigger}>
                <ResearchCoinIcon
                  version={4}
                  height={20}
                  width={20}
                  color={colors.MEDIUM_GREY(1.0)}
                />
                Grant Type
                {selectedBountyTypes.length > 0 && (
                  <div className={css(styles.badge)}>
                    {selectedBountyTypes.length}
                  </div>
                )}
                <FontAwesomeIcon icon={faAngleDown} />
              </IconButton>
            </GenericMenu>
          </div>
        </div>

        <div className={css(styles.appliedFilters)}>

          {selectedBountyTypes.map((bountyType) => (
            <Badge
              key={BOUNTY_TYPE_MAP[bountyType].value}
              id={`type-${BOUNTY_TYPE_MAP[bountyType].value}}`}
              label={`Type: ${BOUNTY_TYPE_MAP[bountyType].label}`}
              badgeClassName={styles.appliedFilterBadge}
              badgeLabelClassName={styles.appliedFilterBadgeLabel}
              onClick={() =>
                setSelectedBountyTypes(selectedBountyTypes.filter((b) => bountyType !== b))
              }
              onRemove={() =>
                setSelectedBountyTypes(selectedBountyTypes.filter((b) => bountyType !== b))
              }
            />
          ))}

          {selectedHubs.map((hub) => (
            <Badge
              key={hub.id}
              id={`hub-${hub.id}`}
              label={`Keyword: ${hub.name}`}
              badgeClassName={styles.appliedFilterBadge}
              badgeLabelClassName={styles.appliedFilterBadgeLabel}
              onClick={() =>
                setSelectedHubs(selectedHubs.filter((h) => h.id !== hub.id))
              }
              onRemove={() =>
                setSelectedHubs(selectedHubs.filter((h) => h.id !== hub.id))
              }
            />
          ))}
        </div>

        {showVerifyBanner && (
          <div className={css(styles.verifyIdentityBanner)}>
            <VerifiedBadge height={32} width={32} />
            Verify identity to see grant recommendations relevant to your
            research interests.
            <div className={css(styles.verifyActions)}>
              {/* @ts-ignore */}
              <VerifyIdentityModal
                // @ts-ignore legacy
                wsUrl={WS_ROUTES.NOTIFICATIONS(currentUser?.id)}
                // @ts-ignore legacy
                wsAuth
              >
                <Button isWhite>Verify</Button>
              </VerifyIdentityModal>

              <CloseIcon
                // @ts-ignore
                overrideStyle={styles.closeBtn}
                onClick={() => dismissVerificationBanner()}
                color="white"
                height={20}
                width={20}
              />
            </div>
          </div>
        )}


        {(currentBounties.length === 0 && !isLoadingInitial) && (
          <div style={{ minHeight: 250, display: "flex", justifyContent: "center", width: "100%", marginTop: 50 }}>
            <SearchEmpty title={"No bounties found."} />
          </div>
        )}

        <div className={css(styles.bounties)}>
          {currentBounties.map((bounty) => (
            <div
              className={css(styles.bountyWrapper)}
              key={"bounty-" + bounty.id}
            >
              <BountyCard
                handleHubClick={(hub: Hub) => {
                  setSelectedHubs([hub]);
                }}
                key={bounty.id}
                bounty={bounty}
              />
            </div>
          ))}

          {nextPageCursor && (
            <LoadMore
              onClick={async () => {
                setCurrentPage(currentPage + 1);
                setIsLoading(true);
              }}
              isLoading={isLoading}
            />
          )}
        </div>


        {isLoading && (
          <div className={css(styles.placeholderWrapper)}>
            {Array(10)
              .fill(null)
              .map(() => (
                <LiveFeedCardPlaceholder color="#efefef" />
              ))}
          </div>
        )}
      </div>
      <BountyInfoSection />
    </div>
  );
};

const styles = StyleSheet.create({
  pageWrapper: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: 35,
    paddingRight: 28,
    paddingLeft: 28,
    gap: 20,
  },
  badge: {
    background: colors.NEW_BLUE(0.1),
    borderRadius: "5px",
    padding: "2px 10px",
    color: colors.NEW_BLUE(1.0),
    fontSize: 12,
  },
  appliedFilterBadge: {
    borderRadius: 4,
    color: colors.BLACK(0.6),
    background: colors.LIGHTER_GREY(1.0),
    padding: "2px 8px",
    letterSpacing: 0,
    ":hover": {
      color: colors.NEW_BLUE(),
      background: colors.LIGHTER_GREY(1.0),
      cursor: "pointer",
    },
  },
  appliedFilterBadgeLabel: {
    letterSpacing: 0,
    display: "flex",
    alignItems: "center",
    padding: 0,
  },  
  placeholderWrapper: {
    marginTop: 20,
  },
  bountiesSection: {
    width: 800,
    margin: "0 auto",
  },
  filters: {
    display: "flex",
    gap: 25,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      flexDirection: "column",
      gap: 0
    }
  },
  filterWrapper: {
    width: "100%",
  },
  appliedFilters: {
    display: "flex",
    flexWrap: "wrap",
    rowGap: 10,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginTop: 25
    },
  },
  bountyDropdownTrigger: {
    borderColor: "hsl(0,0%,80%)",
    backgroundColor: "#FBFBFD",
    borderRadius: 2,
    color: "#8e8d9a",
    border: `1px solid #E8E8F2`,
    minHeight: 50,
    padding: "8px 15px",
    gap: 8,
    display: "flex",
    boxSizing: "border-box",
    width: "100%",

    justifyContent: "flex-start",
  },
  menuStyleOverride: {
    top: 58,
  },
  bounties: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  verifyIdentityBanner: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    color: "white",
    position: "relative",
    background: "#6165D7",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      flexDirection: "column",
      textAlign: "center",
    },
  },
  verifyActions: {
    marginLeft: "auto",
    display: "flex",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      justifyContent: "center",
      marginLeft: 0,
    },
  },
  closeBtn: {
    ":hover": {
      background: "rgba(255, 255, 255, 0.3)",
      cursor: "pointer",
    },

    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      position: "absolute",
      right: 10,
      top: 10,
    },
  },
  title: {
    fontWeight: 500,
    textOverflow: "ellipsis",
    marginBottom: 15,
    textTransform: "capitalize",
  },
  description: {
    fontSize: 15,
    marginBottom: 20,
    maxWidth: 790,
    lineHeight: "22px",
  },
  bountyWrapper: {
    ":first-child": {
      marginTop: 25,
    },
  },

  placeholder: {
    gap: 10,
    display: "flex",
    alignItems: "center",
    color: "rgb(142, 141, 154)",
  },
});

export default BountiesPage;
