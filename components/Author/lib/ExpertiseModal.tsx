import BaseModal from "~/components/Modals/BaseModal";
import { FullAuthorProfile } from "../lib/types";
import ReputationGauge from "../lib/ReputationGauge";
import { css, StyleSheet } from "aphrodite";

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
        <div className={css(styles.points)}>
          <span className={css(styles.label)}>Total points:</span> {profile.reputation.score.toLocaleString()}
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
  points: {

  },
  label: {
    fontWeight: 500,
  },
  reputationHubLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  reputationWrapper: {
    width: "100%",
    marginTop: 30,
  },
  modalStyle: {

  },
  modalContentStyle: {
    padding: "40px 30px 30px 30px",
  }

})

export default ExpertiseModal;