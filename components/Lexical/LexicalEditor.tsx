/* eslint-disable prettier/prettier */
import { $getRoot, $getSelection } from "lexical";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import API from "~/config/api";
import AutoSavePlugin from "./plugins/AutoSavePlugin";
import MarkdownShortcutPlugin from "./plugins/MarkdownShortcutPlugin";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import TabFocusPlugin from "./plugins/TabFocusPlugin";
import FloatingTextFormatToolbarPlugin from "./plugins/FloatingTextFormatToolbarPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import EditorNodes from "./nodes/EditorNodes";
import LinkPlugin from "./plugins/LinkPlugin";
import ComponentPickerMenuPlugin from "./plugins/ComponentPickerPlugin";
import PageBreakPlugin from "./plugins/PageBreakPlugin";

import Loader from "~/components/Loader/Loader";
import NotebookHeader from "~/components/Notebook/NotebookHeader";
import { AUTH_TOKEN } from "~/config/constants";
import {
  BUNDLE_VERSION,
  CKEditorCS as CKELNEditor,
  Context,
} from "@researchhub/ckeditor5-custom-build";

import { MessageActions } from "~/redux/message";
import { PERMS } from "~/components/Notebook/config/notebookConstants";
import { breakpoints } from "~/config/themes/screen";
import { captureEvent } from "~/config/utils/events";
import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { getUserNoteAccess } from "~/components/Notebook/utils/notePermissions";
import { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { unescapeHtmlString } from "~/config/utils/unescapeHtmlString";
import { isEmpty, isNullOrUndefined } from "~/config/utils/nullchecks";
import Cookies from "js-cookie";
import BasicEditorTheme from "./themes/BasicEditorTheme";
import { Tab } from "@mui/material";

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
// function onChange(editorState) {
//   editorState.read(() => {
//     // Read the contents of the EditorState here.
//     const root = $getRoot();
//     const selection = $getSelection();
//   });
// }

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error) {
  console.error(error);
}

function Editor({
  ELNLoading,
  currentNote,
  currentOrganization,
  handleEditorInput,
  isOrgMember,
  notePerms,
  redirectToNote,
  refetchNotePerms,
  setELNLoading,
  setMessage,
  showMessage,
  user,
  userOrgs,
}) {
  const initialConfig = {
    namespace: "NoteBook-" + currentNote.id,
    editorState: currentNote.latest_version?.src
      ? currentNote.latest_version.src
      : null,
    nodes: [...EditorNodes],
    theme: BasicEditorTheme,
    onError,
  };

  const router = useRouter();
  const { orgSlug } = router.query;
  const sidebarElementRef = useRef();
  const [presenceListElement, setPresenceListElement] = useState(null);
  const [editorInstance, setEditorInstance] = useState(null);

  console.log(currentNote.latest_version);

  const onRefChange = useCallback((node) => {
    if (node !== null) {
      setPresenceListElement(node);
    }
  }, []);
  const currentUserAccess = getUserNoteAccess({ user, notePerms, userOrgs });
  const noteIdLength = `${currentNote.id}`.length;
  const channelId = `${orgSlug?.slice(0, 59 - noteIdLength)}-${currentNote.id}`;

  const parsedNoteTitle = unescapeHtmlString(
    currentNote.title ? currentNote.title : "Untitled"
  );

  useEffect(() => {
    if (process.browser) {
      document.title =
        isEmpty(parsedNoteTitle) || parsedNoteTitle === "Untitled"
          ? "ResearchHub | Notebook"
          : parsedNoteTitle;
    }

    return () => {
      document.title = "ResearchHub";
    };
  }, [parsedNoteTitle]);

  const getEditorContent = () => {
    return {
      full_src: "alio",
      editorInstance,
      title: parsedNoteTitle,
    };
  };

  return (
    <div className={css(styles.container)}>
      <NotebookHeader
        currentNote={currentNote}
        currentOrganization={currentOrganization}
        getEditorContent={getEditorContent}
        isOrgMember={isOrgMember}
        notePerms={notePerms}
        onRefChange={onRefChange}
        redirectToNote={redirectToNote}
        refetchNotePerms={refetchNotePerms}
        userOrgs={userOrgs}
      />
      <LexicalComposer initialConfig={initialConfig}>
        <div className={css(styles.editorContainer)}>
          <input
            className={css(styles.titleInput)}
            contentEditable="true"
            placeholder="Untitled"
            value={currentNote.title}
          ></input>
          <AutoFocusPlugin />
          <ClearEditorPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <PageBreakPlugin/>
          <div className={css(styles.editorInner)}>
            <RichTextPlugin
              contentEditable={
                <div className={css(styles.editorScroller)}>
                  <div className={css(styles.editor)}>
                    <ContentEditable className={css(styles.contentEditable)} />
                  </div>
                </div>
              }
              placeholder={<div>Start writing...</div>}
              ErrorBoundary={LexicalErrorBoundary}
            />

            <AutoSavePlugin
              parsedNoteTitle={parsedNoteTitle}
              currentNote={currentNote}
            />
            <ComponentPickerMenuPlugin/>
            <MarkdownShortcutPlugin />
            {/* <OnChangePlugin onChange={onChange} /> */}
            <HistoryPlugin />
            <TabIndentationPlugin />
            <FloatingTextFormatToolbarPlugin />
            <LinkPlugin />
            <AutoLinkPlugin />
            <TabFocusPlugin />
            <ListMaxIndentLevelPlugin maxDepth={7} />
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "calc(100vh - 80px)",
    marginLeft: "max(min(16%, 300px), 160px)",
    marginRight: "max(min(16%, 300px), 160px)",
    overflow: "auto",
    width: "100%",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      marginLeft: 0,
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      height: "calc(100vh - 66px)",
    },
    // backgroundColor: "black",
  },
  loader: {
    position: "absolute",
    top: 0,
    left: "max(min(16%, 300px), 240px)",
    right: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  editorContainer: {
    position: "relative",
    height: "100%",
    width: "100%",
    minHeight: "calc(100vh - 80px)",
  },
  editor: {
    flex: "auto",
    position: "relative",
    resize: "vertical",
    zIndex: -1,
    height: "auto",
  },
  editorInner: {
    height: "100%",
    width: "100%",
    minHeight: "calc(100vh - 80px)",
  },
  editorScroller: {
    width: "100%",
    border: 0,
    display: "flex",
    position: "relative",
    outline: 0,
    zIndex: 0,
    resize: "vertical",
  },
  contentEditable: {
    outline: "none",
    marginLeft: 10,
  },
  titleInput: {
    display: "flex",
    width: "100%",
    fontSize: "2rem",
    outline: "none",
    border: "none",
    marginBottom: 20,
  },
});

export default Editor;