import { css, StyleSheet } from "aphrodite";
import { FullAuthorProfile } from "../lib/types";
import Button from "~/components/Form/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/pro-light-svg-icons";
import ResearchCoinIcon from "~/components/Icons/ResearchCoinIcon";
import ContentBadge from "~/components/ContentBadge";

const AuthorClaimProfileNotification = ({ profile }: { profile: FullAuthorProfile }) => {
  return (
    <div className={css(styles.rootWrapper)}>
      <div>
        <div className={css(styles.header)}>
          <FontAwesomeIcon icon={faCircleExclamation} />
          Unclaimed Profile
        </div>
        <div className={css(styles.descriptionWrapper)}>
          Are you {profile.firstName} {profile.lastName}?
          Claim this profile and receive&nbsp;
          <ContentBadge
            badgeOverride={styles.badge}
            contentType="bounty"
            bountyAmount={10000}
            label="10,000 RSC" />
        </div>
      </div>
      <div>
        <Button size="small" customButtonStyle={styles.btn}>Claim Profile</Button>
      </div>
    </div>
  )
}

const styles = StyleSheet.create({
  rootWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btn: {
    fontWeight: 400,
    fontSize: 14,
    padding: "5px 15px",
    borderRadius: 6,
  },
  header: {
    display: "flex",
    alignItems: "center",
    fontWeight: 500,
    gap: 10,
  },
  descriptionWrapper: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
  },
  rscIcon: {

  },
  badge: {
    borderRadius: "6px",
    fontWeight: 400,
    marginLeft: 5,
    fontSize: 14,
  },
  rscTextWrapper: {
    display: "inline-flex",
    alignItems: "center",
  }
})

export default AuthorClaimProfileNotification;