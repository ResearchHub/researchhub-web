import { NextPage } from "next";
import { useRouter } from "next/router";
import { css, StyleSheet } from "aphrodite";
import { fetchBounties } from "~/components/Bounty/api/fetchBountiesAPI";
import { useEffect, useState } from "react";
import { getPlainText } from "~/components/Comment/lib/quill";
import { ID, parseAuthorProfile, parseUnifiedDocument, parseUser } from "~/config/types/root_types";
import Bounty, { formatBountyAmount } from "~/config/types/bounty";
import UserTooltip from "~/components/Tooltips/User/UserTooltip";
import ALink from "~/components/ALink";
import VerifiedBadge from "~/components/Verification/VerifiedBadge";
import { formatDateStandard, timeSince } from "~/config/utils/dates";
import { getUrlToUniDoc } from "~/config/utils/routing";
import { truncateText } from "~/config/utils/string";
import CommentAvatars from "~/components/Comment/CommentAvatars";
import CommentReadOnly from "~/components/Comment/CommentReadOnly";
import { CloseIcon, PaperIcon } from "~/config/themes/icons";
import { CondensedAuthorList } from "~/components/Author/AuthorList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/pro-light-svg-icons";
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
import VerifyIdentityModal from "~/components/Verification/VerifyIdentityModal";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import useCurrentUser from "~/config/hooks/useCurrentUser";
import { breakpoints } from "~/config/themes/screen";
import { useSelector } from "react-redux";
import { useDismissableFeature } from "~/config/hooks/useDismissableFeature";
import HubSelectDropdown from "~/components/Hubs/HubSelectDropdown";
import { useExchangeRate } from "~/components/contexts/ExchangeRateContext";
import GenericMenu, { MenuOption } from "~/components/shared/GenericMenu";
import IconButton from "~/components/Icons/IconButton";
import { Checkbox } from "@mui/material";
import HubSelectModal from "~/components/Hubs/HubSelectModal";
import { faComments, faStar, faGrid2 } from "@fortawesome/pro-solid-svg-icons";

type SimpleBounty = {
  id: string;
  amount: number;
  content: any;
  createdBy: any;
  expirationDate: string;
  createdDate: string;
  unifiedDocument: any;
  hubs: Hub[];
  bountyType: "REVIEW" | "GENERIC_COMMMENT" | "ANSWER";
}

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
    hubs: (raw?.hubs || []).map(parseHub).filter((hub:Hub) => hub.isUsedForRep === true),
  }
}

