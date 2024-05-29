import { FullAuthorProfile } from "../lib/types";
import { GoogleScholarIcon, LinkedInIcon, OrcidIcon, XIcon } from "~/config/icons/SocialMediaIcons";
import { css, StyleSheet } from "aphrodite";

const AuthorSocialMediaIcons = ({ profile }: { profile: FullAuthorProfile }) => {
  return (
    <div className={css(styles.iconsWrapper)}>
      <OrcidIcon externalUrl={profile.orcidUrl} width={25} height={25} />
      <LinkedInIcon externalUrl={profile.linkedInUrl} width={25} height={25} />
      <XIcon externalUrl={profile.xUrl} width={25} height={25} />
      <GoogleScholarIcon externalUrl={profile.googleScholarUrl} width={25} height={25} />
    </div>
  )
}

const styles = StyleSheet.create({
  iconsWrapper: {
    display: "flex",
    columnGap: "10px",
  }
})

export default AuthorSocialMediaIcons;