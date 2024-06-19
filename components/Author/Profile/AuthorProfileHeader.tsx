import AuthorHeaderKeyStats from "~/components/Author/Profile/AuthorHeaderKeyStats";
import AuthorInstitutions from "~/components/Author/Profile/AuthorInstitutions";
import AuthorHeaderAchievements from "~/components/Author/Profile/AuthorHeaderAchievements";
import AuthorHeaderExpertise from "~/components/Author/Profile/AuthorHeaderExpertise";
import AuthorSocialMediaIcons from "~/components/Author/Profile/AuthorSocialMediaIcons";
import Avatar from "@mui/material/Avatar";
import { isEmpty } from "~/config/utils/nullchecks";
import { css, StyleSheet } from "aphrodite";
import { FullAuthorProfile } from "../lib/types";
import AuthorClaimProfileNotification from "~/components/Author/Profile/AuthorClaimProfileNotification";
import Pill from "~/components/shared/Pill";
import colors from "~/config/themes/colors";

const AuthorProfileHeader = ({ profile }: { profile: FullAuthorProfile }) => {
  return (
    <div>
      <div className={css(styles.section, styles.claimSection)}>
        <AuthorClaimProfileNotification profile={profile} />
      </div>
      <div className={css(styles.bioSection, styles.section)}>
        <Avatar src={profile.profileImage} sx={{ width: 128, height: 128, fontSize: 48 }}>
          {isEmpty(profile.profileImage) && profile.firstName?.[0] + profile.lastName?.[0]}
        </Avatar>

        <div>
          <div className={css(styles.name)}>{profile.firstName} {profile.lastName}</div>
          <div className={css(styles.headline)}>{profile.headline}</div>

          <div className={css(styles.institutions)}>
            <AuthorInstitutions institutions={profile.institutions} />
          </div>

          <div>{profile.description}</div>

          <div className={css(styles.authorSocialMedia)}>
            <AuthorSocialMediaIcons profile={profile} />
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
          <div className={css(styles.sectionHeader)}>
            Key Stats
          </div>
          <AuthorHeaderKeyStats profile={profile} />
        </div>

        <div className={css(styles.section, styles.subSection)}>
          <div className={css(styles.sectionHeader)}>
            Expertise
            <div className={css(styles.repScore)}>{profile.reputation.score.toLocaleString()}</div>
          </div>          
          <AuthorHeaderExpertise profile={profile} />
        </div>
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
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
  repScore: {
    fontWeight: 500,
    fontSize: 15,
    color: colors.BLACK()
  },
  claimSection: {
    marginTop: 20,
    backgroundColor: "rgb(240, 240, 240)",
  },
  authorSocialMedia: {
    marginTop: 10,
  },
  headline: {
    marginTop: 10,
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
  },
  name: {
    fontSize: 26,
    fontWeight: 500,
  },
});

export default AuthorProfileHeader;