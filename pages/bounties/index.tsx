import { NextPage } from "next";
import { css, StyleSheet } from "aphrodite";
import { fetchBounties } from "~/components/Bounty/api/fetchBountiesAPI";
import { useEffect, useState } from "react";
import { parseUnifiedDocument, parseUser } from "~/config/types/root_types";
import { formatDateStandard } from "~/config/utils/dates";
import { getUrlToUniDoc } from "~/config/utils/routing";
import CommentAvatars from "~/components/Comment/CommentAvatars";
import { CloseIcon, PaperIcon } from "~/config/themes/icons";
import { CondensedAuthorList } from "~/components/Author/AuthorList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faSlidersH,
  faClock,
  faCoins,
  faTag,
} from "@fortawesome/pro-light-svg-icons";
import Button from "~/components/Form/Button";
import colors from "~/config/themes/colors";
import ContentBadge from "~/components/ContentBadge";
import numeral from "numeral";
import ResearchCoinIcon from "~/components/Icons/ResearchCoinIcon";
import { faAngleDown } from "@fortawesome/pro-solid-svg-icons";
import LiveFeedCardPlaceholder from "~/components/Placeholders/LiveFeedCardPlaceholder";
import { Hub, parseHub } from "~/config/types/hub";
import HubTag from "~/components/Hubs/HubTag";
import LoadMore from "~/components/shared/LoadMore";
import VerifiedBadge from "~/components/Verification/VerifiedBadge";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import useCurrentUser from "~/config/hooks/useCurrentUser";
import { breakpoints } from "~/config/themes/screen";
import { useSelector } from "react-redux";
import { useDismissableFeature } from "~/config/hooks/useDismissableFeature";
import ALink from "~/components/ALink";
import UserTooltip from "~/components/Tooltips/User/UserTooltip";
import VerifyIdentityModal from "~/components/Verification/VerifyIdentityModal";

type SimpleBounty = {
  id: string;
  amount: number;
  content: any;
  createdBy: any;
  expirationDate: string;
  createdDate: string;
  unifiedDocument: any;
  hubs: Hub[];
  bountyType: "REVIEW" | "GENERIC_COMMENT" | "ANSWER";
};

const parseSimpleBounty = (raw: any): SimpleBounty => {
  return {
    id: raw.id,
    amount: raw.total_amount,
    content: raw.item.comment_content_json,
    bountyType: raw.bounty_type,
    createdDate: raw.created_date,
    createdBy: parseUser(raw.created_by),
    expirationDate: raw.expiration_date,
    unifiedDocument: parseUnifiedDocument(raw.unified_document),
    hubs: (raw.unified_document?.hubs || [])
      .map(parseHub)
      .filter((hub: Hub) => hub.isUsedForRep === true),
  };
};

const bountyTypeLabels = {
  REVIEW: "Peer Review",
  ANSWER: "Answer",
  GENERIC_COMMENT: "Comment",
};

const BountyFeedCard = ({ bounty }: { bounty: SimpleBounty }) => {
  const { createdBy, unifiedDocument, expirationDate, amount, hubs, bountyType } = bounty;
  const url = getUrlToUniDoc(unifiedDocument);

  return (
    <div className={css(styles.card)}>
      <div className={css(styles.header)}>
        <div className={css(styles.userInfo)}>
          <CommentAvatars size={40} people={[createdBy]} withTooltip={true} />
          <div className={css(styles.userDetails)}>
            <UserTooltip
              createdBy={createdBy}
              targetContent={
                <ALink
                  href={`/author/${createdBy?.authorProfile?.id}`}
                  key={`/author/${createdBy?.authorProfile?.id}`}
                  className={css(styles.userName)}
                >
                  {createdBy?.authorProfile?.firstName}{" "}
                  {createdBy?.authorProfile?.lastName}
                  {createdBy?.authorProfile?.isVerified && (
                    <VerifiedBadge height={16} width={16} style={{ marginLeft: 4 }} />
                  )}
                </ALink>
              }
            />
            <div className={css(styles.bountyType)}>{bountyTypeLabels[bountyType]}</div>
          </div>
        </div>
        <div className={css(styles.amount)}>
          <FontAwesomeIcon icon={faCoins} className={css(styles.icon)} />
          {numeral(amount).format("0,0")} RSC
        </div>
      </div>
      
      <h3 className={css(styles.title)}>{unifiedDocument.document.title}</h3>
      
      <div className={css(styles.metaInfo)}>
        <div className={css(styles.metaItem)}>
          <FontAwesomeIcon icon={faClock} className={css(styles.icon)} />
          Expires {formatDateStandard(expirationDate)}
        </div>
        <div className={css(styles.metaItem)}>
          <FontAwesomeIcon icon={faTag} className={css(styles.icon)} />
          {hubs && hubs.length > 0 ? (
            <div className={css(styles.hubTags)}>
              {hubs.map((hub) => (
                <HubTag key={hub.id} hub={hub} overrideStyle={styles.hubTag} />
              ))}
            </div>
          ) : (
            "All"
          )}
        </div>
      </div>
      
      <ALink href={`${url}/bounties`} className={css(styles.ctaLink)}>
        <Button customButtonStyle={styles.ctaButton}>Answer Bounty</Button>
      </ALink>
    </div>
  );
};

