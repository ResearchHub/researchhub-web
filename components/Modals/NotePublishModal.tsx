import API from "~/config/api";
import BaseModal from "~/components/Modals/BaseModal";
import Button from "~/components/Form/Button";
import CheckBox from "~/components/Form/CheckBox";
import FormSelect from "../Form/FormSelect";
import Modal from "react-modal";
import colors from "~/config/themes/colors";
import { AuthActions } from "~/redux/auth";
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

function getDefaultAuthors(currentNote: any, currentUser: any): any {
  const { authors } = currentNote.post || {};
  const currentAuthor = currentUser.author_profile || {};
  return (
    authors?.map((author) => {
      return {
        label: author.first_name + " " + author.last_name,
        value: author.id,
      };
    }) ?? [
      {
        label: currentAuthor.first_name + " " + currentAuthor.last_name,
        value: currentAuthor.id,
      },
    ]
  );
}

function getDefaultHubs(currentNote: any): any {
  const { hubs } = currentNote.post || {};
  return (
    hubs?.map((hub) => {
      return {
        label: hub.name,
        value: hub.id,
      };
    }) ?? []
  );
}

const getPublishedType = (currentNote: any): string => {
  if (currentNote.post) {
    return "DISCUSSION";
  }
  return "UNPUBLISHED";
};

const CROSSREF_DOI_RSC_FEE = 5;

export type NotePublishModalProps = {
  currentNote: any;
  currentOrganization: any;
  currentUser: any;
  getEditorContent: any;
  isOpen: boolean;
  setIsOpen: (flag: boolean) => void;
  setMessage: any;
  showMessage: any;
  updateUser: any;
};

