import { FullAuthorProfile } from "../lib/types";
import { GoogleScholarIcon, LinkedInIcon, OrcidIcon, XIcon } from "~/config/icons/SocialMediaIcons";
import { css, StyleSheet } from "aphrodite";

const AuthorSocialMediaIcons = ({ profile }: { profile: FullAuthorProfile }) => {
  return (
    <div>
      <OrcidIcon externalUrl={profile.orcidUrl} width={35} height={35} />
      <LinkedInIcon externalUrl={profile.linkedInUrl} width={35} height={35} />
      <XIcon externalUrl={profile.xUrl} width={35} height={35} />
      <GoogleScholarIcon externalUrl={profile.googleScholarUrl} width={35} height={35} />
    </div>
  )
}

const styles = StyleSheet.create({
})

export default AuthorSocialMediaIcons;