const BountiesPage: NextPage = () => {
  const [currentBounties, setCurrentBounties] = useState<SimpleBounty[]>([]);
  const [openInfoSections, setOpenInfoSections] = useState<string[]>([]);
  const [nextPageCursor, setNextPageCursor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
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

  useEffect(() => {
    fetchBountiesData();
  }, [currentPage]);

  const fetchBountiesData = async () => {
    setIsLoading(true);
    const bounties: any = await fetchBounties({ personalized: true, pageCursor: nextPageCursor });

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

    if (currentPage === 1) {
      setCurrentBounties(parsedBounties);
    } else {
      setCurrentBounties([...currentBounties, ...parsedBounties]);
    }
    setIsLoading(false);
  };

  const toggleInfoSection = (section: string) => {
    if (openInfoSections.includes(section)) {
      setOpenInfoSections(openInfoSections.filter((s) => s !== section));
    } else {
      setOpenInfoSections([...openInfoSections, section]);
    }
  };

  const showVerifyBanner =
    !currentUser?.isVerified &&
    verificationBannerDismissStatus === "checked" &&
    !isVerificationBannerDismissed;

  return (
    <div className={css(styles.pageWrapper)}>
      <div className={css(styles.bountiesSection)}>
        <h1 className={css(styles.title)}>Bounties</h1>
        <div className={css(styles.description)}>
          Earn ResearchCoin by completing research related bounties.
        </div>
        {showVerifyBanner && (
          <div className={css(styles.verifyIdentityBanner)}>
            <VerifiedBadge height={32} width={32} />
            Verify identity to see bounty recommendations relevant to your
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
                overrideStyle={styles.closeBtn}
                onClick={() => dismissVerificationBanner()}
                color="white"
                height={20}
                width={20}
              />
            </div>
          </div>
        )}

        <div className={css(styles.bounties)}>
          {currentBounties.map((bounty) => (
            <div className={css(styles.bountyWrapper)} key={bounty.id}>
              <BountyFeedCard bounty={bounty} />
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
              .map((_, idx) => (
                <LiveFeedCardPlaceholder key={idx} color="#efefef" />
              ))}
          </div>
        )}
      </div>

      <div className={css(styles.info, styles.infoSection)}>
        <div className={css(styles.aboutRSC, styles.infoBlock)}>
          <div className={css(styles.infoLabel)}>
            <ResearchCoinIcon version={4} height={25} width={25} />
            About ResearchCoin
          </div>
          <div className={css(styles.aboutRSCContent)}>
            ResearchCoin (RSC) is a digital currency earned by sharing, curating,
            and reviewing research on ResearchHub, enabling anyone to contribute
            and earn within the global scientific community.
          </div>
        </div>

        <div className={css(styles.doingThingsWithRSC, styles.infoBlock)}>
          <div className={css(styles.infoLabel)}>
            Doing things with ResearchCoin
          </div>
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
                  )}{" "}
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
                  )}{" "}
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
                  )}{" "}
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

        <div className={css(styles.doingThingsWithRSC, styles.infoBlock)}>
          <div className={css(styles.infoLabel)}>Earning ResearchCoin</div>
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
                  )}{" "}
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
                  )}{" "}
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
                  )}{" "}
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
                Researchers earn RSC by peer-reviewing preprints to troubleshooting
                and data processing. This system lets researchers monetize their
                expertise while providing valuable assistance to bounty creators.
              </div>
            </div>
          </div>
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
                  )}{" "}
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
  },
  placeholderWrapper: {
    marginTop: 20,
  },
  bountiesSection: {
    width: 800,
    margin: "0 auto",
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
  bountyWrapper: {
    ":first-child": {
      marginTop: 25,
    },
  },
  info: {
    maxWidth: 320,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  infoSection: {},
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
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
    transition: "all 0.2s ease-in-out",
    border: `1px solid ${colors.LIGHTER_GREY()}`,
    ":hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    },
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
  },
  userDetails: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 600,
    color: colors.BLACK(0.9),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  },
  bountyType: {
    fontSize: 14,
    color: colors.BLACK(0.6),
    marginTop: 2,
  },
  amount: {
    fontSize: 18,
    fontWeight: 600,
    color: colors.NEW_BLUE(),
    display: "flex",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
    color: colors.BLACK(0.9),
    marginBottom: 16,
    lineHeight: 1.3,
  },
  metaInfo: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    color: colors.BLACK(0.6),
  },
  icon: {
    marginRight: 8,
    fontSize: 16,
    color: colors.BLACK(0.4),
  },
  hubTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  hubTag: {
    fontSize: 12,
    padding: "2px 8px",
  },
  ctaLink: {
    textDecoration: "none",
  },
  ctaButton: {
    width: "100%",
    padding: "12px 0",
    fontSize: 16,
    fontWeight: 600,
    backgroundColor: colors.NEW_BLUE(),
    color: "#ffffff",
    ":hover": {
      backgroundColor: colors.NEW_BLUE(0.8),
    },
  },
});

export default BountiesPage;