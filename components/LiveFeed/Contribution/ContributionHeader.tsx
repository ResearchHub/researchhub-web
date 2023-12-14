import { css, StyleSheet } from "aphrodite";
import {
  BountyContributionItem,
  CommentContributionItem,
  Contribution,
  RscSupportContributionItem,
} from "~/config/types/contribution";
import ContributionAuthor from "./ContributionAuthor";
import { ReactNode } from "react";
import ALink from "~/components/ALink";
import { getUrlToUniDoc } from "~/config/utils/routing";
import colors from "~/config/themes/colors";
import ResearchCoinIcon from "~/components/Icons/ResearchCoinIcon";
import { breakpoints } from "~/config/themes/screen";
import RSCTooltip from "~/components/Tooltips/RSC/RSCTooltip";
import UserTooltip from "~/components/Tooltips/User/UserTooltip";
import CommentAvatars from "~/components/Comment/CommentAvatars";
import { timeSince } from "~/config/utils/dates";
import { parseUser, UnifiedDocument } from "~/config/types/root_types";
import ContentBadge from "~/components/ContentBadge";
import { formatBountyAmount } from "~/config/types/bounty";
import { truncateText } from "~/config/utils/string";
import { COMMENT_TYPES } from "~/components/Comment/lib/types";
import VerifiedBadge from "~/components/Verification/VerifiedBadge";
import GenericMenu from "~/components/shared/GenericMenu";
import {
  faEllipsis,
  faArrowDownToBracket,
} from "@fortawesome/pro-regular-svg-icons";
import IconButton from "~/components/Icons/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FlagButtonV2 from "~/components/Flag/FlagButtonV2";
import { flagGrmContent } from "~/components/Flag/api/postGrmFlag";
import {
  faPen,
  faFlag,
  faBan,
  faUserSlash,
} from "@fortawesome/pro-light-svg-icons";
import ModeratorDeleteButton from "~/components/Moderator/ModeratorDeleteButton";
import { useSelector, useDispatch } from "react-redux";
import { isEmpty } from "~/config/utils/nullchecks";
import { RootState } from "~/redux";
type Args = {
  entry: Contribution;
  context: "live-feed" | "flagging-dashboard";
};