function NotePublishModal({
  currentNote,
  currentOrganization,
  currentUser,
  getEditorContent,
  isOpen,
  setIsOpen,
  setMessage,
  showMessage,
  updateUser,
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
  const [authorOptions, setAuthorOptions] = useState([]);
  const [hubOptions, setHubOptions] = useState([]);
  const [checkBoxGuidelines, setCheckBoxGuidelines] = useState(false);
  const [checkBoxDOI, setCheckBoxDOI] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [shouldDisplayError, setShouldDisplayError] = useState<boolean>(false);
  const isPublished = Boolean(currentNote.post);

  useEffect(() => {
    try {
      fetch(API.HUB({ pageLimit: 1000 }), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((resp) => {
          /* @ts-ignore */
          const hubs = resp.results
            .map((hub, index) => {
              return {
                value: hub.id,
                label: hub.name,
              };
            })
            .sort((a, b) => {
              return a.label.localeCompare(b.label);
            });
          setHubOptions(hubs);
        });
    } catch (error) {
      setMessage("Failed to fetch data");
      showMessage({ show: true, error: true });
      captureEvent({
        error,
        msg: "Failed to fetch hubs in publish modal",
      });
    }
  }, []);

  useEffect(() => {
    const fetchAndSetAuthors = async () => {
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
              value: user.author_profile.id,
            };
          });
        setAuthorOptions(orgUsers);
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
      fetchAndSetAuthors();
    }
  }, [currentOrganization]);

  useEffect(() => {
    setFormErrors({
      authors: !validateFormField(
        "authors",
        getDefaultAuthors(currentNote, currentUser)
      ),
      hubs: !validateFormField("hubs", getDefaultHubs(currentNote)),
    });
    setMutableFormFields({
      authors: getDefaultAuthors(currentNote, currentUser),
      hubs: getDefaultHubs(currentNote),
    });
  }, [currentNote, isOpen]);

  const closeModal = (e: SyntheticEvent): void => {
    e && e.preventDefault();
    setIsOpen(false);
    setShouldDisplayError(false);
    setCheckBoxGuidelines(false);
    setCheckBoxDOI(false);
  };

  const handlePost = (e: SyntheticEvent) => {
    e.preventDefault();
    if (Object.values(formErrors).some((el: boolean): boolean => el)) {
      setShouldDisplayError(true);
    } else {
      setShouldDisplayError(false);
      setIsSubmitting(true);

      sendPost()
        .then((response) => {
          /* @ts-ignore */
          const { id, slug } = response;
          if (checkBoxDOI) {
            let param = {
              balance: currentUser.balance - CROSSREF_DOI_RSC_FEE,
            };
            updateUser(param);
          }
          router.push(`/post/${id}/${slug}`);
        })
        .catch((err) => {
          if (err.response.status === 402) {
            setMessage("Not enough coins in balance");
            showMessage({ show: true, error: true });
          }
          setIsSubmitting(false);
        });
    }
  };

  const sendPost = () => {
    const editorContent = getEditorContent();
    const publishedType = getPublishedType(currentNote);

    let params;
    if (publishedType === "UNPUBLISHED") {
      params = {
        assign_doi: checkBoxDOI,
        authors: mutableFormFields.authors.map((author) => author.value),
        document_type: "DISCUSSION",
        full_src: editorContent.full_src,
        hubs: mutableFormFields.hubs.map((hub) => hub.value),
        note_id: currentNote.id,
        preview_img: null,
        renderable_text: "",
        title: editorContent.title,
      };
    } else {
      params = {
        assign_doi: checkBoxDOI,
        authors: mutableFormFields.authors.map((author) => author.value),
        document_type: "DISCUSSION",
        full_src: editorContent.full_src,
        hubs: mutableFormFields.hubs.map((hub) => hub.value),
        post_id: currentNote.post.id,
        preview_img: null,
        renderable_text: "",
        title: editorContent.title,
      };
    }

    return fetch(API.RESEARCHHUB_POSTS({}), API.POST_CONFIG(params))
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
      title={
        isPublished ? "Republish to ResearchHub" : "Publish to ResearchHub"
      }
    >
      <div className={css(styles.rootContainer)}>
        <form>
          <FormSelect
            containerStyle={[styles.chooseHub, isPublished && styles.marginTop]}
            defaultValue={getDefaultAuthors(currentNote, currentUser)}
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
            options={authorOptions}
            placeholder="Add authors"
            required
          />
          <FormSelect
            containerStyle={[styles.chooseHub]}
            defaultValue={getDefaultHubs(currentNote)}
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
            options={hubOptions}
            placeholder="Choose hubs to publish in"
            required
          />
          <div className={css(styles.label)}>Guidelines for posts</div>
          <ul className={css(styles.guidelinesContent)}>
            <li>Stick to academically appropriate topics</li>
            <li>
              Focus on presenting objective results and remain unbiased in your
              commentary
            </li>
            <li>
              Be respectful of differing opinions, viewpoints, and experiences
            </li>
            <li>Do not plagiarize any content, keep it original</li>
          </ul>
          <div className={css(styles.checkboxContainer)}>
            <CheckBox
              active={checkBoxGuidelines}
              isSquare
              label={"I have adhered to the ResearchHub posting guidelines"}
              labelStyle={styles.label}
              onChange={() => setCheckBoxGuidelines(!checkBoxGuidelines)}
            />
          </div>
          {!currentNote.post?.doi && (
            <div className={css(styles.checkboxContainer)}>
              <CheckBox
                active={checkBoxDOI}
                isSquare
                label={
                  <div className={css(styles.checkBoxDOI)}>
                    <span>
                      [Optional] Assign a DOI to this post for{" "}
                      {CROSSREF_DOI_RSC_FEE}
                    </span>
                    <img
                      src={"/static/icons/coin-filled.png"}
                      draggable={false}
                      className={css(styles.coinIcon)}
                      alt="RSC Coin"
                    />
                    <span>RSC</span>
                  </div>
                }
                labelStyle={styles.label}
                onChange={() => setCheckBoxDOI(!checkBoxDOI)}
              />
            </div>
          )}
          <div className={css(styles.buttonsContainer)}>
            <div className={css(!checkBoxGuidelines && styles.disabledCursor)}>
              <Button
                customButtonStyle={styles.buttonStyle}
                disabled={isSubmitting || !checkBoxGuidelines}
                isWhite={false}
                label={isPublished ? "Republish" : "Publish"}
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
    width: "min(80vw, 525px)",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      width: "100%",
    },
  },
  rootContainer: {
    display: "flex",
    justifyContent: "center",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      overflowY: "auto",
      padding: "40px 10px",
    },
  },
  chooseHub: {
    marginBottom: 21,
    maxWidth: 468,
    minHeight: 55,
  },
  marginTop: {
    marginTop: 40,
  },
  titleInputContainer: {
    height: 55,
    marginBottom: 35,
    maxWidth: 851,
  },
  label: {
    fontSize: 16,
    fontWeight: 500,
  },
  guidelinesContent: {
    color: "#241F3A",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "normal",
    lineHeight: "26px",
    marginBottom: 20,
    maxWidth: 400,
  },
  chevronDown: {
    marginLeft: "auto",
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: 30,
    width: "auto",
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      justifyContent: "center",
      width: "auto",
    },
  },
  buttonStyle: {
    height: 50,
    width: 160,
  },
  dropDown: {
    zIndex: 999,
  },
  error: {
    border: `1px solid ${colors.RED(1)}`,
  },
  errorText: {
    marginTop: 5,
  },
  checkboxContainer: {
    margin: "10px 0px",
  },
  disabledCursor: {
    cursor: "not-allowed",
  },
  checkBoxDOI: {
    bottom: 3,
    position: "relative",
  },
  coinIcon: {
    borderRadius: "50%",
    height: 20,
    margin: "0px 6px",
    position: "relative",
    top: 4,
  },
});

const mapStateToProps = (state) => ({
  currentUser: state.auth.user,
});
const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  setMessage: MessageActions.setMessage,
  updateUser: AuthActions.updateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(NotePublishModal);
