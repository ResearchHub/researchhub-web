import { css, StyleSheet } from "aphrodite";
import {
  formatBountyAmount,
} from "~/config/types/bounty";
import UserTooltip from "~/components/Tooltips/User/UserTooltip";
import ALink from "~/components/ALink";
import VerifiedBadge from "~/components/Verification/VerifiedBadge";
import { timeToRoundUp } from "~/config/utils/dates";
import { getUrlToUniDoc } from "~/config/utils/routing";
import { truncateText } from "~/config/utils/string";
import CommentAvatars from "~/components/Comment/CommentAvatars";
import CommentReadOnly from "~/components/Comment/CommentReadOnly";
import { PaperIcon } from "~/config/themes/icons";
import { CondensedAuthorList } from "~/components/Author/AuthorList";
import Button from "~/components/Form/Button";
import colors from "~/config/themes/colors";
import numeral from "numeral";
import ResearchCoinIcon from "~/components/Icons/ResearchCoinIcon";
import HubTag from "~/components/Hubs/HubTag";
import { useExchangeRate } from "~/components/contexts/ExchangeRateContext";
import { SimpleBounty } from "~/components/Bounty/lib/types";
import BountyInfoSection from "./BountyInfoSection";


const BountyCard = ({
  bounty,
  handleHubClick,
}: {
  bounty: SimpleBounty;
  handleHubClick: Function;
}) => {
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
          <div className={css(styles.action)}>created a grant</div>
        </div>
      </div>

      <div className={css(styles.lineItems)}>
        <div className={css(styles.lineItem)} style={{ marginBottom: -2 }}>
          <div className={css(styles.lineItemLabel)}>Amount:</div>
          <div className={css(styles.lineItemValue)}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  color: colors.ORANGE_DARK2(),
                  fontSize: 14,
                  gap: 5,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ResearchCoinIcon version={4} height={18} width={18} />
                {numeral(
                  formatBountyAmount({
                    amount: bounty.amount,
                  })
                ).format("0,0a")}{" "}
                RSC
              </div>
              <div style={{ color: colors.MEDIUM_GREY2() }}>
                ({rscToUSDDisplay(bounty.amount)})
              </div>
            </div>
          </div>
        </div>
        <div className={css(styles.lineItem)}>
          <div className={css(styles.lineItemLabel)}>Grant type:</div>
          <div className={css(styles.lineItemValue)}>
            {bounty.bountyType === "REVIEW"
              ? "Peer Review"
              : bounty.bountyType === "ANSWER"
                ? "Answer to question"
                : "Uncategorized"}
          </div>
        </div>
        <div className={css(styles.lineItem)}>
          <div className={css(styles.lineItemLabel)}>Expiration date:</div>
          <div className={css(styles.lineItemValue)}>
            {timeToRoundUp(bounty.expirationDate)} remaining
          </div>
        </div>
        <div className={css(styles.lineItem, styles.detailsLineItem)}>
          <div className={css(styles.lineItemLabel)}>Details:</div>
          {bounty.content?.ops && (
            <div className={css(styles.lineItemValue)} style={{ marginTop: 5 }}>
              <CommentReadOnly
                content={bounty.content}
                previewMaxImageLength={1}
                previewMaxCharLength={250}
              />
            </div>
          )}
        </div>
      </div>

      <ALink href={url + "/grants"}>
        <div className={css(styles.paperWrapper)}>
          <div className={css(styles.paperDetails)}>
            <div className={css(styles.iconWrapper, styles.paperIcon)}>
              <PaperIcon
                color="rgba(170, 168, 180, 1)"
                height={24}
                width={24}
                onClick={undefined}
              />
            </div>
            <div>
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

          <div>
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
                    }}
                  >
                    <HubTag
                      preventLinkClick
                      overrideStyle={styles.hubTag}
                      hub={hub}
                      key={hub.id}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </ALink>
      <ALink href={url + "/grants"}>
        <div className={css(styles.answerCTA)}>
          <Button size="small">Answer</Button>
        </div>
      </ALink>
    </div>
  );
};

const styles = StyleSheet.create({
  answerCTA: {
    marginTop: 20,
  },  
  hubTag: {
    cursor: "pointer",
  },
  paperHubs: {
    display: "flex",
    gap: 5,
    marginTop: 10,
    flexWrap: "wrap",
  },
  abstract: {
    fontSize: 15,
    marginTop: 15,
  },  
  paperIcon: {
    [`@media only screen and (max-width: 400px)`]: {
      display: "none",
    },
  },
  paperDetails: {
    display: "flex",
    alignItems: "center",
  },
  paperTitle: {
    fontSize: 16,
  },
  paperAuthors: {
    color: colors.BLACK(0.6),
    fontSize: 13,
    marginTop: 3,
  },
  paperWrapper: {
    display: "flex",
    cursor: "pointer",
    flexDirection: "column",
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
  action: {
    color: colors.BLACK(0.6),
  },
  bounty: {
    border: `1px solid ${colors.LIGHTER_GREY()}`,
    borderRadius: "4px",
    padding: 16,
  },
  bountyHeader: {
    marginBottom: 10,
    fontSize: 14,
  },  
})

export default BountyCard;