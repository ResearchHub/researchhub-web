import { NextPage } from "next";
import { css, StyleSheet } from "aphrodite";
import { fetchBounties } from "~/components/Bounty/api/fetchBountiesAPI";
import { useEffect, useState } from "react";
import {
  parseUnifiedDocument,
  parseUser,
} from "~/config/types/root_types";
import { formatDateStandard } from "~/config/utils/dates";
import { getUrlToUniDoc } from "~/config/utils/routing";
import CommentAvatars from "~/components/Comment/CommentAvatars";
import { CloseIcon, PaperIcon } from "~/config/themes/icons";
import { CondensedAuthorList } from "~/components/Author/AuthorList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faSlidersH,
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
import FormSelect from "~/components/Form/FormSelect";
import fetchReputationHubs from "~/components/Hubs/api/fetchReputationHubs";
import BaseModal from "~/components/Modals/BaseModal";
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
  targetHubs: Hub[];
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
    targetHubs: (raw.target_hubs || []).map(parseHub),
  };
};

const _convertToSelectOption = (hubs: Hub[]) => {
  return hubs.map((h: any) => ({
    label: h.name,
    value: h.id,
    name: h.name,
    valueForApi: h.id,
  }));
};

const BOUNTY_TYPE_OPTIONS = [
  { value: "REVIEW", label: "Peer Review" },
  { value: "ANSWER", label: "Answer to a Question" },
  { value: "GENERIC_COMMENT", label: "Other" },
];

