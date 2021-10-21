import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import BaseModal from "~/components/Modals/BaseModal";
import { StyleSheet, css } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";
import FormInput from "~/components/Form/FormInput";
import Button from "~/components/Form/Button";
import { createOrg, updateOrgDetails } from "~/config/fetch";
import { MessageActions } from "~/redux/message";
import { connect } from "react-redux";
import ManageOrgUsers from "./ManageOrgUsers";
import OrgCoverImgModal from "./OrgCoverImgModal";
import { Helpers } from "@quantfive/js-web-config";
import colors, { formColors } from "~/config/themes/colors";
import OrgAvatar from "~/components/Org/OrgAvatar";
import icons from "~/config/themes/icons";
import { captureError } from "~/config/utils/error";

const STEPS = {
  ORG_NAME: 1,
  ORG_INVITE: 2,
  ORG_IMG: 3,
};

const NewOrgModal = ({
  closeModal,
  showMessage,
  setMessage,
  onOrgChange,
  isOpen = false,
}) => {
  const router = useRouter();
  const [orgName, setOrgName] = useState("");
  const [flowStep, setFlowStep] = useState(STEPS.ORG_NAME);
  const [org, setOrg] = useState(null);
  const [isAvatarUploadOpen, setIsAvatarUploadOpen] = useState(false);

  const handleCloseModal = () => {
    setFlowStep(STEPS.ORG_NAME);
    setOrg(null);
    setOrgName("");
    closeModal();
  };

  const onImgSaveSuccess = (updatedOrg) => {
    if (typeof onOrgChange === "function") {
      onOrgChange(updatedOrg, "UPDATE");
    }
    setOrg(updatedOrg);
    setIsAvatarUploadOpen(false);
  };

  const goToPrevStep = () => {
    if (flowStep > STEPS.ORG_NAME) {
      setFlowStep(flowStep - 1);
    }
  };

  const goToOrg = () => {
    router.push(`/${org.slug}/notebook`);
    handleCloseModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let response;
    let mode = "CREATE";
    try {
      if (org /* Edit mode */) {
        mode = "UPDATE";
        response = await updateOrgDetails({
          orgId: org.id,
          params: {
            name: orgName,
          },
        });
      } else {
        response = await createOrg({ name: orgName });
      }

      if (response.ok) {
        const _org = await Helpers.parseJSON(response);
        setOrg(_org);

        onOrgChange(_org, mode);
        setFlowStep(STEPS.ORG_INVITE);
      } else if (response.status === 409) {
        setMessage("Organization name already in use. Try a different name.");
        showMessage({ show: true, error: true });
      } else {
        throw new Error("Org creation error");
      }
    } catch (error) {
      setMessage("Failed to create org");
      showMessage({ show: true, error: true });
      captureError({
        error,
        msg: "Failed to create organization",
        data: { org, orgName, flowStep },
      });
    }
  };

  const buildHtmlForStepOrgName = () => {
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.subtitle)}>
          Step 1: Pick a name for your organization
        </div>
        <div className={css(styles.progressBar)}>
          <div
            className={css(
              styles.progressBarFill,
              styles.progressBarForStepOrgName
            )}
          ></div>
        </div>
        <div className={css(styles.imgContainer)}>
          <div className={css(styles.stepImage)}>
            <Image
              src="/static/org/new-org.png"
              layout={"fill"}
              objectFit={"contain"}
            />
          </div>
        </div>
        <form className={css(styles.form)} onSubmit={(e) => handleSubmit(e)}>
          <FormInput
            label="Organization Name"
            id="org-name-input"
            required={true}
            onChange={(id, val) => setOrgName(val)}
            containerStyle={null}
            value={orgName}
            inputStyle={styles.inputStyle}
          />
          <div className={css(styles.buttonContainer)}>
            <Button
              type="submit"
              customButtonStyle={styles.button}
              label="Next"
            ></Button>
          </div>
        </form>
      </div>
    );
  };

  const buildHtmlForStepOrgInvite = () => {
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.subtitle)}>
          Step 2: Invite users to collaborate
        </div>
        <div className={css(styles.progressBar)}>
          <div
            className={css(
              styles.progressBarFill,
              styles.progressBarForStepOrgInvite
            )}
          ></div>
        </div>
        <div className={css(styles.imgContainer)}>
          <div className={css(styles.stepImage, styles.stepImageForOrgInvite)}>
            <Image
              src="/static/org/invite-to-org.png"
              layout={"fill"}
              objectFit={"contain"}
            />
          </div>
        </div>
        <div className={css(styles.manageUsersContainer)}>
          <ManageOrgUsers org={org} />
        </div>
        <div className={css(styles.bottomButtons)}>
          <div className={css(styles.prevStepButton)} onClick={goToPrevStep}>
            <span>
              {icons.chevronLeft}{" "}
              <span className={css(styles.previousStepText)}>
                Previous Step
              </span>
            </span>
          </div>
          <div className={css(styles.buttonContainer)}>
            <Button
              customButtonStyle={styles.button}
              label="Next"
              onClick={() => setFlowStep(STEPS.ORG_IMG)}
            ></Button>
          </div>
        </div>
      </div>
    );
  };

  const buildHtmlForStepOrgImage = () => {
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.subtitle)}>Step 3: Upload a cover image</div>
        <div className={css(styles.progressBar)}>
          <div
            className={css(
              styles.progressBarFill,
              styles.progressBarForStepOrgImage
            )}
          ></div>
        </div>
        <div
          className={css(styles.imgContainer)}
          onClick={() => setIsAvatarUploadOpen(true)}
        >
          {org?.cover_image ? (
            <div className={css(styles.orgAvatarContainer)}>
              <OrgAvatar org={org} size={160} fontSize={28} />
            </div>
          ) : (
            <div className={css(styles.stepImage, styles.stepImageForOrgImg)}>
              <Image
                src="/static/org/org-img.png"
                layout={"fill"}
                objectFit={"contain"}
              />
            </div>
          )}
        </div>
        <div className={css(styles.setCoverImgContainer)}>
          {isAvatarUploadOpen && (
            <OrgCoverImgModal
              onSuccess={onImgSaveSuccess}
              orgId={org.id}
              closeModal={() => setIsAvatarUploadOpen(false)}
            />
          )}
        </div>
        <div className={css(styles.bottomButtons)}>
          <div className={css(styles.prevStepButton)} onClick={goToPrevStep}>
            <span>
              {icons.chevronLeft}{" "}
              <span className={css(styles.previousStepText)}>
                Previous Step
              </span>
            </span>
          </div>
          <Button
            customButtonStyle={styles.goToOrgButton}
            label="Create Organization"
            rippleClass={styles.buttonContainer}
            onClick={goToOrg}
          ></Button>
        </div>
      </div>
    );
  };

  const modalBody = (
    <div className={css(styles.body)}>
      {flowStep === STEPS.ORG_NAME
        ? buildHtmlForStepOrgName()
        : flowStep === STEPS.ORG_INVITE
        ? buildHtmlForStepOrgInvite()
        : flowStep === STEPS.ORG_IMG
        ? buildHtmlForStepOrgImage()
        : null}
    </div>
  );

  return (
    <BaseModal
      children={modalBody}
      closeModal={handleCloseModal}
      isOpen={isOpen}
      title={"Create Organization"}
    />
  );
};

