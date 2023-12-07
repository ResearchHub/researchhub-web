/* eslint-disable prettier/prettier */
import { $getRoot, $getSelection, $insertNodes, LexicalEditor } from "lexical";
import * as React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import useLexicalEditable from "@lexical/react/useLexicalEditable";
import LexicalClickableLinkPlugin from "@lexical/react/LexicalClickableLinkPlugin";
import TableCellNodes from "./nodes/TableCellNodes";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import API from "~/config/api";
import AutoSavePlugin from "./plugins/AutoSavePlugin";
import MarkdownShortcutPlugin from "./plugins/MarkdownShortcutPlugin";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import TabFocusPlugin from "./plugins/TabFocusPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import EditorNodes from "./nodes/EditorNodes";
import LinkPlugin from "./plugins/LinkPlugin";
import PageBreakPlugin from "./plugins/PageBreakPlugin";
import ImagesPlugin from "./plugins/ImagesPlugin";
import DragDropPastePlugin from "./plugins/DragDropPastePlugin";
import VideoPlugin from "./plugins/VideoPlugin";
import TableCellActionMenuPlugin from "./plugins/TableActionMenuPlugin";
import TableCellResizer from "./plugins/TableCellResizer";
import { TablePlugin as NewTablePlugin } from "./plugins/TablePlugin";
import { TableContext } from "./plugins/TablePlugin";
import { CAN_USE_DOM } from "./utils/canUseDOM";
import DraggableBlockPlugin from "./plugins/DraggableBlockPlugin";
import editorRootState from "./utils/editorRootState"; 

import ConvertCKEditorStatePlugin from "./plugins/ConvertCKEditorStatePlugin";

import dynamic from "next/dynamic";

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
import { Tab, TableCell } from "@mui/material";
import { lightGreen } from "@mui/material/colors";
import TableActionMenuPlugin from "./plugins/TableActionMenuPlugin";


function onError(error) {
  console.error(error);
}

// dynamic imports to improve initial loading speed

const FloatingComponentPickerTriggerPlugin = dynamic(
  () => import("./plugins/FloatingComponentPickerTriggerPlugin"),
  {
    ssr: false,
  }
);

const FloatingTextFormatToolbarPlugin = dynamic(
  () => import("./plugins/FloatingTextFormatToolbarPlugin"),
  {
    ssr: false,
  }
);

const ComponentPickerMenuPlugin = dynamic(
  () => import("./plugins/ComponentPickerPlugin"),
  { ssr: false }
);

const EquationsPlugins = dynamic(() => import("./plugins/EquationsPlugin"), {
  ssr: false,
});

const emptyEditorJSON =
  '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