const BountyCard = ({ bounty }: { bounty: SimpleBounty }) => {
  const { createdBy, unifiedDocument, expirationDate } = bounty;
  const url = getUrlToUniDoc(unifiedDocument);
  return (
    <div className={css(styles.bounty)}>
      <div className={css(styles.bountyHeader)}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            columnGap: "3px",
            flexWrap: "wrap",
          }}
        >
          <CommentAvatars size={25} people={[createdBy]} withTooltip={true} />
          <UserTooltip
            createdBy={createdBy}
            targetContent={
              <ALink
                href={`/author/${createdBy?.authorProfile?.id}`}
                key={`/author/${createdBy?.authorProfile?.id}`}
              >
                {createdBy?.authorProfile?.firstName}{" "}
                {createdBy?.authorProfile?.lastName}
              </ALink>
            }
          />
          {createdBy?.authorProfile?.isVerified && (
            <VerifiedBadge height={18} width={18} />
          )}
          <div className={css(styles.action)}>opened a bounty</div>
        </div>
      </div>

      <ALink href={url + "/bounties"}>
        <div className={css(styles.paperWrapper)}>
          <div className={css(styles.iconWrapper, styles.paperIcon)}>
            <PaperIcon
              color="rgba(170, 168, 180, 1)"
              height={24}
              width={24}
              onClick={undefined}
            />
          </div>
          <div className={css(styles.paperDetails)}>
            <div className={css(styles.paperTitle)}>
              {unifiedDocument?.document?.title}
            </div>
            <div className={css(styles.paperAuthors)}>
              {unifiedDocument.authors && (
                <CondensedAuthorList
                  authorNames={unifiedDocument.authors.map(
                    (a) => a.firstName + " " + a.lastName
                  )}
                  allowAuthorNameToIncludeHtml={false}
                />
              )}
            </div>
          </div>
        </div>
      </ALink>

      <div className={css(styles.lineItems)}>
        <div className={css(styles.lineItem)} style={{ marginBottom: -2 }}>
          <div className={css(styles.lineItemLabel)}>Amount:</div>
          <div className={css(styles.lineItemValue)}>
            <ContentBadge
              badgeOverride={styles.badge}
              contentType="bounty"
              bountyAmount={bounty.amount}
              label={
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 1 }}>
                    {numeral(bounty.amount).format("0,0a")} RSC
                  </div>
                </div>
              }
            />
          </div>
        </div>
        <div className={css(styles.lineItem)}>
          <div className={css(styles.lineItemLabel)}>Expiration date:</div>
          <div className={css(styles.lineItemValue)}>
            {formatDateStandard(bounty.expirationDate)}
          </div>
        </div>
        <div className={css(styles.lineItem)}>
          <div className={css(styles.lineItemLabel)}>Expertise:</div>
          <div className={css(styles.lineItemValue)}>
            {bounty.hubs && bounty.hubs.length > 0
              ? bounty.hubs.map((hub) => (
                  <HubTag
                    overrideStyle={styles.hubTag}
                    hub={hub}
                    key={hub.id}
                  />
                ))
              : "All"}
          </div>
        </div>
      </div>

      <ALink href={url + "/bounties"}>
        <div className={css(styles.answerCTA)}>
          <Button size="small">Answer Bounty</Button>
        </div>
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

  const [selectedBountyTypes, setSelectedBountyTypes] = useState<string[]>([]);
  const [reputationHubs, setReputationHubs] = useState<Array<Hub>>([]);
  const [selectedReputationHubs, setSelectedReputationHubs] = useState<
    Array<any>
  >([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (reputationHubs.length === 0) {
      fetchReputationHubs().then((response) => {
        const hubs = response.map((hub: any) => parseHub(hub));
        setReputationHubs(hubs);
      });
    }
  }, []);

  useEffect(() => {
    (async () => {
      const bounties: any = await fetchBounties({
        personalized: true,
        pageCursor: nextPageCursor,
        bountyTypes: selectedBountyTypes,
        hubs: selectedReputationHubs.map((hub) => hub.value),
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

      if (currentPage === 1) {
        setCurrentBounties(parsedBounties);
      } else {
        setCurrentBounties([...currentBounties, ...parsedBounties]);
      }
      setIsLoading(false);
    })();
  }, [
    currentPage,
    selectedBountyTypes,
    selectedReputationHubs,
    nextPageCursor,
  ]);

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

        <div className={css(styles.filterIconWrapper)}>
          <Button
            onClick={() => setIsFilterModalOpen(true)}
            customButtonStyle={styles.filterButton}
          >
            <FontAwesomeIcon icon={faSlidersH} />
            <span className={css(styles.filterButtonText)}>Filters</span>
          </Button>
        </div>

        <div className={css(styles.bounties)}>
          {currentBounties.map((bounty) => (
            <div className={css(styles.bountyWrapper)} key={bounty.id}>
              <BountyCard bounty={bounty} />
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
                RSC drives ResearchHub’s Grant system, linking researchers to
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

      {isFilterModalOpen && (
        <BaseModal
          isOpen={isFilterModalOpen}
          closeModal={() => setIsFilterModalOpen(false)}
          title="Filter Bounties"
          modalContentStyle={styles.filterModalContent}
          modalStyle={styles.filterModal}
          zIndex={1000}
        >
          <div className={css(styles.filterModalBody)}>
            <div className={css(styles.filterSectionModal)}>
              <div className={css(styles.filterLabel)}>Filter by Hubs:</div>
              <FormSelect
                id="hubFilter"
                isMulti={true}
                required={false}
                value={selectedReputationHubs}
                options={_convertToSelectOption(reputationHubs)}
                onChange={(id, value) => {
                  setSelectedReputationHubs(value);
                  setCurrentPage(1);
                  setNextPageCursor(null);
                  setIsLoading(true);
                }}
                isSearchable={true}
                placeholder="Select Hubs"
                containerStyle={styles.hubFilterContainer}
                inputStyle={styles.hubFilterInput}
              />
            </div>
            <div className={css(styles.filterSectionModal)}>
              <div className={css(styles.filterLabel)}>Filter by Bounty Type:</div>
              <div className={css(styles.bountyTypeFiltersModal)}>
                {BOUNTY_TYPE_OPTIONS.map(({ value, label }) => (
                  <div
                    key={value}
                    className={css(
                      styles.bountyTypeFilter,
                      selectedBountyTypes.includes(value) &&
                        styles.bountyTypeFilterActive
                    )}
                    onClick={() => {
                      if (selectedBountyTypes.includes(value)) {
                        setSelectedBountyTypes(
                          selectedBountyTypes.filter((type) => type !== value)
                        );
                      } else {
                        setSelectedBountyTypes([...selectedBountyTypes, value]);
                      }
                      setCurrentPage(1);
                      setNextPageCursor(null);
                      setIsLoading(true);
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
            <div className={css(styles.filterModalActions)}>
              <Button
                onClick={() => setIsFilterModalOpen(false)}
                customButtonStyle={styles.applyFilterButton}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </BaseModal>
      )}
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
  filterIconWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: colors.NEW_BLUE(),
    color: "#fff",
    padding: "8px 12px",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    gap: 12,
    ":hover": {
      backgroundColor: colors.NEW_BLUE(0.8),
    },
  },
  filterButtonText: {
    fontSize: 14,
  },
  hubTag: {
    cursor: "pointer",
    marginRight: 5,
  },
  badge: {
    borderRadius: 25,
    fontSize: 12,
    marginLeft: -8,
    lineHeight: "16px",
    padding: "3px 10px",
    background: "white",
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
  answerCTA: {
    marginTop: 20,
  },
  description: {
    fontSize: 15,
    marginBottom: 20,
    maxWidth: 790,
    lineHeight: "22px",
  },
  bounty: {
    border: `1px solid ${colors.LIGHTER_GREY()}`,
    borderRadius: "4px",
    padding: 16,
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  bountyWrapper: {
    ":first-child": {
      marginTop: 25,
    },
  },
  bountyHeader: {
    marginBottom: 10,
    fontSize: 14,
  },
  action: {
    color: colors.BLACK(0.6),
  },
  lineItems: {
    rowGap: 6,
    display: "flex",
    flexDirection: "column",
  },
  lineItem: {
    display: "flex",
    fontSize: 14,
    alignItems: "center",
  },
  lineItemLabel: {
    color: colors.BLACK(0.7),
    width: 120,
  },
  lineItemValue: {},
  detailsLineItem: {
    display: "block",
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
  paperWrapper: {
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    marginTop: 10,
    background: "rgba(250, 250, 252, 1)",
    borderRadius: 2,
    padding: 20,
    ":hover": {
      transition: "0.2s",
      background: colors.LIGHTER_GREY(1.0),
    },
  },
  iconWrapper: {
    marginRight: 10,
  },
  paperIcon: {
    [`@media only screen and (max-width: 400px)`]: {
      display: "none",
    },
  },
  paperDetails: {},
  paperTitle: {
    fontSize: 16,
  },
  paperAuthors: {
    color: colors.BLACK(0.6),
    fontSize: 13,
    marginTop: 3,
  },
  filterModalContent: {
    padding: 20,
    maxWidth: 500,
  },
  filterModal: {
    width: "auto",
  },
  filterModalBody: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  filterSectionModal: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 500,
  },
  bountyTypeFiltersModal: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },
  bountyTypeFilter: {
    padding: "6px 10px",
    border: `1px solid #DEDEE6`,
    borderRadius: 5,
    cursor: "pointer",
    fontWeight: 500,
    fontSize: 14,
    lineHeight: "20px",
    ":hover": {
      opacity: 0.7,
    },
  },
  bountyTypeFilterActive: {
    border: `2px solid ${colors.NEW_BLUE()}`,
    ":hover": {
      opacity: 1,
    },
  },
  applyFilterButton: {
    backgroundColor: colors.NEW_BLUE(),
    color: "#fff",
    width: "100%",
    ":hover": {
      backgroundColor: colors.NEW_BLUE(0.8),
    },
  },
  filterModalActions: {
    marginTop: 10,
  },
});

export default BountiesPage;