const ContributionHeader = ({ entry, context }: Args) => {
  const { contentType } = entry;
  let { item, hubs } = entry;
  const { createdBy, createdDate } = item;
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );

  let contentBadgeLabel: ReactNode | string;
  let actionLabel = <>{` posted `}</>;
  let unifiedDocument: UnifiedDocument;

  const badge = (
    <ContentBadge
      contentType="bounty"
      bountyAmount={item?.amount}
      badgeContainerOverride={styles.userTooltip}
      size={`small`}
      badgeOverride={styles.badgeOverride}
      label={
        <div style={{ display: "flex", whiteSpace: "pre" }}>
          <div style={{ flex: 1 }}>
            {formatBountyAmount({
              amount: item?.amount,
            })}{" "}
            RSC
          </div>
        </div>
      }
    />
  );

  if (contentType.name === "bounty") {
    item = item as BountyContributionItem;
    unifiedDocument = item.unifiedDocument;

    if (item.parent) {
      actionLabel = (
        <>
          {` contributed `}
          {badge}
          {` to a bounty`}
        </>
      );
    } else {
      actionLabel = (
        <>
          {` opened `}
          {badge}
          {` bounty`}
        </>
      );
    }

    contentBadgeLabel = item.amount + " RSC";
  } else if (contentType.name === "rsc_support") {
    item = item as RscSupportContributionItem;
    contentBadgeLabel = item.amount + " RSC";
    unifiedDocument = item.source.unifiedDocument;

    if (item.source.contentType.name === "comment") {
      actionLabel = (
        <>
          {` was tipped `}
          {badge}
          {" by "}
          <ContributionAuthor authorProfile={item.recipient?.authorProfile} />
          {` for their comment`}
        </>
      );
    } else {
      actionLabel = (
        <>
          {` tipped `}
          <UserTooltip
            createdBy={item.recipient}
            overrideTargetStyle={styles.userTooltip}
            targetContent={
              <ALink
                href={`/user/${item.recipient.authorProfile?.id}/overview`}
                key={`/user/${item.recipient.authorProfile?.id}/overview-key`}
              >
                {item.recipient.firstName} {item.recipient.lastName}
              </ALink>
            }
          />{" "}
          {badge}
          {" for their"}
          <ALink
            overrideStyle={styles.link}
            href={getUrlToUniDoc(item.source.unifiedDocument)}
          >
            {item.source?.contentType.name + " "}
          </ALink>
        </>
      );
    }
  } else if (contentType.name === "comment") {
    item = item as CommentContributionItem;
    unifiedDocument = item.unifiedDocument;

    actionLabel = (
      <>
        {item.postType === COMMENT_TYPES.ANSWER ? (
          <>{` submitted answer `}</>
        ) : item.postType === COMMENT_TYPES.SUMMARY ? (
          <>{` submitted summary `}</>
        ) : item.postType === COMMENT_TYPES.REVIEW ? (
          <>{` peer reviewed `}</>
        ) : (
          <>
            {item.parent ? (
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                {` replied`}
                <UserTooltip
                  createdBy={item.parent.createdBy}
                  overrideTargetStyle={styles.userTooltip}
                  targetContent={
                    <ALink
                      href={`/user/${item.parent.createdBy.authorProfile?.id}/overview`}
                      key={`/user/${item.parent.createdBy.authorProfile?.id}/overview-key`}
                    >
                      {item.parent.createdBy.firstName}{" "}
                      {item.parent.createdBy.lastName}
                    </ALink>
                  }
                />
              </div>
            ) : (
              <>{` commented`}</>
            )}
          </>
        )}
      </>
    );
  } else {
    // @ts-ignore
    actionLabel = <>{` published a ${item?.unifiedDocument?.documentType}`}</>;
  }

  const moreOptionsId = `header-more-options-${entry?.contentType?.name}-${entry?.item?.id}`;
  return (
    <div className={css(styles.header)}>
      <div className={css(styles.avatarWrapper)}>
        <CommentAvatars size={25} people={[createdBy]} withTooltip={true} />
      </div>
      <div className={css(styles.metadataWrapper)}>
        <div className={css(styles.metadataRow)}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              columnGap: "3px",
              flexWrap: "wrap",
            }}
          >
            <UserTooltip
              createdBy={createdBy}
              overrideTargetStyle={styles.userTooltip}
              targetContent={
                <ALink
                  href={`/user/${createdBy.authorProfile?.id}/overview`}
                  key={`/user/${createdBy.authorProfile?.id}/overview-key`}
                >
                  {createdBy.authorProfile.firstName}{" "}
                  {createdBy.authorProfile.lastName}
                </ALink>
              }
            />
            {createdBy.authorProfile.isVerified && (
              <VerifiedBadge height={18} width={18} />
            )}
            {actionLabel}
            <span className={css(styles.dot)}>•</span>
            {
              <div className={css(styles.secondaryText, styles.date)}>
                {timeSince(item.createdDate)}
              </div>
            }
            {/* @ts-ignore */}
            {unifiedDocument && (
              <>
                <span className={css(styles.dot)}>•</span>
                <span className={css(styles.unifiedDocument)}>
                  <ALink
                    overrideStyle={styles.link}
                    href={getUrlToUniDoc(unifiedDocument)}
                  >
                    {truncateText(unifiedDocument?.document?.title, 50)}
                  </ALink>
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      {context === "live-feed" && (
        <div
          className={css(styles.moreOptionsBtnWrapper)}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <GenericMenu
            softHide={true}
            options={[
              {
                preventDefault: true,
                value: "flag",
                html: (
                  <FlagButtonV2
                    modalHeaderText="Flag Content"
                    errorMsgText="Failed to flag"
                    successMsgText="Content flagged"
                    primaryButtonLabel="Flag"
                    subHeaderText="I am flagging this content because of:"
                    onSubmit={(
                      flagReason,
                      renderErrorMsg,
                      renderSuccessMsg
                    ) => {
                      let args: any = {
                        flagReason,
                        onError: renderErrorMsg,
                        onSuccess: renderSuccessMsg,
                      };

                      let item = entry.item;
                      const unifiedDocument: UnifiedDocument =
                        // @ts-ignore
                        item.unifiedDocument;

                      if (entry.contentType.name === "comment") {
                        item = item as CommentContributionItem;
                        args = {
                          ...args,
                          contentType: unifiedDocument.documentType,
                          commentPayload: {
                            commentID: item.id,
                            commentType: "comment",
                          },
                        };
                      }

                      if (
                        ["paper", "post", "question"].includes(
                          unifiedDocument.documentType
                        )
                      ) {
                        args = {
                          contentType: unifiedDocument.documentType,
                          // @ts-ignore
                          contentID: unifiedDocument.document.id,
                          ...args,
                        };
                      } else {
                        console.error(
                          `${entry.contentType.name} Not supported for flagging`
                        );
                        return false;
                      }

                      flagGrmContent(args);
                    }}
                  >
                    <div style={{ display: "flex", width: "100%" }}>
                      <div style={{ width: 30, boxSizing: "border-box" }}>
                        <FontAwesomeIcon icon={faFlag} />
                      </div>
                      <div>Flag content</div>
                    </div>
                  </FlagButtonV2>
                ),
              },
              ...(currentUser && currentUser.moderator
                ? [
                    {
                      preventDefault: true,
                      value: "ban-user",
                      html: (
                        <ModeratorDeleteButton
                          actionType="user"
                          isModerator={true}
                          containerStyle={styles.moderatorButton}
                          icon={
                            <FontAwesomeIcon
                              icon={faUserSlash}
                            ></FontAwesomeIcon>
                          }
                          iconStyle={styles.moderatorIcon}
                          labelStyle={styles.moderatorLabel}
                          label="Ban User"
                          metaData={{
                            authorId: entry.item?.createdBy?.authorProfile?.id,
                            isSuspended: false,
                          }}
                        />
                      ),
                    },
                  ]
                : []),
            ]}
            width={200}
            id={moreOptionsId}
            direction="bottom-right"
          >
            <IconButton overrideStyle={styles.moreOptionsBtn} variant="round">
              <FontAwesomeIcon fontSize={22} icon={faEllipsis} />
            </IconButton>
          </GenericMenu>
        </div>
      )}
    </div>
  );
};

