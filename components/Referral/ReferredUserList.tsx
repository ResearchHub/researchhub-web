import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css, StyleSheet } from "aphrodite";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { captureEvent } from "~/config/utils/events";
import { useEffect, useState } from "react";
import AuthorAvatar from "../AuthorAvatar";
import EmptyState from "~/components/Placeholders/EmptyState";
import ReactPlaceholder from "react-placeholder/lib";
import LeaderboardPlaceholder from "~/components/Placeholders/LeaderboardPlaceholder";
import colors from "~/config/themes/colors";
import { formatDateStandard } from "~/config/utils/dates";
import { breakpoints } from "~/config/themes/screen";
import dayjs from "dayjs";

const fetchReferredUsersAPI = ({ onSuccess }) => {
  return fetch(API.REFERRED_USERS(), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res: any): void => onSuccess({ res }))
    .catch((error) => {
      captureEvent({
        error,
        msg: "Failed to fetch referred users",
      });
    });
};

const ReferredUserList = () => {
  const [referredUsers, setReferredUsers] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchReferredUsersAPI({
      onSuccess: ({ res }) => {
        setReferredUsers(res);
        setIsFetching(false);
      },
    });
  }, []);

  const rscEarned = referredUsers.reduce(
    (total: number, current: any) => total + (current.rsc_earned || 0),
    0
  );

  const referredUserList = referredUsers.map((referredUser: any) => {
    const expireDate = dayjs(referredUser.benefits_expire_on);
    const now = dayjs();
    const didExpire = now > expireDate;

    return (
      <div className={css(styles.user)} key={`user-${referredUser.id}`}>
        <div>
          <AuthorAvatar author={referredUser.author_profile} />
        </div>
        <div className={css(styles.userDetails)}>
          <span className={css(styles.userName)}>
            {referredUser.author_profile.first_name}{" "}
            {referredUser.author_profile.last_name}
          </span>
          {didExpire ? (
            <span className={css(styles.didExpire)}>
              {"Joined on "}
              {formatDateStandard(referredUser.created_date)}
            </span>
          ) : (
            <span className={css(styles.willExpire)}>
              {"Joined on "}
              {formatDateStandard(referredUser.created_date)}
            </span>
          )}
        </div>
        <div className={css(styles.userRscEarned)}>
          {referredUser?.rsc_earned > 0 ? (
            <span className={css(styles.yesEarnings)}>
              +{referredUser.rsc_earned} RSC
            </span>
          ) : (
            <span className={css(styles.noEarnings)}>0 RSC</span>
          )}
        </div>
      </div>
    );
  });

  return (
    <div>
      <h2 className={css(styles.earnTitle)}>
        You've Earned <span className={css(styles.rsc)}> {rscEarned} RSC</span>
      </h2>
      <h3 className={css(styles.invitedUsersTitle)}>Invited users</h3>
      <ReactPlaceholder
        ready={!isFetching}
        // @ts-ignore
        customPlaceholder={<LeaderboardPlaceholder color="#efefef" />}
      >
        {referredUsers.length === 0 ? (
          <div>
            <EmptyState
              text={"You haven't invited any friends yet"}
              icon={
                <img
                  className={css(styles.emptyState)}
                  src={"/static/referrals/second-step.svg"}
                ></img>
              }
            />
          </div>
        ) : (
          <div>{referredUserList}</div>
        )}
      </ReactPlaceholder>
    </div>
  );
};

const styles = StyleSheet.create({
  user: {
    display: "flex",
    alignItems: "center",
    columnGap: "10px",
    paddingBottom: 15,
  },
  userRscEarned: {
    color: colors.ORANGE_DARK2(1.0),
    marginLeft: "auto",
  },
  willExpire: {
    fontSize: 13,
    color: colors.BLACK(),
  },
  didExpire: {
    fontSize: 13,
    color: colors.MEDIUM_GREY(),
  },
  userDetails: {
    display: "flex",
    flexDirection: "column",
  },
  userName: {
    fontWeight: 500,
  },
  noEarnings: {
    color: colors.BLACK(1.0),
  },
  yesEarnings: {
    color: colors.ORANGE_DARK2(1.0),
  },
  emptyState: {
    marginBottom: 16,
  },
  rsc: {
    color: colors.ORANGE_DARK2(1.0),
  },
  invitedFriendsSection: {
    margin: "0 auto",
    paddingBottom: 50,
  },
  earnTitle: {
    textAlign: "center",
    marginTop: 105,
    fontSize: 33,
    fontWeight: 500,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 26,
    },
  },
  invitedUsersTitle: {
    fontWeight: 500,
    fontSize: 18,
    borderBottom: `1px solid ${colors.GREY_LINE()}`,
    paddingBottom: 15,
    marginTop: 50,
  },
});

export default ReferredUserList;