const BountyCard = ({ bounty, handleHubClick }: { bounty: SimpleBounty, handleHubClick: Function }) => {

  const { createdBy, unifiedDocument, expirationDate, createdDate } = bounty;

  const { rscToUSDDisplay } = useExchangeRate();
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
            // overrideTargetStyle={styles.userTooltip}
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

      <div className={css(styles.lineItems)}>        
          <div className={css(styles.lineItem)} style={{marginBottom: -2}}>
            <div className={css(styles.lineItemLabel)}>
              Amount:
            </div>
            <div className={css(styles.lineItemValue)}>


              <div style={{ display: "flex", alignItems: "center", gap: 10, }}>
                <div style={{ color: colors.ORANGE_DARK2(), fontSize: 14, gap: 5, fontWeight: 500, display: "flex", alignItems: "center" }}>
                  <ResearchCoinIcon version={4} height={18} width={18} />
                  {numeral(
                    formatBountyAmount({
                      amount: bounty.amount,
                    })
                  ).format("0,0a")}{" "}
                  RSC
                </div>
                <div style={{ color: colors.MEDIUM_GREY2()}}>({rscToUSDDisplay(bounty.amount)})</div>
              </div>

            </div>
          </div>
        <div className={css(styles.lineItem)}>
          <div className={css(styles.lineItemLabel)}>
            Bounty type:
          </div>
          <div className={css(styles.lineItemValue)}>
            {bounty.bountyType === "REVIEW" ? "Peer Review" : bounty.bountyType === "ANSWER" ? "Answer to question" : "Uncategorized"}
          </div>
        </div>
        <div className={css(styles.lineItem)}>
          <div className={css(styles.lineItemLabel)}>
            Expiration date:
          </div>
          <div className={css(styles.lineItemValue)}>
            {formatDateStandard(bounty.expirationDate)}
          </div>
        </div>
        <div className={css(styles.lineItem, styles.detailsLineItem)}>
          <div className={css(styles.lineItemLabel)}>
            Details:
          </div>
          {bounty.content?.ops &&
            <div className={css(styles.lineItemValue)} style={{marginTop: 5,}}>
              <CommentReadOnly
                content={bounty.content}
                previewMaxImageLength={1}
                previewMaxCharLength={400}
              />
            </div>
          }
        </div>
      </div>

      <ALink href={url + "/bounties"}>
        <div className={css(styles.paperWrapper)}>
          <div className={css(styles.iconWrapper, styles.paperIcon)}>
            <PaperIcon color="rgba(170, 168, 180, 1)" height={24} width={24} onClick={undefined} />
          </div>
          <div className={css(styles.paperDetails)}>
            <div className={css(styles.paperTitle)}>
              {unifiedDocument?.document?.title}
            </div>
            <div className={css(styles.paperAuthors)}>
              {unifiedDocument.authors &&
                <CondensedAuthorList authorNames={unifiedDocument.authors.map(a => a.firstName + " " + a.lastName)} allowAuthorNameToIncludeHtml={false} />
              }

              <div className={css(styles.abstract)}>
                {truncateText(bounty?.unifiedDocument?.document?.abstract, 200)}
              </div>

              {bounty?.hubs && bounty.hubs.length > 0 && (
                <div className={css(styles.paperHubs)}>
                  {bounty.hubs.map((hub) => (
                    <div
                      key={hub.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleHubClick(hub);
                    }}>
                      <HubTag preventLinkClick overrideStyle={styles.hubTag} hub={hub} key={hub.id} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </ALink>
      <ALink href={url + "/bounties"}>
        <div className={css(styles.answerCTA)}>
          <Button size="small" >Answer Bounty</Button>
        </div>
      </ALink>
    </div>

  )
}


const BountiesPage: NextPage = () => {
  const [currentBounties, setCurrentBounties] = useState<SimpleBounty[]>([]);
  const [openInfoSections, setOpenInfoSections] = useState<string[]>([]);
  const [nextPageCursor, setNextPageCursor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const currentUser = useCurrentUser()
  const auth = useSelector((state: any) => state.auth);
  const {
    isDismissed: isVerificationBannerDismissed,
    dismissFeature: dismissVerificationBanner,
    dismissStatus: verificationBannerDismissStatus
  } = useDismissableFeature({ auth, featureName: "verification-banner-in-bounties-page" })


  const [selectedBountyTypes, setSelectedBountyTypes] = useState<Array<string>>([]);
  const [selectedHub, setSelectedHub] = useState<Hub | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const _fetchAndParseBounties = async () => {
    const bounties: any = await fetchBounties({ personalized: true, pageCursor: nextPageCursor, hubIds: selectedHub ? [selectedHub?.id] : [] });
  
    setNextPageCursor(bounties.next);
    const parsedBounties = (bounties?.results || []).map((bounty) => {
      try {
        return parseSimpleBounty(bounty)
      }
      catch (e) {
        console.error('error parsing bounty', bounty, e);
      }
    }).filter((bounty) => bounty !== undefined);

    return parsedBounties;
  }


  useEffect(() => {
    (async () => {
      const parsedBounties = await _fetchAndParseBounties();
      setCurrentBounties([...currentBounties, ...parsedBounties]);
      setIsLoading(false);
    })();
  }, [currentPage]);


  useEffect(() => {
    (async () => {
      const parsedBounties = await _fetchAndParseBounties();
      setCurrentBounties(parsedBounties);
      setIsLoading(false);
    })();
  }, [selectedHub]);


  const toggleInfoSection = (section: string) => {
    if (openInfoSections.includes(section)) {
      setOpenInfoSections(openInfoSections.filter((s) => s !== section));
    } else {
      setOpenInfoSections([...openInfoSections, section]);
    }
  }

  const options:Array<MenuOption> = [{
    group: "Bounty type",
    value: "researchhub",
    html: (
      <div>
        <Checkbox checked={selectedBountyTypes.includes("researchhub")} sx={{ padding: "0px 10px 0px 0px"}} />
        ResearchHub Foundation    
      </div>
    ),
    onClick: () => {
      console.log("download");
    },
  },{
    group: "Bounty type",
    value: "review",
    html: (
      <div>
        <Checkbox checked={selectedBountyTypes.includes("review")} sx={{ padding: "0px 10px 0px 0px"}} />
        Peer Review
      </div>
    ),
    onClick: () => {
      console.log("download");
    },
  },{
    group: "Bounty type",
    value: "answer",
    html: (
      <div>
        <Checkbox checked={selectedBountyTypes.includes("answer")} sx={{ padding: "0px 10px 0px 0px"}} />
        Answer to question
      </div>
    ),
    onClick: () => {
      console.log("download");
    },
  },{
    group: "Bounty type",
    value: "other",
    html: (
      <div>
        <Checkbox checked={selectedBountyTypes.includes("other")} sx={{ padding: "0px 10px 0px 0px"}} />
        Other
      </div>
    ),
    onClick: () => {
      console.log("download");
    },
  }]

  const showVerifyBanner = !currentUser?.isVerified && (verificationBannerDismissStatus === "checked" && !isVerificationBannerDismissed);
  return (
    <div className={css(styles.pageWrapper)}>


      <div className={css(styles.bountiesSection)}>

        <h1 className={css(styles.title)}>Bounties</h1>
        <div className={css(styles.description)}>Earn ResearchCoin by completing research related bounties.</div>

        <div style={{ display: "flex", gap: 25 }}>
          <div>
            <GenericMenu
              softHide={true}
              options={options}
              width={250}
              id="bounty-type-menu"
              direction="bottom-right"
              isMultiSelect
              closeMenuOnSelect={false}
              onSelect={(option: MenuOption) => {
                console.log("selected", option);
                console.log("selectedBountyTypes", selectedBountyTypes);
                if (selectedBountyTypes.includes(option.value)) {
                  setSelectedBountyTypes(selectedBountyTypes.filter((type) => type !== option.value));
                }
                else {
                  setSelectedBountyTypes([...selectedBountyTypes, option.value]);
                }
              }}
            >
              <IconButton overrideStyle={styles.btnDots}>
                <ResearchCoinIcon version={4} height={20} width={20} color={colors.MEDIUM_GREY(1.0)} />
                Bounty Type
                {selectedBountyTypes.length > 0 && (
                  <div className={css(styles.badge)}>{selectedBountyTypes.length}</div>
                )}
                <FontAwesomeIcon icon={faAngleDown} />
              </IconButton>
            </GenericMenu>
          </div>

          <div>
            <HubSelectModal
              preventLinkClick={true}
              selectedHub={selectedHub}
              isModalOpen={isModalOpen}
              handleModalClose={() => setIsModalOpen(false)}
              handleSelect={(hub) => {
                setSelectedHub(hub);
                setIsModalOpen(false);
              }}
            />

            <IconButton onClick={() => setIsModalOpen(true)}>
              <FontAwesomeIcon icon={faGrid2}></FontAwesomeIcon>
                Hubs
                <div className={css(styles.badge)}>1</div>
                <FontAwesomeIcon icon={faAngleDown} />
            </IconButton>
          </div>
        </div>


        {showVerifyBanner && (
          <div className={css(styles.verifyIdentityBanner)}>
            <VerifiedBadge height={32} width={32} />
            Verify identity to see bounty recommendations relevant to your research interests.
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


              <CloseIcon overrideStyle={styles.closeBtn} onClick={() => dismissVerificationBanner()} color="white" height={20} width={20} />
            </div>
          </div>
        )}

        <div className={css(styles.bounties)}>
          {currentBounties.map((bounty) => (
            <div className={css(styles.bountyWrapper)} key={bounty.id}>
              <BountyCard
                handleHubClick={(hub:Hub) => {
                  setSelectedHub(hub)
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

      <div className={css(styles.info, styles.infoSection)}>
        <div className={css(styles.aboutRSC, styles.infoBlock)}>
          <div className={css(styles.infoLabel)}>
            <ResearchCoinIcon version={4} height={25} width={25} />
            About ResearchCoin
          </div>
          <div className={css(styles.aboutRSCContent)}>
            ResearchCoin (RSC) is a digital currency that aims to incentivize individuals that contribute to the scientific ecosystem. Currently, anyone can earn RSC by sharing, curating, and peer reviewing scientific research on ResearchHub.
          </div>
        </div>

        <div className={css(styles.doingThingsWithRSC, styles.infoBlock)}>
          <div className={css(styles.infoLabel)}>Doing things with ResearchCoin</div>
          <div className={css(styles.collapsable)}>
            <div className={css(styles.collapsableHeader)} onClick={() => toggleInfoSection("create-bounty")}>
              <div className={css(styles.collapsableHeaderTitle)}>
                <div>Create a bounty</div>
                <div>{openInfoSections.includes("create-bounty") ? <FontAwesomeIcon icon={faAngleDown} /> : <FontAwesomeIcon icon={faAngleRight} /> } </div>
              </div>
            </div>
            <div className={css(styles.collapsableContent, openInfoSections.includes("create-bounty") && styles.collapsableContentOpen)}>
              <div>RSC empowers the Grant system used on ResearchHub, connecting researchers with tailored opportunities specific to their quantifiable expertise. Users can create bounties to engage expert researchers for specific tasks, from processing datasets to conducting literature reviews or conducting paid peer review. This flexible system facilitates targeted collaborations, enabling efficient knowledge exchange and task completion within the scientific community.</div>
            </div>             
          </div>
          <div className={css(styles.collapsable)}>
            <div className={css(styles.collapsableHeader)} onClick={() => toggleInfoSection("reward-contributions")}>
              <div className={css(styles.collapsableHeaderTitle)}>
                <div>Reward quality contributions</div>
                <div><FontAwesomeIcon icon={faAngleRight} /></div>
              </div>
            </div>
            <div className={css(styles.collapsableContent, openInfoSections.includes("reward-contributions") && styles.collapsableContentOpen)}>
              <div>RSC serves as the underlying incentive layer for the ResearchHub ecosystem, providing targeted incentives for individual actions (e.g. peer reviews) and broader research goals (e.g. increasing reproducibility). Importantly, the reward algorithm is governed entirely by the community of researchers. This bottom-up approach ensures that those with the most relevant expertise—the researchers themselves—determine what should be incentivized in their fields.</div>
            </div>              
          </div>
          <div className={css(styles.collapsable)}>
            <div className={css(styles.collapsableHeader)} onClick={() => toggleInfoSection("fund-open-science")}>
              <div className={css(styles.collapsableHeaderTitle)}>
                <div>Fund open science</div>
                <div>{openInfoSections.includes("fund-open-science") ? <FontAwesomeIcon icon={faAngleDown} /> : <FontAwesomeIcon icon={faAngleRight} /> } </div>
              </div>
            </div>
            <div className={css(styles.collapsableContent, openInfoSections.includes("fund-open-science") && styles.collapsableContentOpen)}>
              <div>RSC enables the ResearchHub community to participate in scientific funding. By leveraging preregistrations (i.e. open access grant applications), we streamline the process of proposing and funding open research projects. This approach incentivizes frequent updates, reduces administrative overhead, and promotes transparency—ultimately fostering more reproducible and collaborative science.</div>
            </div>
          </div>          
        </div>

        <div className={css(styles.doingThingsWithRSC, styles.infoBlock)}>
          <div className={css(styles.infoLabel)}>Earning ResearchCoin</div>
          <div className={css(styles.collapsable)}>
            <div className={css(styles.collapsableHeader)} onClick={() => toggleInfoSection("peer-review")}>
              <div className={css(styles.collapsableHeaderTitle)}>
                <div>Share a peer review</div>
                <div>{openInfoSections.includes("peer-review") ? <FontAwesomeIcon icon={faAngleDown} /> : <FontAwesomeIcon icon={faAngleRight} /> } </div>
              </div>
            </div>
            <div className={css(styles.collapsableContent, openInfoSections.includes("peer-review") && styles.collapsableContentOpen)}>
              <div>Researchers can earn RSC by peer reviewing preprints on ResearchHub. Once you verify your identity, we will surface peer review opportunities to you here.</div>
            </div>            
          </div>
          <div className={css(styles.collapsable)}>
            <div className={css(styles.collapsableHeader)} onClick={() => toggleInfoSection("answer-bounty")}>
              <div className={css(styles.collapsableHeaderTitle)}>
                <div>Answer a bounty</div>
                <div>{openInfoSections.includes("answer-bounty") ? <FontAwesomeIcon icon={faAngleDown} /> : <FontAwesomeIcon icon={faAngleRight} /> } </div>
              </div>
            </div>
            <div className={css(styles.collapsableContent, openInfoSections.includes("answer-bounty") && styles.collapsableContentOpen)}>
              <div>Researchers can earn RSC by completing bounties on ResearchHub.These tasks range from peer-reviewing preprints from platforms like bioRxiv and arXiv, to providing specialized research troubleshooting and data processing. This flexible system allows researchers to monetize their expertise, offering valuable assistance to bounty creators while receiving fair compensation.</div>
            </div>
          </div>
          <div className={css(styles.collapsable)}>
            <div className={css(styles.collapsableHeader)} onClick={() => toggleInfoSection("reproducible")}>
              <div className={css(styles.collapsableHeaderTitle)}>
                <div>Do reproducible research</div>
                <div>{openInfoSections.includes("reproducible") ? <FontAwesomeIcon icon={faAngleDown} /> : <FontAwesomeIcon icon={faAngleRight} /> } </div>
              </div>
            </div>
            <div className={css(styles.collapsableContent, openInfoSections.includes("reproducible") && styles.collapsableContentOpen)}>
              <div>Researchers can earn RSC by completing bounties on ResearchHub.These tasks range from peer-reviewing preprints from platforms like bioRxiv and arXiv, to providing specialized research troubleshooting and data processing. This flexible system allows researchers to monetize their expertise, offering valuable assistance to bounty creators while receiving fair compensation.</div>
            </div>            
          </div>
          <div className={css(styles.collapsable)}>
            <div className={css(styles.collapsableHeader)} onClick={() => toggleInfoSection("upvotes")}>
              <div className={css(styles.collapsableHeaderTitle)}>
                <div>Get upvotes on your content</div>
                <div>{openInfoSections.includes("upvotes") ? <FontAwesomeIcon icon={faAngleDown} /> : <FontAwesomeIcon icon={faAngleRight} /> } </div>
              </div>
            </div>
            <div className={css(styles.collapsableContent, openInfoSections.includes("upvotes") && styles.collapsableContentOpen)}>
              <div>Researchers also earn RSC by contributing to open scientific discourse on ResearchHub, by receiving upvotes on their comments, posts, peer reviews, and papers. We recognize that scientific progress often stems from informal exchanges and critical discussions. We want to incentivize users to have these conversations in the open, as we believe this leads to a more innovative and dynamic research ecosystem.</div>
            </div>                        
          </div>
        </div>

      </div>


    </div>
  );
}

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
  abstract: {
    fontSize: 15,
    marginTop: 15,
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
  hubTag: {
    cursor: "pointer",
  },
  verifyIdentityBanner: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 10,
    // border: "1px solid #ccc",
    borderRadius: 5,
    marginTop: 10,
    color: "white",
    position: "relative",
    background: "#6165D7",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      flexDirection: "column",
      textAlign: "center",
    }
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
    }
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
      // display: "none",
    }    
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
  lineItemValue: {

  },
  detailsLineItem: {
    display: "block",
  },
  info: {
    maxWidth: 320,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    }

  },
  infoSection: {
  },
  aboutRSC: {
    border: `1px solid ${colors.BLACK(0.2)}`,
    borderRadius: 4,
  },
  infoBlock: {
    border: `1px solid ${colors.BLACK(0.2)}`,
    borderRadius: 8,
    marginTop: 30,
    backgroundColor: "rgb(255, 255, 255)",
    ":first-child": {
      marginTop: 0,
    }
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
  doingThingsWithRSC: {

  },
  collapsable: {
    // borderBottom: `1px solid ${colors.BLACK(0.2)}`,
  },
  collapsableHeader: {
    userSelect: "none",
    padding: 15,
    ":hover": {
      background: colors.LIGHTER_GREY(1.0),
      cursor: "pointer",
    }
  },
  collapsableHeaderTitle: {
    justifyContent: "space-between",
    display: "flex"

  },
  collapsableContent: {
    display: "none"
  },
  collapsableContentOpen: {
    display: "block",
    padding: 15,
    background: colors.LIGHTER_GREY(0.3),
    ":hover": {
      background: colors.LIGHTER_GREY(0.3),
    },
    color: colors.BLACK(0.9),
    fontSize: 14
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
    }
  },
  paperDetails: {
    
  },
  paperTitle: {
    fontSize: 16,

  },
  paperAuthors: {
    color: colors.BLACK(0.6),
    fontSize: 13,
    marginTop: 3,
  },
  paperHubs: {
    display: "flex",
    gap: 5,
    marginTop: 10,
    flexWrap: "wrap",
  },


})

export default BountiesPage;  