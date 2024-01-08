import React, { ReactElement, cloneElement, useEffect, useState } from "react";
import BaseModal from "../Modals/BaseModal";
import { css, StyleSheet } from "aphrodite";
import { ID } from "~/config/types/root_types";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import { fetchFundraiseContributionsApi } from "./api/contributions";
import { Purchase } from "~/config/types/purchase";
import { captureEvent } from "~/config/utils/events";
import CommentAvatars from "../Comment/CommentAvatars";
import UserTooltip from "../Tooltips/User/UserTooltip";
import ALink from "../ALink";
import colors from "~/config/themes/colors";
import Button from "../Form/Button";
import { RectShape, RoundShape } from "react-placeholder/lib/placeholders";
import { formatBountyAmount } from "~/config/types/bounty";

export type ContributorsModalProps = {
  triggerComponent: ReactElement;
  totalContributors?: number;
  fundraiseId: ID;
};

const FundraiseContributorsModal = ({
  triggerComponent,
  totalContributors,
  fundraiseId,
}: ContributorsModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [contributors, setContributors] = useState<Purchase[]>([]);
  const [isFetchingContributions, setIsFetchingContributions] = useState(false);

  // Add onClick handler to triggerComponent
  const triggerComponentWithOnClick = cloneElement(triggerComponent, {
    onClick: (e) => {
      // we explicitly stop propagation so that if this component is used in a
      // card, the card doesn't also open.
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      setIsOpen(true);
    },
  });

  useEffect(() => {
    if (!isNullOrUndefined(fundraiseId) && isOpen) {
      handleFetchContributions();
    }
  }, [isOpen]);

  const handleFetchContributions = async () => {
    setIsFetchingContributions(true);
    try {
      const { contributions } = await fetchFundraiseContributionsApi({
        fundraiseId,
      });

      // group by user/profile, and just sum the amounts
      const groupedContributions: Record<string, Purchase> =
        contributions.reduce((acc, curr) => {
          const key = curr.createdBy.authorProfile.id;
          if (isNullOrUndefined(key)) {
            return acc;
          }
          if (acc[key!]) {
            acc[key!].amount += curr.amount;
          } else {
            acc[key!] = curr;
          }
          return acc;
        }, {});

      const contributionsArr = Object.values(groupedContributions);
      setContributors(contributionsArr);
    } catch (error) {
      captureEvent({
        error,
        msg: "Failed to fetch votes",
        data: { document },
      });
    } finally {
      setIsFetchingContributions(false);
    }
  };

  return (
    <>
      {triggerComponentWithOnClick}
      <BaseModal
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        modalStyle={styles.modalStyle}
        modalContentStyle={styles.modalContentStyle}
        title={
          <div className={css(styles.title)}>
            {!isNullOrUndefined(totalContributors)
              ? `${totalContributors} Supporter${
                  totalContributors !== 1 ? "s" : ""
                }`
              : `Supporters`}
          </div>
        }
      >
        <div className={css(styles.contributors)}>
          {isFetchingContributions && (
            <div
              className={
                css(placeholderStyles.wrapper) + " show-loading-animation"
              }
            >
              <div className={css(placeholderStyles.header)}>
                <RoundShape
                  className={css(placeholderStyles.avatar)}
                  color={colors.PLACEHOLDER_CARD_BACKGROUND}
                />
                <div className={css(placeholderStyles.detailsWrapper)}>
                  <RectShape
                    color={colors.PLACEHOLDER_CARD_BACKGROUND}
                    style={{ width: "80%", height: "1em" }}
                  />
                  <RectShape
                    color={colors.PLACEHOLDER_CARD_BACKGROUND}
                    style={{ width: "70%", height: "1em" }}
                  />
                </div>
              </div>
              <div className={css(placeholderStyles.header)}>
                <RoundShape
                  className={css(placeholderStyles.avatar)}
                  color={colors.PLACEHOLDER_CARD_BACKGROUND}
                />
                <div className={css(placeholderStyles.detailsWrapper)}>
                  <RectShape
                    color={colors.PLACEHOLDER_CARD_BACKGROUND}
                    style={{ width: "80%", height: "1em" }}
                  />
                  <RectShape
                    color={colors.PLACEHOLDER_CARD_BACKGROUND}
                    style={{ width: "70%", height: "1em" }}
                  />
                </div>
              </div>
            </div>
          )}
          {!isFetchingContributions &&
            contributors.map((c, i) => (
              <div key={c.createdBy.id} className={css(styles.contributor)}>
                <div className={css(styles.contributorLeft)}>
                  <CommentAvatars people={[c.createdBy]} withTooltip={true} />
                  <UserTooltip
                    createdBy={c.createdBy}
                    targetContent={
                      <ALink
                        href={`/user/${c.createdBy.authorProfile?.id}/overview`}
                        key={`/user/${c.createdBy.authorProfile?.id}/overview-key`}
                      >
                        {c.createdBy.authorProfile.firstName}
                        {c.createdBy.authorProfile.lastName && " "}
                        {c.createdBy.authorProfile.lastName}
                      </ALink>
                    }
                  />
                </div>
                <div className={css(styles.contributorRight)}>
                  {formatBountyAmount({
                    amount: c.amount,
                    withPrecision: false,
                  })}{" "}
                  RSC
                </div>
              </div>
            ))}
          {contributors.length === 0 && !isFetchingContributions && (
            <div className={css(placeholderStyles.emptyText)}>
              No supporters yet. Be the first!
            </div>
          )}
        </div>
        <div className={css(styles.buttonContainer)}>
          <Button
            label="Close"
            variant="contained"
            fullWidth
            onClick={(e) => {
              if (e) {
                e.preventDefault();
                e.stopPropagation();
              }
              setIsOpen(false);
            }}
            customButtonStyle={styles.buttonStyle}
          />
        </div>
      </BaseModal>
    </>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    maxWidth: 450,
    width: "100%",
    "@media only screen and (min-width: 768px)": {
      width: 450,
    },
  },
  modalContentStyle: {
    padding: "40px 32px 32px",
    maxWidth: 500,
    "@media only screen and (max-width: 767px)": {
      padding: 40,
      minWidth: "unset",
      width: "calc(100% - 40px)",
      margin: "0 auto",
    },
    "@media only screen and (max-width: 415px)": {
      paddingTop: 50,
    },
  },

  title: {
    fontSize: 24,
    width: "100%",
    textAlign: "left",
  },

  contributors: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    width: "100%",
    borderTop: colors.GREY_BORDER,
    marginTop: 24,
    maxHeight: 244,
    overflowY: "auto",
  },
  contributor: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  contributorLeft: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  contributorRight: {
    fontSize: 16,
    fontWeight: 500,
    color: colors.ORANGE_LIGHT2(),
  },

  buttonContainer: {
    marginTop: 28,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
  },
  buttonStyle: {
    maxWidth: 120,
  },
});

const placeholderStyles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    minHeight: 37,
  },
  avatar: {
    height: 30,
    width: 30,
  },
  detailsWrapper: {
    marginLeft: 8,
    display: "flex",
    flexDirection: "column",
    rowGap: 6,
    fontSize: 10,
    width: "100%",
  },
  body: {
    marginTop: 16,
    fontSize: 15,
    display: "flex",
    flexDirection: "column",
    rowGap: 8,
  },

  emptyText: {
    fontSize: 14,
    fontWeight: 400,
    color: colors.MEDIUM_GREY2(),
    marginTop: 24,
  },
});

export default FundraiseContributorsModal;
