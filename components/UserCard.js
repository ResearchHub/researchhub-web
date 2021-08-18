import { css, StyleSheet } from "aphrodite";
import PropTypes from "prop-types";
import numeral from "numeral";
import { get, isEmpty } from "underscore";
import Ripples from "react-ripples";
import { useRouter } from "next/router";

import { createUserSummary } from "~/config/utils/user";
import AuthorAvatar from "~/components/AuthorAvatar";
import colors, { genericCardColors } from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import icons from "~/config/themes/icons";

const UserCard = ({ authorProfile, reputation, styleVariation }) => {
  const router = useRouter();

  const goToProfile = (id) => {
    router.push("/user/[authorId]/[tabName]", `/user/${id}/overview`);
  };

  const getName = (authorProfile) =>
    `${get(authorProfile, "first_name", "")} ${get(
      authorProfile,
      "last_name",
      ""
    )}`;

  const userSummary = createUserSummary(authorProfile);

  return (
    <Ripples
      className={css(styles.card, styleVariation && styles[styleVariation])}
      key={`person-${authorProfile.id}`}
      onClick={() => goToProfile(authorProfile.id)}
    >
      <div className={css(styles.detailsWrapper)}>
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
              <span className={css(styles.eduIcon)}>{icons.graduationCap}</span>
              {userSummary}
            </div>
          )}
        </div>
      </div>
      {reputation > 0 && (
        <div className={css(styles.reputation)}>
          <img
            className={css(styles.logoIcon)}
            src="/static/ResearchHubIcon.png"
          />
          <span className={css(styles.lifetimeText)}>
            Lifetime reputation:{" "}
          </span>
          {numeral(reputation).format("0,0")}
        </div>
      )}
    </Ripples>
  );
};

const styles = StyleSheet.create({
  card: {
    border: `1px solid ${genericCardColors.BORDER}`,
    display: "flex",
    padding: 15,
    marginBottom: 10,
    cursor: "pointer",
    background: "white",
    borderRadius: 2,
    ":hover": {
      backgroundColor: genericCardColors.BACKGROUND,
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "block",
    },
  },
  noBorderVariation: {
    border: 0,
    borderBottom: `1px solid ${genericCardColors.BORDER}`,
    marginBottom: 0,
    marginTop: 0,
    ":last-child": {
      borderBottom: 0,
    },
  },
  detailsWrapper: {
    textDecoration: "none",
    color: colors.BLACK(),
    display: "flex",
    flexDirection: "row",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 15,
    gap: 8,
    justifyContent: "center",
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
    display: "flex",
    marginRight: 25,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 13,
      lineHeight: "18px",
      marginRight: 0,
    },
  },
  lifetimeText: {
    display: "none",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      display: "block",
    },
  },
  reputation: {
    fontWeight: 500,
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    color: colors.BLACK(0.9),
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      fontSize: 13,
      marginLeft: 45,
      marginTop: 5,
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
  styleVariation: PropTypes.string,
};

export default UserCard;
