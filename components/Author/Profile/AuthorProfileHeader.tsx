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
import { Tooltip } from "@mui/material";
import PendingBadge from "~/components/shared/PendingBadge";
import { authorProfileContext } from "../lib/AuthorProfileContext";


const AuthorProfileHeader = () => {
  const {
    fullAuthorProfile: profile,
  } = authorProfileContext();

  const getExpertiseTooltipContent = () => {
    return (
      <div className={css(styles.expertiseContent)}>
        <div className={css(styles.expertiseContentBody)}>The expertise shown below is only an estimate because the author has not yet verified the publications in their profile.</div>
      </div>      
    )    
  }
  
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

        <div className={css(styles.section, styles.subSection, !profile.hasVerifiedPublications && styles.expertiseSectionUnverified)}>
          <div className={css(styles.sectionHeader)}>
            <div>
              {profile.hasVerifiedPublications && (
                <div className={css(styles.expertiseHeader)}>
                  Reputation
                </div>
              )}
              {!profile.hasVerifiedPublications &&
                <Tooltip title={getExpertiseTooltipContent()} componentsProps={{
                  tooltip: {
                    sx: {
                      fontSize: 14,
                      bgcolor: colors.YELLOW2(),
                    },
                  },
                }}>
                  <div className={css(styles.expertiseHeader, styles.expertiseHeaderPending)}>
                    Reputation
                    <PendingBadge />
                  </div>
                </Tooltip>                
              }
            </div>
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
  expertiseHeader: {
    columnGap: "5px",
    display: "flex",
    alignItems: "center",
  },
  expertiseHeaderPending: {
    cursor: "pointer",
  },
  expertiseContentWrapper: {
  },
  expertiseContent: {
  },
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