const styles = StyleSheet.create({
  moreOptionsBtnWrapper: {
    marginLeft: "auto",
  },
  moderatorButton: {
    width: "100%",
  },
  moderatorLabel: {
    color: colors.RED(),
  },
  moderatorIcon: {
    width: 30,
  },
  moreOptionsBtn: {
    border: "none",
    color: colors.BLACK(0.6),
    ":hover": {
      background: colors.NEW_BLUE(0.1),
      color: colors.NEW_BLUE(1),
      transition: "0.3s",
    },
  },
  dot: {
    fontSize: 16,
    marginLeft: 3,
    marginRight: 3,
  },
  header: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 0,
    width: "100%",
    // @ts-ignore
    whiteSpace: "break-spaces",
  },
  userTooltip: {
    display: "inline-flex",
  },
  unifiedDocument: {
    fontWeight: 500,
    color: colors.BLACK(),
    ":hover": {
      color: colors.NEW_BLUE(),
    },
  },
  metadataWrapper: {
    display: "flex",
    width: "100%",
    alignItems: "center",

    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      flexDirection: "column",
      alignItems: "unset",
    },
  },
  badgeOverride: {
    marginRight: 0,

    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginRight: 0,
    },
  },
  avatarWrapper: {
    marginTop: 0,
    paddingRight: 10,
    marginLeft: 0,
  },
  metadataRow: {
    color: colors.BLACK(0.6),
    display: "flex",
    flexWrap: "wrap",
    // flex: 1,
    lineHeight: "1.5em",
    whiteSpace: "pre-wrap",
  },
  contentBadge: {
    marginTop: 10,
    marginLeft: "0px",
    opacity: 1,
    display: "flex",
    [`@media only screen and (max-width: ${breakpoints.xsmall.str})`]: {
      display: "none",
    },
  },
  secondaryText: {
    color: colors.BLACK(0.6),
  },
  date: {
    display: "flex",
    alignItems: "flex-start",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginLeft: 0,
      fontSize: 14,
    },
  },
  overrideSubmittedBy: {
    alignItems: "unset",
  },
  link: {
    fontWeight: 400,
  },
  rsc: {
    color: colors.ORANGE_DARK2(),
  },
  rscIcon: {
    verticalAlign: "text-top",
  },
});

export default ContributionHeader;
