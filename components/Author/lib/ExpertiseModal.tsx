import BaseModal from "~/components/Modals/BaseModal";
import { FullAuthorProfile } from "../lib/types";
import ReputationGauge from "../lib/ReputationGauge";
import { css, StyleSheet } from "aphrodite";
import ALink from "~/components/ALink";
import colors from "~/config/themes/colors";

const ExpertiseModal = ({ profile, isModalOpen = true, handleModalClose }: {
  profile: FullAuthorProfile;
  isModalOpen: boolean;
  handleModalClose: () => void;
}) => {

  return (
    <BaseModal
      offset={"0px"}
      isOpen={isModalOpen}
      closeModal={handleModalClose}
      zIndex={1000000001}
      modalStyle={styles.modalStyle}
      modalContentStyle={styles.modalContentStyle}
      title={`Expertise of ${profile.firstName} ${profile.lastName}`}
    >
      <div className={css(styles.reputationWrapper)}>
        <div className={css(styles.description)}>
          Below is the full hub-specific reputation of {profile.firstName} {profile.lastName}.
          Reputation is based on a variety of factors including upvotes and citations. <ALink target="_blank" overrideStyle={styles.link} theme="linkThemeDefault" href="/">Learn more about our reputation algorithm</ALink>
        </div>
        {profile.reputationList.map((rep, index) => (
          <div className={css(styles.reputation)}>
            <div className={css(styles.reputationHubLabel)}>{rep.hub.name}</div>
            <ReputationGauge reputation={rep} key={`reputation-` + index} />
          </div>
        ))}
      </div>

    </BaseModal>
  );
};

const styles = StyleSheet.create({
  reputation: {
    marginTop: 10,
  },
  description: {
    marginBottom: 40,
  },
  link: {
    color: colors.NEW_BLUE(),
    textDecoration: "underline",
  },
  label: {
    fontWeight: 500,
  },
  reputationHubLabel: {
    fontSize: 14,
    marginBottom: 5,
    textTransform: "capitalize",
  },
  reputationWrapper: {
    width: "100%",
    marginTop: 30,
  },
  modalStyle: {
    width: 600,
  },
  modalContentStyle: {
    padding: "40px 30px 30px 30px",
  }

})

export default ExpertiseModal;