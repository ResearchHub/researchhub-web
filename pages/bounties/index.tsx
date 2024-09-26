import { NextPage } from "next";
import { css, StyleSheet } from "aphrodite";
import { fetchBounties } from "~/components/Bounty/api/fetchBountiesAPI"; // Ensure correct import path
import { useEffect, useState } from "react";
import { parseUnifiedDocument, parseUser } from "~/config/types/root_types";
import { CloseIcon } from "~/config/themes/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faAngleDown,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/pro-light-svg-icons";
import colors from "~/config/themes/colors";
import LiveFeedCardPlaceholder from "~/components/Placeholders/LiveFeedCardPlaceholder";
import { parseHub, Hub } from "~/config/types/hub";
import LoadMore from "~/components/shared/LoadMore";
import VerifiedBadge from "~/components/Verification/VerifiedBadge";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import useCurrentUser from "~/config/hooks/useCurrentUser";
import { breakpoints } from "~/config/themes/screen";
import { useSelector } from "react-redux";
import { useDismissableFeature } from "~/config/hooks/useDismissableFeature";
import VerifyIdentityModal from "~/components/Verification/VerifyIdentityModal";
import BountyFeedCard from "~/components/Bounty/BountyFeedCard";
import ResearchCoinIcon from "~/components/Icons/ResearchCoinIcon";
import Button from "~/components/Form/Button";

type SimpleBounty = {
  id: string;
  amount: number;
  content: any;
  createdBy: any;
  expirationDate: string;
  createdDate: string;
  unifiedDocument: {
    document: {
      title: string;
      // Add other necessary fields if required
    };
    authors: Array<{ firstName: string; lastName: string }>;
    // Add other necessary fields if required
  };
  hubs: Hub[];
  bountyType: "REVIEW" | "GENERIC_COMMENT" | "ANSWER";
};

const parseSimpleBounty = (raw: any): SimpleBounty => {
  return {
    id: raw.id,
    amount: Number(raw.total_amount), // Ensure amount is a number
    content: raw.item.comment_content_json,
    bountyType:
      raw.bounty_type === "GENERIC_COMMMENT"
        ? "GENERIC_COMMENT"
        : raw.bounty_type, // Fix typo
    createdDate: raw.created_date,
    createdBy: parseUser(raw.created_by),
    expirationDate: raw.expiration_date,
    unifiedDocument: parseUnifiedDocument(raw.unified_document),
    hubs: (raw.unified_document?.hubs || [])
      .map(parseHub)
      .filter((hub: Hub) => hub.isUsedForRep === true),
  };
};

