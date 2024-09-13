import { NextPage } from "next";
import { useRouter } from "next/router";
import { css, StyleSheet } from "aphrodite";
import { fetchBounties } from "~/components/Bounty/api/fetchBountiesAPI";
import { useEffect, useState } from "react";
import { getPlainText } from "~/components/Comment/lib/quill";
import { parseAuthorProfile, parseUnifiedDocument, parseUser } from "~/config/types/root_types";
import Bounty, { formatBountyAmount } from "~/config/types/bounty";
import UserTooltip from "~/components/Tooltips/User/UserTooltip";
import ALink from "~/components/ALink";
import VerifiedBadge from "~/components/Verification/VerifiedBadge";
import { formatDateStandard, timeSince } from "~/config/utils/dates";
import { getUrlToUniDoc } from "~/config/utils/routing";
import { truncateText } from "~/config/utils/string";
import CommentAvatars from "~/components/Comment/CommentAvatars";
import CommentReadOnly from "~/components/Comment/CommentReadOnly";
import { PaperIcon } from "~/config/themes/icons";
import { CondensedAuthorList } from "~/components/Author/AuthorList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/pro-light-svg-icons";
import Button from "~/components/Form/Button";
import colors from "~/config/themes/colors";
import ContentBadge from "~/components/ContentBadge";
import numeral from "numeral";

type SimpleBounty = {
  id: string;
  amount: number;
  content: string;
  createdBy: any;
  expirationDate: string;
  createdDate: string;
  unifiedDocument: any;
  bountyType: "REVIEW" | "GENERIC_COMMMENT" | "ANSWER";
  // formattedAmount: string;
  // formattedTime: string;
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
    // formattedAmount: raw.total_amount.toLocaleString(),
    // formattedtimeToRoundUp(raw.expiration_date)
  }
}

const BountyCard = ({ bounty }: { bounty: SimpleBounty }) => {

  const { createdBy, unifiedDocument, expirationDate, createdDate } = bounty;

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


              <ContentBadge
                badgeOverride={styles.badge}
                contentType="bounty"
                bountyAmount={bounty.amount}
                label={
                  <div style={{ display: "flex" }}>
                    <div style={{ flex: 1 }}>
                      {numeral(
                        formatBountyAmount({
                          amount: bounty.amount,
                        })
                      ).format("0,0a")}{" "}
                      RSC
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        <div className={css(styles.lineItem)}>
          <div className={css(styles.lineItemLabel)}>
            Bounty type:
          </div>
          <div className={css(styles.lineItemValue)}>
            {bounty.bountyType === "REVIEW" ? "Peer Review" : bounty.bountyType === "ANSWER" ? "Answer to question" : "Other"}
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
          <div className={css(styles.lineItemValue)} style={{marginTop: 5,}}>
            <CommentReadOnly
              content={bounty.content}
              previewMaxImageLength={1}
              previewMaxCharLength={400}
            />
          </div>
        </div>
      </div>

      <div className={css(styles.paperWrapper)}>
        <div className={css(styles.iconWrapper)}>
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
          </div>
        </div>
      </div>
    </div>

  )
}


