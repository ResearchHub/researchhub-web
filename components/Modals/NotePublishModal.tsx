import API from "~/config/api";
import BaseModal from "~/components/Modals/BaseModal";
import Button from "~/components/Form/Button";
import CheckBox from "~/components/Form/CheckBox";
import Collapsible from "~/components/Form/Collapsible";
import FormSelect from "../Form/FormSelect";
import Modal from "react-modal";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { Helpers } from "@quantfive/js-web-config";
import { MessageActions } from "~/redux/message";
import { ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";
import { captureEvent } from "~/config/utils/events";
import { connect } from "react-redux";
import { fetchOrgUsers } from "~/config/fetch";
import { useRouter } from "next/router";

type FormFields = {
  authors: any[];
  hubs: any[];
};

type FormError = {
  authors: boolean;
  hubs: boolean;
};

function validateFormField(fieldID: string, value: any): boolean {
  let result: boolean = true;
  switch (fieldID) {
    case "authors":
    case "hubs":
      return value && value.length > 0;
    default:
      return result;
  }
}

export type NotePublishModalProps = {
  currentOrganization: any;
  currentUser: any;
  getEditorContent: any;
  isOpen: boolean;
  setIsOpen: (flag: boolean) => void;
  setMessage: any;
  showMessage: any;
};

function NotePublishModal({
  currentOrganization,
  currentUser,
  getEditorContent,
  isOpen,
  setIsOpen,
  setMessage,
  showMessage,
}: NotePublishModalProps): ReactElement<typeof Modal> {
  const router = useRouter();
  const [formErrors, setFormErrors] = useState<FormError>({
    authors: true,
    hubs: true,
  });
  const [mutableFormFields, setMutableFormFields] = useState<FormFields>({
    authors: [],
    hubs: [],
  });
  const [checkBoxOne, setCheckBoxOne] = useState(false);
  const [checkBoxTwo, setCheckBoxTwo] = useState(false);
  const [isPost, setIsPost] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orgUsers, setOrgUsers] = useState([]);
  const [shouldDisplayError, setShouldDisplayError] = useState<boolean>(false);
  const [suggestedHubs, setSuggestedHubs] = useState([]);

  useEffect(() => {
    fetch(API.HUB({ pageLimit: 1000 }), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((resp) => {
        /* @ts-ignore */
        let hubs = resp.results
          .map((hub, index) => {
            return {
              ...hub,
              value: hub.id,
              label: hub.name.charAt(0).toUpperCase() + hub.name.slice(1),
            };
          })
          .sort((a, b) => {
            return a.label.localeCompare(b.label);
          });
        setSuggestedHubs(hubs);
      });
  }, []);

  useEffect(() => {
    const fetchAndSetOrgUsers = async () => {
      try {
        const response = await fetchOrgUsers({ orgId: currentOrganization.id });
        /* @ts-ignore */
        const orgUsers = response.admins
          /* @ts-ignore */
          .concat(response.members)
          .map((user) => {
            return {
              label:
                user.author_profile.first_name +
                " " +
                user.author_profile.last_name,
              value: user.id,
            };
          });
        setOrgUsers(orgUsers);
      } catch (error) {
        setMessage("Failed to fetch data");
        showMessage({ show: true, error: true });
        captureEvent({
          error,
          msg: "Failed to fetch org users",
          data: { currentOrganization },
        });
      }
    };

    if (currentOrganization) {
      fetchAndSetOrgUsers();
    }
  }, [currentOrganization]);

  const closeModal = (e: SyntheticEvent): void => {
    e && e.preventDefault();
    setIsOpen(false);
    setShouldDisplayError(false);
    setIsPost(true);
    setFormErrors({
      authors: true,
      hubs: true,
    });
    setMutableFormFields({
      authors: [],
      hubs: [],
    });
    setCheckBoxOne(false);
    setCheckBoxTwo(false);
  };

  const handlePost = (e: SyntheticEvent) => {
    e.preventDefault();
    if (Object.values(formErrors).some((el: boolean): boolean => el)) {
      setShouldDisplayError(true);
    } else {
      setShouldDisplayError(false);
      setIsSubmitting(true);

      sendPost(false)
        .then((response) => {
          /* @ts-ignore */
          const { id, slug } = response;
          router.push(`/${isPost ? "post" : "hypothesis"}/${id}/${slug}`);
        })
        .catch((err) => setIsSubmitting(false));
    }
  };

  const sendPost = (draft: boolean) => {
    const editorContent = getEditorContent();
    const params = {
      admins: null,
      authors: mutableFormFields.authors.map((author) => author.value),
      created_by: currentUser.id,
      document_type: isPost ? "DISCUSSION" : "HYPOTHESIS",
      editors: null,
      full_src: editorContent.full_src,
      hubs: mutableFormFields.hubs.map((hub) => hub.id),
      is_public: !draft,
      preview_img: null,
      renderable_text: "",
      title: editorContent.title,
      viewers: null,
    };

    return fetch(
      isPost ? API.RESEARCHHUB_POSTS({}) : API.HYPOTHESIS({}),
      API.POST_CONFIG(params)
    )
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON);
  };

  const handleOnChangeFields = (fieldID: string, value: string): void => {
    setMutableFormFields({ ...mutableFormFields, [fieldID]: value });
    setFormErrors({
      ...formErrors,
      [fieldID]: !validateFormField(fieldID, value),
    });
    setShouldDisplayError(false);
  };

  return (
    <BaseModal
      closeModal={closeModal}
      isOpen={isOpen}
      modalStyle={styles.modalStyle}
      title={"Publish to ResearchHub"}
    >
      <div className={css(styles.rootContainer)}>
        <form>
          <div className={css(styles.postTypeContainer)}>
            <div className={css(styles.label)}>Select post type:</div>
            <CheckBox
              active={isPost}
              isSquare={false}
              label={"Post"}
              labelStyle={null}
              onChange={() => setIsPost(true)}
              onClickLabel
            />
            <CheckBox
              active={!isPost}
              isSquare={false}
              label={"Hypothesis"}
              labelStyle={null}
              onChange={() => setIsPost(false)}
              onClickLabel
            />
          </div>
          <FormSelect
            containerStyle={[styles.chooseHub]}
            error={
              shouldDisplayError &&
              formErrors.authors &&
              `Please select at least one author`
            }
            errorStyle={styles.errorText}
            id="authors"
            inputStyle={
              shouldDisplayError && formErrors.authors && styles.error
            }
            isMulti={true}
            label="Authors"
            labelStyle={styles.label}
            menu={styles.dropDown}
            onChange={handleOnChangeFields}
            options={orgUsers}
            placeholder="Add authors"
            required
          />
          <FormSelect
            containerStyle={[styles.chooseHub]}
            error={
              shouldDisplayError &&
              formErrors.hubs &&
              `Please select at least one hub`
            }
            errorStyle={styles.errorText}
            id="hubs"
            inputStyle={shouldDisplayError && formErrors.hubs && styles.error}
            isMulti={true}
            label="Hubs"
            labelStyle={styles.label}
            menu={styles.dropDown}
            onChange={handleOnChangeFields}
            options={suggestedHubs}
            placeholder="Choose hubs to publish in"
            required
          />
          {/*<div className={css(styles.label)}>Choose cover image</div>
          <p>
            Make this post more inviting to readers by including a cover photo
          </p>*/}
          <Collapsible
            className={css(styles.collapsibleSection)}
            contentInnerClassName={css(styles.collapsibleContent)}
            open={isOpen}
            openedClassName={css(styles.collapsibleSection)}
            trigger={
              <div className={css(styles.trigger, styles.label)}>
                Guidelines for {isPost ? "posts" : "hypotheses"}
                <span className={css(styles.chevronDown)}>
                  {icons.chevronDownLeft}
                </span>
              </div>
            }
          >
            {isPost ? (
              <ul>
                <li>Ask a scientific question</li>
                <li>Share a theory or hypothesis</li>
                <li>Publish a research output</li>
              </ul>
            ) : (
              <ul>
                <li>
                  Make a hypothesis -- a proposed explanation for an observation
                </li>
                <li>
                  After you create the hypothesis, add relevant papers to
                  support or reject the hypothesis
                </li>
              </ul>
            )}
          </Collapsible>
          <div className={css(styles.checkboxContainer)}>
            <CheckBox
              active={checkBoxOne}
              isSquare
              label={"I have adhered to the ResearchHub posting guidelines."}
              labelStyle={styles.label}
              onChange={() => setCheckBoxOne(!checkBoxOne)}
            />
          </div>
          <div className={css(styles.checkboxContainer)}>
            <CheckBox
              active={checkBoxTwo}
              isSquare
              label={"This post is original and not published work."}
              labelStyle={styles.label}
              onChange={() => setCheckBoxTwo(!checkBoxTwo)}
            />
          </div>
          <div className={css(styles.buttonsContainer)}>
            <div
              className={css(
                (!checkBoxOne || !checkBoxTwo) && styles.disabledCursor
              )}
            >
              <Button
                customButtonStyle={styles.buttonStyle}
                disabled={isSubmitting || !checkBoxOne || !checkBoxTwo}
                isWhite={false}
                label={"Publish"}
                onClick={handlePost}
              />
            </div>
          </div>
        </form>
      </div>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  modalStyle: {
    top: "25%",
    transform: "translateX(-50%)",
    width: "min(80vw, 525px)",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "100%",
    },
  },
  rootContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: 40,
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      overflowY: "auto",
      padding: "40px 10px",
    },
  },
  chooseHub: {
    maxWidth: "468px",
    minHeight: "55px",
    marginBottom: "21px",
  },
  titleInputContainer: {
    maxWidth: "851px",
    height: "55px",
    marginBottom: "35px",
  },
  label: {
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "21px",
  },
  collapsibleSection: {
    color: "#000000",
    fontSize: "18px",
    fontWeight: 500,
    lineHeight: "21px",
    margin: "20px 0px",
  },
  collapsibleContent: {
    color: "#241F3A",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: "normal",
    lineHeight: "26px",
    marginLeft: "3px",
    maxWidth: 400,
  },
  chevronDown: {
    marginLeft: "auto",
  },
  trigger: {
    display: "flex",
    cursor: "pointer",
  },
  buttonsContainer: {
    width: "auto",
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "auto",
      justifyContent: "center",
    },
  },
  buttonStyle: {
    width: "160px",
    height: "50px",
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      width: "160px",
      height: "50px",
    },
  },
  dropDown: {
    zIndex: 999,
  },
  error: {
    border: `1px solid ${colors.RED(1)}`,
  },
  errorText: {
    marginTop: "5px",
  },
  postTypeContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  checkboxContainer: {
    margin: "10px 0px",
  },
  disabledCursor: {
    cursor: "not-allowed",
  },
});

const mapStateToProps = (state) => ({
  currentUser: state.auth.user,
});
const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(NotePublishModal);
