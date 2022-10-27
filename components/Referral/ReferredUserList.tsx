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


const fetchReferredUsersAPI = ({ onSuccess }) => {
  return fetch(
    API.REFERRED_USERS(),
    API.GET_CONFIG(),
  )
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((res: any): void => onSuccess({ res }))
    .catch((error) => {
      captureEvent({
        error,
        msg: "Failed to fetch referred users"
      });
    });
}

const ReferredUserList = () => {
  const [referredUsers, setReferredUsers] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchReferredUsersAPI({
      onSuccess: ({ res }) => {
        setReferredUsers(res);
        setIsFetching(false);
      }
    })
  },[]);

  const rscEarned = referredUsers.reduce((total:number, current:any) => total + current.rsc_earned, 0)

  console.log('referred', referredUsers)

  return (
    <div>
      <h2 className={css(styles.earnTitle)}>
        You've Earned{" "}
        <span className={css(styles.rsc)}> {rscEarned} RSC</span>
      </h2>
      <h3 className={css(styles.invitedUsersTitle)}>Invited users</h3>
      <ReactPlaceholder
        ready={!isFetching}
        // @ts-ignore
        customPlaceholder={<LeaderboardPlaceholder color="#efefef" />}
      >
        {referredUsers.length === 0
        ? (
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
          <div>
            {referredUsers.map((referredUser:any) => (
              <div className={css(styles.user)} key={`user-${referredUser.user.id}`}>
                <div>
                  <AuthorAvatar author={referredUser.user.author_profile} />
                </div>
                <div className={css(styles.userDetails)}>
                  <span className={css(styles.userName)}>{referredUser.user.author_profile.first_name} {referredUser.user.author_profile.last_name}</span>
                  <span className={css(styles.expire)}>Referral earnings expire on {formatDateStandard(referredUser.benefits_expire_on)}</span>
                </div>
                <div className={css(styles.userRscEarned)}>
                  {referredUser.rsc_earned === 0
                    ? <span className={css(styles.noEarnings)}>0</span>
                    : <span className={css(styles.yesEarnings)}>+{referredUser.rsc_earned}</span>
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </ReactPlaceholder>


    </div>
  )
}

const styles = StyleSheet.create({
  user: {
    display: "flex",
    alignItems: "center",
    columnGap: "10px",
  },
  userRscEarned: {
    color: colors.ORANGE_DARK2(1.0),
    marginLeft: "auto",
  },
  expire: {
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
    }
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