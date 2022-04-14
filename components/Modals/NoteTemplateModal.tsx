import API from "~/config/api";
import BaseModal from "~/components/Modals/BaseModal";
import Button from "~/components/Form/Button";
import Loader from "~/components/Loader/Loader";
import Modal from "react-modal";
import colors from "~/config/themes/colors";
import icons from "~/config/themes/icons";
import { AUTH_TOKEN } from "~/config/constants";
import { NOTE_GROUPS } from "~/components/Notebook/config/notebookConstants";
import { StyleSheet, css } from "aphrodite";
import { breakpoints } from "~/config/themes/screen";
import { createNewNote, createNoteContent } from "~/config/fetch";
import { fetchOrgTemplates } from "~/config/fetch";
import { useAlert } from "react-alert";
import {
  ReactElement,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";

export type TemplateSidebarEntryProps = {
  orgSlug: string;
  selected: boolean;
  setSelected: any;
  setTemplates: any;
  template: any;
};

export type NoteTemplateModalProps = {
  isOpen: boolean;
  orgSlug: string;
  redirectToNote: any;
  refetchTemplates: any;
  setIsOpen: (flag: boolean) => void;
  setTemplates: any;
  templates: any;
};

function TemplateSidebarEntry({
  orgSlug,
  selected,
  setSelected,
  setTemplates,
  template,
}: TemplateSidebarEntryProps): ReactElement<"div"> {
  const alert = useAlert();
  const [isHovered, setIsHovered] = useState(false);
  const [menuLoading, setMenuLoading] = useState(false);

  return (
    <div
      className={css(
        styles.sidebarSectionContent,
        template.id === selected && styles.active
      )}
      key={template.id}
      onClick={() => setSelected(template.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {template.name}
      <div
        style={{ fontSize: 12 }}
        className={css(styles.trashButton)}
        onClick={(e) => {
          e && e.stopPropagation();
          alert.show({
            text: (
              <div>
                Permanently delete <b>{template.name}</b>? This cannot be
                undone.
              </div>
            ),
            buttonText: "Yes",
            onClick: async () => {
              setMenuLoading(true);
              await fetch(
                API.NOTE_TEMPLATE_DELETE({ templateId: template.id }),
                API.POST_CONFIG()
              );
              const resp = await fetchOrgTemplates(orgSlug);
              setTemplates(resp);
              if (template.id === selected) {
                setSelected(resp[0]?.id);
              }
              setMenuLoading(false);
            },
          });
        }}
      >
        {menuLoading ? (
          <Loader size={18} />
        ) : (
          <div className={css(!isHovered && styles.hide)}>{icons.trash}</div>
        )}
      </div>
    </div>
  );
}

export default function NoteTemplateModal({
  isOpen,
  orgSlug,
  redirectToNote,
  refetchTemplates,
  setIsOpen,
  setTemplates,
  templates,
}: NoteTemplateModalProps): ReactElement<typeof Modal> {
  const editorRef = useRef<any>();
  const { CKEditor, Editor } = editorRef.current || {};
  const [hideTemplates, setHideTemplates] = useState(false);
  const [selected, setSelected] = useState((templates || [])[0]?.id);
  const [editorInstance, setEditorInstance] = useState(null);

  const templateMap = {};
  for (const template of templates) {
    templateMap[template.id.toString()] = template;
  }

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      Editor: require("@thomasvu/ckeditor5-custom-build").SimpleBalloonEditor,
    };
  }, []);

  useEffect(() => {
    if (templates && !selected) {
      setSelected(templates[0]?.id);
    }
  }, [templates]);

  useEffect(() => {
    if (isOpen) {
      refetchTemplates();
    }
  }, [isOpen]);

  const closeModal = (e: SyntheticEvent): void => {
    e && e.preventDefault();
    setIsOpen(false);
  };

  const handleUseThisTemplate = async (e: SyntheticEvent): void => {
    e && e.preventDefault();

    const noteParams = {
      grouping: NOTE_GROUPS.WORKSPACE,
      orgSlug,
      title:
        editorInstance?.plugins
          .get("Title")
          .getTitle()
          .replace(/&nbsp;/g, " ") || "Untitled",
    };

    const note = await createNewNote(noteParams);
    const noteContent = await createNoteContent({
      editorData: templateMap[selected].src,
      noteId: note.id,
    });
    redirectToNote(note);
    closeModal(e);
  };

  const handleInput = (editor) => {};

  return (
    <BaseModal
      closeModal={closeModal}
      isOpen={isOpen}
      modalStyle={styles.modalStyle}
      removeDefault={true}
    >
      <div className={css(styles.rootContainer)}>
        <div className={css(styles.editorContainer) + " eln"}>
          <CKEditor
            config={{
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
            }}
            data={templateMap[selected]?.src ?? ""}
            editor={Editor}
            onChange={(event, editor) => handleInput(editor)}
            onReady={(editor) => {
              setEditorInstance(editor);
              editor.isReadOnly = true;
              editor.editing.view.change((writer) => {
                writer.setStyle(
                  "min-height",
                  "200px",
                  editor.editing.view.document.getRoot()
                );
              });
            }}
          />
        </div>
        <div className={css(styles.sidebar)}>
          <div className={css(styles.buttonContainer)}>
            <Button
              customButtonStyle={styles.buttonCustomStyle}
              customLabelStyle={styles.buttonLabel}
              label={
                <div className={css(styles.buttonLabel)}>Use this template</div>
              }
              onClick={handleUseThisTemplate}
              rippleClass={styles.rippleClass}
            />
          </div>
          <div
            className={css(
              styles.sidebarSection,
              hideTemplates && styles.showBottomBorder
            )}
            onClick={() => setHideTemplates(!hideTemplates)}
          >
            Templates
            <span className={css(styles.chevronIcon)}>
              {hideTemplates ? icons.chevronDown : icons.chevronUp}
            </span>
          </div>
          {!hideTemplates && (
            <div>
              {templates.map((template) => (
                <TemplateSidebarEntry
                  orgSlug={orgSlug}
                  selected={selected}
                  setSelected={setSelected}
                  setTemplates={setTemplates}
                  template={template}
                />
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
    justifyContent: "space-between",
    padding: "8px 40px 8px 20px",
    position: "relative",
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
    height: "80vh",
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
  trashButton: {
    alignItems: "center",
    borderRadius: "50%",
    bottom: 0,
    color: colors.RED(0.7),
    cursor: "pointer",
    display: "flex",
    height: 27,
    justifyContent: "center",
    margin: "auto",
    position: "absolute",
    right: 7,
    top: 0,
    width: 27,
    ":hover": {
      backgroundColor: colors.GREY(0.7),
    },
  },
  hide: {
    display: "none",
  },
});
