import { FullAuthorProfile } from "../lib/types";
import { GoogleScholarIcon, LinkedInIcon, OrcidIcon, XIcon } from "~/config/icons/SocialMediaIcons";
import { css, StyleSheet } from "aphrodite";
import Link from "next/link";

const AuthorSocialMediaIcons = ({ profile }: { profile: FullAuthorProfile }) => {
console.log(profile.xUrl)
  return (
    <div className={css(styles.iconsWrapper)}>
      {profile.orcidUrl ? (
        <Link href={profile.orcidUrl} target="_blank">
          <OrcidIcon externalUrl={profile.orcidUrl} width={25} height={25} />
        </Link>
      ) : (
        <OrcidIcon externalUrl={profile.orcidUrl} width={25} height={25} />
      )}      
      {profile.linkedInUrl ? (
        <Link href={profile.linkedInUrl} target="_blank">
          <LinkedInIcon externalUrl={profile.linkedInUrl} width={25} height={25} />
        </Link>
      ) : (
        <LinkedInIcon externalUrl={profile.linkedInUrl} width={25} height={25} />
      )}
      {profile.xUrl ? (
        <Link href={profile.xUrl} target="_blank">
          <XIcon externalUrl={profile.xUrl} width={25} height={25} />
        </Link>
      ) : (
        <XIcon externalUrl={profile.xUrl} width={25} height={25} />
      )}
      {profile.googleScholarUrl ? (
        <Link href={profile.googleScholarUrl} target="_blank">
          <GoogleScholarIcon externalUrl={profile.googleScholarUrl} width={25} height={25} />
        </Link>
      ) : (
        <GoogleScholarIcon externalUrl={profile.googleScholarUrl} width={25} height={25} />
      )}      
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