const BountiesPage: NextPage = () => {
  const [currentBounties, setCurrentBounties] = useState<SimpleBounty[]>([]);
  const [openInfoSections, setOpenInfoSections] = useState<string[]>([]);
  const [nextPageCursor, setNextPageCursor] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false);
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

  useEffect(() => {
    fetchBountiesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchBountiesData = async () => {
    try {
      setIsLoading(true);
      const response: any = await fetchBounties({
        personalized: true,
        pageCursor: nextPageCursor,
      });

      // Assuming response has 'next' and 'results'
      setNextPageCursor(response.next);
      const parsedBounties: SimpleBounty[] = (response.results || [])
        .map((bounty: any) => {
          try {
            return parseSimpleBounty(bounty);
          } catch (e) {
            console.error("error parsing bounty", bounty, e);
            return undefined;
          }
        })
        .filter((bounty): bounty is SimpleBounty => bounty !== undefined);

      if (currentPage === 1) {
        setCurrentBounties(parsedBounties);
      } else {
        setCurrentBounties((prevBounties) => [...prevBounties, ...parsedBounties]);
      }
    } catch (error) {
      console.error("Error fetching bounties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleInfoSection = (section: string) => {
    if (openInfoSections.includes(section)) {
      setOpenInfoSections(openInfoSections.filter((s) => s !== section));
    } else {
      setOpenInfoSections([...openInfoSections, section]);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const showVerifyBanner =
    !currentUser?.isVerified &&
    verificationBannerDismissStatus === "checked" &&
    !isVerificationBannerDismissed;

  return (
    <div className={css(styles.pageWrapper)}>
      {/* Bounties Section */}
      <div className={css(styles.bountiesSection)}>
        <h1 className={css(styles.title)}>Bounties</h1>
        <div className={css(styles.description)}>
          Earn ResearchCoin by completing research-related bounties.
        </div>

        {/* Verification Banner */}
        {showVerifyBanner && (
          <div className={css(styles.verifyIdentityBanner)}>
            <VerifiedBadge height={32} width={32} />
            Verify identity to see bounty recommendations relevant to your
            research interests.
            <div className={css(styles.verifyActions)}>
              <VerifyIdentityModal
                wsUrl={WS_ROUTES.NOTIFICATIONS(currentUser?.id)}
                wsAuth
              >
                <Button isWhite>Verify</Button>
              </VerifyIdentityModal>

              <CloseIcon
                overrideStyle={styles.closeBtn}
                onClick={() => dismissVerificationBanner()}
                color="white"
                height={20}
                width={20}
              />
            </div>
          </div>
        )}

        {/* Bounties List */}
        <div className={css(styles.bounties)}>
          {currentBounties.map((bounty) => (
            <div className={css(styles.bountyWrapper)} key={bounty.id}>
              <BountyFeedCard bounty={bounty} />
            </div>
          ))}

          {/* Load More Button */}
          {nextPageCursor && (
            <LoadMore
              onClick={async () => {
                setCurrentPage((prevPage) => prevPage + 1);
                setIsLoading(true);
              }}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* Loading Placeholders */}
        {isLoading && (
          <div className={css(styles.placeholderWrapper)}>
            {Array.from({ length: 10 }).map((_, idx) => (
              <LiveFeedCardPlaceholder key={idx} color="#efefef" />
            ))}
          </div>
        )}
      </div>

      {/* Info Sidebar */}
      <div className={css(styles.info, styles.infoSection)}>
        {/* Sidebar Header */}
        <div
          className={css(styles.sidebarHeader)}
          onClick={toggleSidebar}
        >
          <div className={css(styles.sidebarHeaderContent)}>
            <ResearchCoinIcon version={4} height={25} width={25} />
            <span>About ResearchCoin</span>
          </div>
          <FontAwesomeIcon
            icon={isSidebarExpanded ? faChevronUp : faChevronDown}
            className={css(styles.sidebarToggleIcon)}
          />
        </div>

        {/* Sidebar Content */}
        {isSidebarExpanded && (
          <>
            {/* About ResearchCoin */}
            <div className={css(styles.aboutRSC, styles.infoBlock)}>
              <div className={css(styles.aboutRSCContent)}>
                ResearchCoin (RSC) is a digital currency earned by sharing, curating,
                and reviewing research on ResearchHub, enabling anyone to contribute
                and earn within the global scientific community.
              </div>
            </div>

            {/* Doing Things with RSC */}
            <div className={css(styles.doingThingsWithRSC, styles.infoBlock)}>
              <div className={css(styles.infoLabel)}>
                Doing things with ResearchCoin
              </div>

              {/* Create a Bounty */}
              <div className={css(styles.collapsable)}>
                <div
                  className={css(styles.collapsableHeader)}
                  onClick={() => toggleInfoSection("create-bounty")}
                >
                  <div className={css(styles.collapsableHeaderTitle)}>
                    <div>Create a bounty</div>
                    <div>
                      {openInfoSections.includes("create-bounty") ? (
                        <FontAwesomeIcon icon={faAngleDown} />
                      ) : (
                        <FontAwesomeIcon icon={faAngleRight} />
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className={css(
                    styles.collapsableContent,
                    openInfoSections.includes("create-bounty") &&
                      styles.collapsableContentOpen
                  )}
                >
                  <div>
                    RSC drives ResearchHub's Grant system, linking researchers to
                    opportunities based on their expertise. Users create bounties for
                    tasks like data analysis, literature reviews, or paid peer review,
                    enabling targeted collaboration and efficient knowledge sharing.
                  </div>
                </div>
              </div>

              {/* Reward Quality Contributions */}
              <div className={css(styles.collapsable)}>
                <div
                  className={css(styles.collapsableHeader)}
                  onClick={() => toggleInfoSection("reward-contributions")}
                >
                  <div className={css(styles.collapsableHeaderTitle)}>
                    <div>Reward quality contributions</div>
                    <div>
                      {openInfoSections.includes("reward-contributions") ? (
                        <FontAwesomeIcon icon={faAngleDown} />
                      ) : (
                        <FontAwesomeIcon icon={faAngleRight} />
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className={css(
                    styles.collapsableContent,
                    openInfoSections.includes("reward-contributions") &&
                      styles.collapsableContentOpen
                  )}
                >
                  <div>
                    RSC is the incentive layer of the ResearchHub ecosystem, rewarding
                    actions like peer reviews and advancing research goals like
                    reproducibility. The community of researchers governs the reward
                    algorithm, ensuring incentives are aligned with their expertise and
                    priorities.
                  </div>
                </div>
              </div>

              {/* Fund Open Science */}
              <div className={css(styles.collapsable)}>
                <div
                  className={css(styles.collapsableHeader)}
                  onClick={() => toggleInfoSection("fund-open-science")}
                >
                  <div className={css(styles.collapsableHeaderTitle)}>
                    <div>Fund open science</div>
                    <div>
                      {openInfoSections.includes("fund-open-science") ? (
                        <FontAwesomeIcon icon={faAngleDown} />
                      ) : (
                        <FontAwesomeIcon icon={faAngleRight} />
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className={css(
                    styles.collapsableContent,
                    openInfoSections.includes("fund-open-science") &&
                      styles.collapsableContentOpen
                  )}
                >
                  <div>
                    RSC enables community-driven scientific funding through open-access
                    preregistrations, streamlining proposals and funding for research
                    projects. This approach encourages updates, reduces admin overhead,
                    and promotes transparency, fostering more reproducible and
                    collaborative science.
                  </div>
                </div>
              </div>
            </div>

            {/* Earning ResearchCoin */}
            <div className={css(styles.doingThingsWithRSC, styles.infoBlock)}>
              <div className={css(styles.infoLabel)}>Earning ResearchCoin</div>

              {/* Share a Peer Review */}
              <div className={css(styles.collapsable)}>
                <div
                  className={css(styles.collapsableHeader)}
                  onClick={() => toggleInfoSection("peer-review")}
                >
                  <div className={css(styles.collapsableHeaderTitle)}>
                    <div>Share a peer review</div>
                    <div>
                      {openInfoSections.includes("peer-review") ? (
                        <FontAwesomeIcon icon={faAngleDown} />
                      ) : (
                        <FontAwesomeIcon icon={faAngleRight} />
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className={css(
                    styles.collapsableContent,
                    openInfoSections.includes("peer-review") &&
                      styles.collapsableContentOpen
                  )}
                >
                  <div>
                    Researchers can earn RSC by peer reviewing preprints on
                    ResearchHub. Once you verify your identity and import your
                    publications, we will surface peer review opportunities for you
                    here.
                  </div>
                </div>
              </div>

              {/* Answer a Bounty */}
              <div className={css(styles.collapsable)}>
                <div
                  className={css(styles.collapsableHeader)}
                  onClick={() => toggleInfoSection("answer-bounty")}
                >
                  <div className={css(styles.collapsableHeaderTitle)}>
                    <div>Answer a bounty</div>
                    <div>
                      {openInfoSections.includes("answer-bounty") ? (
                        <FontAwesomeIcon icon={faAngleDown} />
                      ) : (
                        <FontAwesomeIcon icon={faAngleRight} />
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className={css(
                    styles.collapsableContent,
                    openInfoSections.includes("answer-bounty") &&
                      styles.collapsableContentOpen
                  )}
                >
                  <div>
                    Researchers earn RSC by completing bounties on ResearchHub, from
                    peer-reviewing preprints to troubleshooting and data processing.
                    This system lets researchers monetize their expertise while
                    providing valuable assistance to bounty creators.
                  </div>
                </div>
              </div>

              {/* Do Reproducible Research */}
              <div className={css(styles.collapsable)}>
                <div
                  className={css(styles.collapsableHeader)}
                  onClick={() => toggleInfoSection("reproducible")}
                >
                  <div className={css(styles.collapsableHeaderTitle)}>
                    <div>Do reproducible research</div>
                    <div>
                      {openInfoSections.includes("reproducible") ? (
                        <FontAwesomeIcon icon={faAngleDown} />
                      ) : (
                        <FontAwesomeIcon icon={faAngleRight} />
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className={css(
                    styles.collapsableContent,
                    openInfoSections.includes("reproducible") &&
                      styles.collapsableContentOpen
                  )}
                >
                  <div>
                    Researchers earn RSC by conducting and sharing reproducible research.
                    This includes providing detailed methods, sharing data and code,
                    and participating in replication studies. ResearchHub rewards
                    these practices to promote transparency and reliability in science.
                  </div>
                </div>
              </div>

              {/* Get Upvotes on Your Content */}
              <div className={css(styles.collapsable)}>
                <div
                  className={css(styles.collapsableHeader)}
                  onClick={() => toggleInfoSection("upvotes")}
                >
                  <div className={css(styles.collapsableHeaderTitle)}>
                    <div>Get upvotes on your content</div>
                    <div>
                      {openInfoSections.includes("upvotes") ? (
                        <FontAwesomeIcon icon={faAngleDown} />
                      ) : (
                        <FontAwesomeIcon icon={faAngleRight} />
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className={css(
                    styles.collapsableContent,
                    openInfoSections.includes("upvotes") &&
                      styles.collapsableContentOpen
                  )}
                >
                  <div>
                    Researchers earn RSC by contributing to scientific discourse on
                    ResearchHub, gaining upvotes on comments, posts, reviews, and
                    papers. By incentivizing open discussions, we aim to foster a more
                    innovative and dynamic research ecosystem.
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
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
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  placeholderWrapper: {
    marginTop: 20,
  },
  bountiesSection: {
    width: 800,
    margin: "0 auto",
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      width: "100%",
    },
  },
  bounties: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  bountyWrapper: {
    ":first-child": {
      marginTop: 25,
    },
  },
  verifyIdentityBanner: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "20px 10px",
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
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
  info: {
    maxWidth: 320,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  infoSection: {},
  sidebarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    borderRadius: "8px 8px 0 0",
    cursor: "pointer",
    ":hover": {
      backgroundColor: colors.NEW_BLUE(0.2),
    },
  },
  sidebarHeaderContent: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "18px",
    fontWeight: 500,
  },
  sidebarToggleIcon: {
    fontSize: "20px",
    color: colors.NEW_BLUE(),
  },
  aboutRSC: {
    border: `1px solid ${colors.BLACK(0.2)}`,
    borderRadius: 4,
  },
  infoBlock: {
    border: `1px solid ${colors.BLACK(0.2)}`,
    borderRadius: 8,
    marginTop: 30,
    backgroundColor: "#fff",
    ":first-child": {
      marginTop: 0,
    },
  },
  infoLabel: {
    fontWeight: 500,
    padding: 15,
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 18,
    borderBottom: `1px solid ${colors.BLACK(0.2)}`,
  },
  aboutRSCContent: {
    padding: 15,
    fontSize: 15,
    lineHeight: "20px",
  },
  doingThingsWithRSC: {},
  collapsable: {},
  collapsableHeader: {
    userSelect: "none",
    padding: 15,
    ":hover": {
      background: colors.LIGHTER_GREY(1.0),
      cursor: "pointer",
    },
  },
  collapsableHeaderTitle: {
    justifyContent: "space-between",
    display: "flex",
  },
  collapsableContent: {
    display: "none",
  },
  collapsableContentOpen: {
    display: "block",
    padding: 15,
    background: colors.LIGHTER_GREY(0.3),
    ":hover": {
      background: colors.LIGHTER_GREY(0.3),
    },
    color: colors.BLACK(0.9),
    fontSize: 14,
  },
});

export default BountiesPage;