const BountiesPage: NextPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentBounties, setCurrentBounties] = useState<SimpleBounty[]>([]);

  useEffect(() => {
    (async () => {
      const bounties: any = await fetchBounties({ personalized: true, page: 1 });

      const parsedBounties = (bounties?.results || []).map((bounty) => {
        try {
          return parseSimpleBounty(bounty)
        }
        catch (e) {
          console.error('error parsing bounty', bounty, e);
        }
      }).filter((bounty) => bounty !== undefined);

      setCurrentBounties(parsedBounties);
    })();
  }, [currentPage]);

  return (
    <div className={css(styles.pageWrapper)}>

      <div className={css(styles.bountiesSection)}>
        <h1 className={css(styles.title)}>Bounties</h1>
        <div className={css(styles.description)}>Earn ResearchCoin by completing science related bounties.</div>
        <div className={css(styles.verifyIdentityBanner)}>
          <VerifiedBadge height={32} width={32} />
          Verify your identity to see bounty recommendations relevant to you and your research interests.
          <Button>Verify</Button>
        </div>

        <div className={css(styles.bounties)}>
          {currentBounties.map((bounty) => (
            <div className={css(styles.bountyWrapper)}>
              <BountyCard key={bounty.id} bounty={bounty} />
            </div>
          ))}
        </div>
      </div>

      <div className={css(styles.info, styles.infoSection)}>
        <div className={css(styles.aboutRSC)}>
          <div className={css(styles.aboutRSCLabel)}>About ResearchHub</div>
          <div className={css(styles.aboutRSCContent)}>
            ResearchHub is a platform for academics to share their research
            papers, ask questions, and get feedback. We are a community of
            researchers and students driven to build a space for collaboration
            and open science.
          </div>
        </div>

        <div className={css(styles.doingThingsWithRSC, styles.infoSection)}>
          <div className={css(styles.aboutRSCLabel)}>Doing things with ResearchCoin</div>
          <div className={css(styles.collapsable)}>
            <div className={css(styles.collapsableHeader)}>
              <div className={css(styles.collapsableHeaderTitle)}>
                <div>Fund open science</div>
                <div><FontAwesomeIcon icon={faAngleRight} /></div>
              </div>
            </div>
          </div>
          <div className={css(styles.collapsable)}>
            <div className={css(styles.collapsableHeader)}>
              <div className={css(styles.collapsableHeaderTitle)}>
                <div>Create a bounty</div>
                <div><FontAwesomeIcon icon={faAngleRight} /></div>
              </div>
            </div>
          </div>
          <div className={css(styles.collapsable)}>
            <div className={css(styles.collapsableHeader)}>
              <div className={css(styles.collapsableHeaderTitle)}>
                <div>Reward quality contributions</div>
                <div><FontAwesomeIcon icon={faAngleRight} /></div>
              </div>
            </div>
          </div>
        </div>

        <div className={css(styles.doingThingsWithRSC, styles.infoSection)}>
          <div className={css(styles.aboutRSCLabel)}>Earning ResearchCoin</div>
          <div className={css(styles.collapsable)}>
            <div className={css(styles.collapsableHeader)}>
              <div className={css(styles.collapsableHeaderTitle)}>
                <div>Answer a bounty</div>
                <div><FontAwesomeIcon icon={faAngleRight} /></div>
              </div>
            </div>
          </div>
          <div className={css(styles.collapsable)}>
            <div className={css(styles.collapsableHeader)}>
              <div className={css(styles.collapsableHeaderTitle)}>
                <div>Publish an open access paper</div>
                <div><FontAwesomeIcon icon={faAngleRight} /></div>
              </div>
            </div>
          </div>
          <div className={css(styles.collapsable)}>
            <div className={css(styles.collapsableHeader)}>
              <div className={css(styles.collapsableHeaderTitle)}>
                <div>Get upvotes on your content</div>
                <div><FontAwesomeIcon icon={faAngleRight} /></div>
              </div>
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
  },
  bountiesSection: {
    maxWidth: 800,
    margin: "0 auto",
  },
  bounties: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
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
    padding: 10,
    border: "1px solid #ccc",
    borderRadius: 5,
    marginTop: 10,
    background: colors.NEW_BLUE(0.1),
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
  bounty: {
    
  },
  bountyWrapper: {
    borderBottom: `1px solid ${colors.LIGHTER_GREY()}`,
    paddingBottom: 25,
    ":first-child": {
      marginTop: 25,
    }
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
  },
  infoSection: {
    marginTop: 45,
  },
  aboutRSC: {

  },
  aboutRSCLabel: {
  },
  aboutRSCContent: {

  },
  doingThingsWithRSC: {

  },
  collapsable: {

  },
  collapsableHeader: {

  },
  collapsableHeaderTitle: {
    justifyContent: "space-between",
    display: "flex"

  },
  collapsableContent: {
    display: "none"
  },
  collapsableContentOpen: {
    display: "block"
  },
  paperWrapper: {
    display: "flex",
    alignItems: "center",
    marginTop: 10,
    background: "rgba(250, 250, 252, 1)",
    borderRadius: 2,
    padding: 20,
  },
  iconWrapper: {
    marginRight: 10,
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
  }


})

export default BountiesPage;  