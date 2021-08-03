import { css, StyleSheet } from "aphrodite";
import PropTypes from "prop-types";
import numeral from "numeral";
import { get, isEmpty } from "underscore";

import { createUserSummary } from "~/config/utils";
import AuthorAvatar from "~/components/AuthorAvatar";
import colors, { genericCardColors } from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import icons from "~/config/themes/icons";
import Link from "next/link";

const UserCard = ({ authorProfile, reputation }) => {
  const getName = (authorProfile) =>
    `${get(authorProfile, "first_name", "")} ${get(
      authorProfile,
      "last_name",
      ""
    )}`;

  const userSummary = createUserSummary(authorProfile);

  return (
    <div className={css(styles.container)}>
      <Link
        href={"/user/[authorId]/[tabName]"}
        as={`/user/${authorProfile.id}/overview`}
      >
        <a className={css(styles.linkWrapper)}>
          <AuthorAvatar
            author={authorProfile}
            name={name}
            disableLink={true}
            size={35}
          />
          <div className={css(styles.details)}>
            <div
              className={css(
                styles.name,
                isEmpty(userSummary) && styles.withoutSummary
              )}
            >
              {getName(authorProfile)}
            </div>
            {userSummary && (
              <div className={css(styles.summary)}>
                <span className={css(styles.eduIcon)}>
                  {icons.graduationCap}
                </span>
                {userSummary}
              </div>
            )}
            {reputation > 0 && (
              <div className={css(styles.reputationForMobile)}>
                <img
                  className={css(styles.logoIcon)}
                  src="/static/ResearchHubIcon.png"
                />
                Lifetime Reputation: {numeral(reputation).format("0,0")}
              </div>
            )}
          </div>
          {reputation > 0 && (
            <div className={css(styles.reputation)}>
              <img
                className={css(styles.logoIcon)}
                src="/static/ResearchHubIcon.png"
              />
              {numeral(reputation).format("0,0")}
            </div>
          )}
        </a>
      </Link>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  linkWrapper: {
    border: `1px solid ${genericCardColors.BORDER}`,
    display: "flex",
    padding: 15,
    cursor: "pointer",
    background: "white",
    borderRadius: 2,
    color: colors.BLACK(),
    textDecoration: "none",
    ":hover": {
      backgroundColor: genericCardColors.BACKGROUND,
    },
  },
  details: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 15,
    gap: 8,
  },
  name: {
    fontSize: 20,
    color: colors.BLACK(),
    fontWeight: 500,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 16,
    },
  },
  withoutSummary: {
    marginTop: 8,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      marginTop: 8,
    },
  },
  eduIcon: {
    color: colors.GREY(),
    marginRight: 5,
  },
  summary: {
    color: colors.BLACK(0.6),
    lineHeight: "22px",
    marginRight: 25,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 12,
      lineHeight: "18px",
      marginRight: 0,
    },
  },
  reputation: {
    fontWeight: 500,
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "none",
    },
  },
  reputationForMobile: {
    display: "none",
    fontWeight: 500,
    color: colors.BLACK(0.9),
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "block",
      fontSize: 12,
    },
  },
  logoIcon: {
    width: 13,
    height: 20,
    marginRight: 5,
    marginTop: -3,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: 10,
      height: 16,
      marginRight: 10,
      verticalAlign: -2,
    },
  },
});

UserCard.propTypes = {
  authorProfile: PropTypes.object,
  reputation: PropTypes.number.isRequired,
};

export default UserCard;
