import API from "~/config/api";
import BaseModal from "~/components/Modals/BaseModal";
import Button from "~/components/Form/Button";
import Modal from "react-modal";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { AUTH_TOKEN } from "~/config/constants";
import { Helpers } from "@quantfive/js-web-config";
import { ReactElement, SyntheticEvent, useEffect, useRef, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";
import { useRouter } from "next/router";

export type NoteTemplateModalProps = {
  currentOrganizationId: number;
  isOpen: boolean;
  setIsOpen: (flag: boolean) => void;
  refetchNotes: any;
  setRefetchNotes: any;
};

export default function NoteTemplateModal({
  currentOrganizationId,
  isOpen,
  setIsOpen,
  refetchNotes,
  setRefetchNotes,
}: NoteTemplateModalProps): ReactElement<typeof Modal> {
  const router = useRouter();
  const editorRef = useRef<any>();
  const { CKEditor, Editor } = editorRef.current || {};
  const [fetched, setFetched] = useState(false);
  const [hideNotes, setHideNotes] = useState(false);
  const [selected, setSelected] = useState(0);
  const [templates, setTemplates] = useState([]);
  const [templateContents, setTemplateContents] = useState({});
  const [editorInstance, setEditorInstance] = useState(null);

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      Editor: require("@thomasvu/ckeditor5-custom-build").SimpleInlineEditor,
    };
  }, []);

  useEffect(() => {
    fetch(API.NOTE_TEMPLATE(), API.GET_CONFIG())
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((data) => {
        const fetchedTemplates = {};
        for (const template of data.results) {
          fetchedTemplates[template.id.toString()] = template;
        }
        setTemplateContents(fetchedTemplates);
        setTemplates(data.results);
        setSelected(data.results[0].id);
        setFetched(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const closeModal = (e: SyntheticEvent): void => {
    e && e.preventDefault();
    setIsOpen(false);
  };

  const handleUseThisTemplate = (e: SyntheticEvent): void => {
    const noteParams = {
      organization: currentOrganizationId,
      title: editorInstance?.plugins.get("Title").getTitle() || "Untitled",
    };
    fetch(API.NOTE({}), API.POST_CONFIG(noteParams))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
      .then((note) => {
        const noteContentParams = {
          full_src: templateContents[selected].src,
          plain_text: "",
          note: note.id,
        };
        return fetch(API.NOTE_CONTENT(), API.POST_CONFIG(noteContentParams));
      }).then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then((data) => {
          setRefetchNotes(!refetchNotes);
          router.push(`/notebook/${router.query.orgName}/${data.note}`);
        });

    e && e.preventDefault();
    closeModal(e);
  };

  const toggleSidebarSection = () => {
    setHideNotes(!hideNotes);
  };

  const handleInput = (editor) => {};

  const editorConfiguration = {
    simpleUpload: {
      // The URL that the images are uploaded to.
      uploadUrl: API.SAVE_IMAGE,

      // Headers sent along with the XMLHttpRequest to the upload server.
      headers: {
        Authorization:
          "Token " +
          (typeof window !== "undefined"
            ? window.localStorage[AUTH_TOKEN]
            : ""),
      },
    },
  };

  return (
    <BaseModal
      closeModal={closeModal}
      isOpen={isOpen}
      modalStyle={styles.modalStyle}
      removeDefault={true}
    >
      <div className={css(styles.rootContainer)}>
        <div className={css(styles.editorContainer)}>
          {fetched && (
            <CKEditor
              config={editorConfiguration}
              data={templateContents[selected].src}
              editor={Editor}
              onChange={(event, editor) => handleInput(editor)}
              onReady={(editor) => {
                setEditorInstance(editor);
                editor.editing.view.change((writer) => {
                  writer.setStyle(
                    "min-height",
                    "200px",
                    editor.editing.view.document.getRoot()
                  );
                });
              }}
            />
          )}
        </div>
        <div className={css(styles.sidebar)}>
          <div className={css(styles.buttonContainer)}>
            <Button
              customButtonStyle={styles.buttonCustomStyle}
              customLabelStyle={styles.buttonLabel}
              label={<div className={css(styles.buttonLabel)}>Use this template</div>}
              onClick={handleUseThisTemplate}
              rippleClass={styles.rippleClass}
            />
          </div>
          <div
            className={css(styles.sidebarSection, hideNotes && styles.showBottomBorder)}
            onClick={toggleSidebarSection}
          >
            Academic
            <span className={css(styles.chevronIcon)}>
              {hideNotes ? icons.chevronDown : icons.chevronUp}
            </span>
          </div>
          {!hideNotes && (
            <div>
              {templates.map(template => (
                <div
                  className={css(
                    styles.sidebarSectionContent,
                    template.id === selected && styles.active,
                  )}
                  key={template.id}
                  onClick={() => setSelected(template.id)}
                >
                  {template.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  editorContainer: {
    marginRight: "max(min(16%, 300px), 240px)",
    maxWidth: breakpoints.xlarge.int,
    width: "80vw",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      marginRight: 0,
    },
  },
  sidebar: {
    background: "#f9f9fc",
    borderLeft: `1px solid ${colors.GREY(0.3)}`,
    borderRadius: "0px 5px 5px 0px",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    maxWidth: 300,
    minWidth: 240,
    position: "fixed",
    right: 0,
    top: 0,
    width: "16%",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      display: "none",
    },
  },
  sidebarSection: {
    borderTop: `1px solid ${colors.GREY(0.3)}`,
    color: colors.BLACK(),
    cursor: "pointer",
    display: "flex",
    fontSize: 18,
    fontWeight: 500,
    padding: 20,
    userSelect: "none",
  },
  sidebarSectionContent: {
    color: colors.BLACK(0.7),
    cursor: "pointer",
    display: "flex",
    fontSize: 14,
    fontWeight: 500,
    padding: "8px 20px",
    textDecoration: "none",
    userSelect: "none",
    wordBreak: "break-word",
    ":hover": {
      backgroundColor: "#eceffc",
    },
  },
  active: {
    backgroundColor: "#eceffc",
  },
  showBottomBorder: {
    borderBottom: `1px solid ${colors.GREY(0.3)}`,
  },
  chevronIcon: {
    marginLeft: "auto",
  },
  modalStyle: {
    maxHeight: "80vh",
    "@media only screen and (max-width: 767px)": {
      width: "100%",
    },
  },
  buttonLabel: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  rootContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 5,
    transition: "all ease-in-out 0.4s",
    boxSizing: "border-box",
    width: "100%",
    "@media only screen and (max-width: 767px)": {
      overflowY: "auto",
      padding: "40px 10px",
    },
    "@media only screen and (max-width: 415px)": {
      padding: "40px 0px",
    },
  },
  buttonCustomStyle: {
    width: 200,
    height: 40,
  },
  buttonContainer: {
    padding: 20,
  },
  rippleClass: {
    width: "100%",
  },
});
