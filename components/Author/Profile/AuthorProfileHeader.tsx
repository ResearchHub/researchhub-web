import AuthorHeaderKeyStats from "~/components/Author/Profile/AuthorHeaderKeyStats";
import AuthorInstitutions from "~/components/Author/Profile/AuthorInstitutions";
import AuthorHeaderAchievements from "~/components/Author/Profile/AuthorHeaderAchievements";
import AuthorHeaderExpertise from "~/components/Author/Profile/AuthorHeaderExpertise";
import AuthorSocialMediaIcons from "~/components/Author/Profile/AuthorSocialMediaIcons";
import Avatar from "@mui/material/Avatar";
import { isEmpty } from "~/config/utils/nullchecks";
import { css, StyleSheet } from "aphrodite";
import { FullAuthorProfile, parseFullAuthorProfile } from "../lib/types";
import Pill from "~/components/shared/Pill";
import colors from "~/config/themes/colors";
import { Tooltip } from "@mui/material";
import PendingBadge from "~/components/shared/PendingBadge";
import { authorProfileContext } from "../lib/AuthorProfileContext";
import WelcomeToProfileBanner from "./WelcomeToProfileBanner";
import UserInfoModal from "~/components/Modals/UserInfoModal";
import { useDispatch } from "react-redux";
import { ModalActions } from "~/redux/modals";
import { useEffect } from "react";
import { AuthorActions } from "~/redux/author";
import { fetchAuthorProfile } from "../lib/api";
import useCacheControl from "~/config/hooks/useCacheControl";