const styles = StyleSheet.create({
  body: {
    minWidth: 500,
    maxWidth: 800,
    marginTop: 30,
  },
  manageUsersContainer: {
    marginTop: 30,
    marginBottom: 30,
  },
  setCoverImgContainer: {
    marginBottom: 30,
  },
  inputStyle: {
    textAlign: "left",
  },
  subtitle: {
    marginBottom: 20,
    color: colors.BLACK(0.6),
  },
  progressBar: {
    height: 4,
  },
  progressBarFill: {
    backgroundColor: colors.GREEN(),
    height: "100%",
  },
  progressBarForStepOrgName: {
    width: "33%",
  },
  progressBarForStepOrgInvite: {
    width: "66%",
  },
  progressBarForStepOrgImage: {
    width: "100%",
  },
  imgContainer: {
    backgroundColor: formColors.INPUT,
    textAlign: "center",
    paddingTop: 20,
    boxSizing: "border-box",
    height: 200,
  },
  stepImage: {
    height: 140,
    position: "relative",
    marginTop: 10,
  },
  stepImageForOrgInvite: {
    height: 165,
    marginTop: 0,
  },
  stepImageForOrgImg: {
    height: 130,
    marginTop: 10,
    cursor: "pointer",
  },
  orgAvatarContainer: {
    display: "flex",
    justifyContent: "center",
    cursor: "pointer",
  },
  bottomButtons: {
    display: "flex",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  prevStepButton: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    cursor: "pointer",
    color: colors.BLUE(),
    marginRight: "auto",
  },
  previousStepText: {
    marginLeft: 10,
  },
  button: {
    width: 150,
    paddingLeft: 20,
    paddingRight: 20,
    marginLeft: "auto",
  },
  goToOrgButton: {
    width: "auto",
    paddingLeft: 20,
    paddingRight: 20,
    marginLeft: "auto",
  },
});

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewOrgModal);