const LexicalEditorComponent = ({
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
}) => {

  function isHTML(str) {
    const doc = new DOMParser().parseFromString(str, "text/html");
    return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
  }

  const initialConfig = {
    namespace: "NoteBook-" + currentNote.id,
    editorState: currentNote.latest_version?.src && !isHTML(currentNote.latest_version?.src) ? currentNote.latest_version?.src : emptyEditorJSON,
    nodes: [...EditorNodes],
    theme: BasicEditorTheme,
    onError,
  };

  const cellEditorConfig = {
    namespace: "TableCell",
    nodes: [...TableCellNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: BasicEditorTheme,
  };

  const router = useRouter();
  const { orgSlug } = router.query;
  const sidebarElementRef = useRef();
  const [presenceListElement, setPresenceListElement] = useState(null);
  const [editorInstance, setEditorInstance] = useState(null);
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] =
    useState<boolean>(false);
  // const isEditable = useLexicalEditable();

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const onRefChange = useCallback((node) => {
    if (node !== null) {
      setPresenceListElement(node);
    }
  }, []);
  const currentUserAccess = getUserNoteAccess({ user, notePerms, userOrgs });
  const noteIdLength = `${currentNote.id}`.length;
  const channelId = `${orgSlug?.slice(0, 59 - noteIdLength)}-${currentNote.id}`;
  const [title, setTitle] = useState(
    unescapeHtmlString(currentNote.title ? currentNote.title : "Untitled")
  );

  const getEditorContent = () => {
    return {
      full_src: currentNote.latest_version?.src,
      editorInstance,
      title: title,
    };
  };

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport =
        CAN_USE_DOM && window.matchMedia("(max-width: 1025px)").matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };
    updateViewPortWidth();
    window.addEventListener("resize", updateViewPortWidth);

    return () => {
      window.removeEventListener("resize", updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);

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
      <div className="editor-shell">
        <input
          className={css(styles.titleInput)}
          placeholder="Untitled"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <LexicalComposer initialConfig={initialConfig}>
          <TableContext>
            <div className={css(styles.editorContainer)}>
              <AutoFocusPlugin />
              <ClearEditorPlugin />
              <ListPlugin />
              <CheckListPlugin />
              <ComponentPickerMenuPlugin />
              <ConvertCKEditorStatePlugin CKEditorState={currentNote.latest_version?.src} />
              <LexicalClickableLinkPlugin />
              <PageBreakPlugin />
              <DragDropPastePlugin />
              <HorizontalRulePlugin />
              <div className={css(styles.editorInner)}>
                <RichTextPlugin
              
                  contentEditable={
                    <div className={css(styles.editorScroller)}>
                      <div className={css(styles.editor)} ref={onRef}>
                        <ContentEditable
                          className={css(styles.contentEditable)}
                        />
                      </div>
                    </div>
                  }
                  placeholder={null}
                  ErrorBoundary={LexicalErrorBoundary}
                />
                <AutoSavePlugin
                  currentNoteTitle={title}
                  currentNote={currentNote}
                />
                <MarkdownShortcutPlugin />
                <ImagesPlugin />
                <TableCellResizer />
                <NewTablePlugin cellEditorConfig={cellEditorConfig}>
                  <AutoFocusPlugin />
                  <RichTextPlugin
                    contentEditable={
                      <ContentEditable className="TableNode__contentEditable" />
                    }
                    placeholder={null}
                    ErrorBoundary={LexicalErrorBoundary}
                  />
                  <HistoryPlugin />
                  <ImagesPlugin captionsEnabled={false} />
                  <LinkPlugin />
                  <LexicalClickableLinkPlugin />
                  <FloatingTextFormatToolbarPlugin />
                </NewTablePlugin>
                <VideoPlugin />
                <FloatingComponentPickerTriggerPlugin />
                <OnChangePlugin onChange={() => handleEditorInput(title)} />
                <HistoryPlugin />
                <TabIndentationPlugin />
                <LinkPlugin />
                <EquationsPlugins />
                <LexicalClickableLinkPlugin />
                <AutoLinkPlugin />
                <TabFocusPlugin />
                <ListMaxIndentLevelPlugin maxDepth={7} />
                {floatingAnchorElem && !isSmallWidthViewport && (
                  <>
                    <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                    <TableCellActionMenuPlugin
                      anchorElem={floatingAnchorElem}
                      cellMerge={true}
                    />

                    <FloatingTextFormatToolbarPlugin
                      anchorElem={floatingAnchorElem}
                    />
                  </>
                )}
              </div>
            </div>
          </TableContext>
        </LexicalComposer>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "calc(100vh - 80px)",
    overflow: "auto",
    margin: "0 auto",
    width: "calc(100% - 320px)",
    maxWidth: "1200px",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      width: "calc(100% - 40px)",
      margin: "0 20px",
    },
    [`@media only screen and (max-width: ${breakpoints.small.str})`]: {
      height: "calc(100vh - 66px)",
      width: "calc(100% - 20px)",
      margin: "0 10px",
    },
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
  },
  editorInner: {
    height: "100%",
    width: "100%",
    position: "relative",
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
    minHeight: "70vh",
  },
  titleInput: {
    width: "100%",
    fontSize: "2rem",
    outline: "none",
    border: "none",
    marginBottom: 20,
  },
});

export default React.memo(LexicalEditorComponent);