const AuthorProfileHeader = () => {
  const dispatch = useDispatch();
  const { fullAuthorProfile: profile, setFullAuthorProfile } =
    authorProfileContext();

  const { revalidateAuthorProfile } = useCacheControl();

  const getExpertiseTooltipContent = () => {
    return (
      <div className={css(styles.expertiseContent)}>
        <div className={css(styles.expertiseContentBody)}>
          The expertise shown below is only an estimate because the author has
          not yet verified the publications in their profile.
        </div>
      </div>
    );
  };

  const onProfileSave = async () => {
    const updatedProfile = await fetchAuthorProfile({
      authorId: profile.id as string,
    });
    const parsedUpdatedProfile = parseFullAuthorProfile(updatedProfile);

    setFullAuthorProfile(parsedUpdatedProfile);
    revalidateAuthorProfile(profile.id);
  };

  useEffect(() => {
    (async () => {
      // This is necessary in order to have author data appear in the "edit profile" modal
      await dispatch(AuthorActions.getAuthor({ authorId: profile.id }));
    })();
  }, []);

  return (
    <div>
      <UserInfoModal onSave={onProfileSave} />
      <div className={css(styles.bannerSection)}>
        <WelcomeToProfileBanner profile={profile} />
      </div>
      <div className={css(styles.bioSection, styles.section)}>
        <Avatar
          src={profile.profileImage}
          sx={{ width: 128, height: 128, fontSize: 48 }}
        >
          {isEmpty(profile.profileImage) &&
            profile.firstName?.[0] + profile.lastName?.[0]}
        </Avatar>
        <div className={css(styles.lineItems)}>
          <div className={css(styles.name)}>
            {profile.firstName} {profile.lastName}
          </div>
          <div className={css(styles.headline)}>{profile.headline}</div>
          <div className={css(styles.inlineLineItem)}>
            <div className={css(styles.label)}>Education:</div>
            {profile.education.map((edu, index) => (
              <div>
                {edu.summary} {index < profile.education.length ? "" : ", "}
              </div>
            ))}
          </div>

          {/* Kobe 07-27-24: Temporarily disabling rendering of new institutions */}
          {/* <div className={css(styles.institutions)}>
            <AuthorInstitutions institutions={profile.institutions} />
          </div> */}

          <div className={css(styles.inlineLineItem)}>
            <div className={css(styles.label)}>About:</div>
            <div className={css(styles.description)}>{profile.description}</div>
          </div>

          <div className={css(styles.authorSocialMedia)}>
            <AuthorSocialMediaIcons profile={profile} />
          </div>
          <div
            className={css(styles.textBtn, styles.editProfileBtn)}
            onClick={() => dispatch(ModalActions.openUserInfoModal(true))}
          >
            Edit profile
          </div>
        </div>
      </div>

      <div className={css(styles.subSections)}>
        <div className={css(styles.section, styles.subSection)}>
          <div className={css(styles.sectionHeader)}>
            Achievements
            <Pill text={String(profile.achievements.length)} />
          </div>
          <AuthorHeaderAchievements profile={profile} />
        </div>

        <div className={css(styles.section, styles.subSection)}>
          <div className={css(styles.sectionHeader)}>Key Stats</div>
          <AuthorHeaderKeyStats profile={profile} />
        </div>

        <div
          className={css(
            styles.section,
            styles.subSection,
            styles.repSubsection,
            !profile.hasVerifiedPublications &&
              styles.expertiseSectionUnverified
          )}
        >
          <div className={css(styles.sectionHeader)}>
            <div>
              {profile.hasVerifiedPublications && (
                <div className={css(styles.expertiseHeader)}>Reputation</div>
              )}
              {!profile.hasVerifiedPublications && (
                <Tooltip
                  title={getExpertiseTooltipContent()}
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontSize: 14,
                        bgcolor: colors.YELLOW2(),
                      },
                    },
                  }}
                >
                  <div
                    className={css(
                      styles.expertiseHeader,
                      styles.expertiseHeaderPending
                    )}
                  >
                    Reputation
                    <PendingBadge />
                  </div>
                </Tooltip>
              )}
            </div>
          </div>
          <AuthorHeaderExpertise profile={profile} />
        </div>
      </div>
    </div>
  );
};
const styles = StyleSheet.create({
  lineItems: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  inlineLineItem: {
    display: "flex",
    columnGap: "5px",
    color: colors.BLACK(0.9),
  },
  label: {
    fontWeight: 500,
    color: colors.BLACK(1.0),
  },
  description: {},
  textBtn: {
    cursor: "pointer",
    color: colors.NEW_BLUE(),
  },
  editProfileBtn: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  repSubsection: {
    display: "flex",
    flexDirection: "column",
  },
  sectionHeader: {
    color: "rgb(139, 137, 148, 1)",
    textTransform: "uppercase",
    fontWeight: 500,
    letterSpacing: "1.2px",
    fontSize: 12,
    display: "flex",
    alignItems: "center",
    gap: 5,
    marginBottom: 20,
    justifyContent: "space-between",
  },
  expertiseHeader: {
    columnGap: "5px",
    display: "flex",
    alignItems: "center",
  },
  expertiseHeaderPending: {
    cursor: "pointer",
  },
  expertiseContentWrapper: {},
  expertiseContent: {},
  expertiseContentTitle: {
    fontSize: 16,
    fontWeight: 500,
    marginBottom: 5,
  },
  expertiseContentBody: {
    fontSize: 14,
  },
  expertiseSectionUnverified: {
    border: `1px solid ${colors.YELLOW2()}`,
    backgroundColor: "rgb(255, 252, 241)",
  },
  repScore: {
    fontWeight: 500,
    fontSize: 15,
    color: colors.BLACK(),
  },
  bannerSection: {
    marginTop: 20,
  },
  authorSocialMedia: {
    marginTop: 10,
  },
  headline: {
    fontSize: 18,
    marginBottom: 10,
    color: colors.BLACK(0.9),
  },
  institutions: {
    marginTop: 10,
  },
  profilePage: {
    width: "1000px",
    margin: "0 auto",
  },
  bioSection: {
    columnGap: "20px",
    display: "flex",
    marginTop: 20,
    position: "relative",
  },
  section: {
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: 20,
    border: "1px solid #F5F5F9",
    padding: 20,
  },
  subSections: {
    display: "flex",
    gap: 20,
    marginTop: 20,
    height: 230,
  },
  subSection: {
    width: "33%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 26,
    fontWeight: 500,
  },
});

export default AuthorProfileHeader;
