// import Link from "next/link";
// import { withRouter } from "next/router";
// import { connect } from "react-redux";
// import { StyleSheet, css } from "aphrodite";
// import moment from "moment";
// import Plain from "slate-plain-serializer";
// import { Text, Block } from "slate";
// import { isMobile } from "react-device-detect";
// import Ripples from "react-ripples";

// // Components
// import ComponentWrapper from "~/components/ComponentWrapper";
// import Head from "~/components/Head";
// import TextEditor from "~/components/TextEditor";

// // Redux
// import { PaperActions } from "~/redux/paper";

// // Config
// import { convertToEditorValue } from "~/config/utils";

// const Diff = require("diff");
// class PaperEditHistory extends React.Component {
//   static async getInitialProps({ store, isServer, query }) {
//     await store.dispatch(PaperActions.getEditHistory(query.paperId));
//     await store.dispatch(PaperActions.getPaper(query.paperId));
//     const paper = store.getState().paper;

//     return { isServer, paper };
//   }
//   constructor(props) {
//     super(props);

//     const emptyState = Plain.deserialize("");

//     this.state = {
//       selectedEdit: 0,
//       editorState: emptyState,
//       finishedLoading: false,
//     };
//   }

//   changeEditView = (selectedIndex, edit) => {
//     let previousState = {};

//     let editorState = convertToEditorValue(edit.summary);

//     if (edit.previousSummary) {
//       previousState = convertToEditorValue(edit.previousSummary);
//       editorState = this.diffVersions(editorState, previousState);
//     }

//     this.setState({
//       selectedEdit: selectedIndex,
//       editorState,
//       previousState,
//     });
//   };

//   componentDidMount() {
//     if (this.props.paper.editHistory.length > 0) {
//       let previousState = {};

//       let edit = this.props.paper.editHistory[0];
//       let editorState = convertToEditorValue(edit.summary);

//       if (edit.previousSummary) {
//         previousState = convertToEditorValue(edit.previousSummary);
//         editorState = this.diffVersions(editorState, previousState);
//       }

//       this.setState({
//         editorState,
//         previousState,
//       });
//     }
//   }

//   /**
//    * Function of how to handle a diff. Create a new text node with the
//    * diff values. Add marks based on action performed.
//    * @param  {Object} diff -- diff object
//    * @param  {BlockNode} node -- slate block node being diffed
//    * @return {TextNode}      -- slate text node created
//    */
//   parseDiff = (diff, node) => {
//     let diffValue = diff.value;
//     let action = diff.added ? "added" : diff.removed ? "removed" : null;
//     let marks = node.getMarks();
//     let key = Math.floor(Math.random() * 1000000000).toString(36);
//     let markedNode = Text.create({ key: key, text: diffValue, marks });

//     if (diff.added || diff.removed) {
//       markedNode = markedNode.addMark(action);
//     }
//     return markedNode;
//   };

//   /**
//    * Function to handle all the comparisons for diffing and assembling the
//    * slate value with all added marks.
//    * @param  {ValueObject} editorState   -- current version slate value object
//    * @param  {ValueObject} previousState -- previous version slate value object
//    * @return {ValueObject}               -- new value object created from diffing the two versions
//    */
//   diffVersions = (editorState, previousState) => {
//     let blockArray = editorState.document.getBlocksAsArray();
//     let pathMap = editorState.document.getNodesToPathsMap();
//     let previousPathMap = previousState.document.getNodesToPathsMap();
//     let tempEditor = editorState;
//     let previousBlockComplete = {};
//     let previousBlockArray = previousState.document.getBlocksAsArray();

//     for (
//       let prevIndex = 0;
//       prevIndex < previousBlockArray.length;
//       prevIndex++
//     ) {
//       previousBlockComplete[previousBlockArray[prevIndex].key] = false;
//     }

//     for (let blockIndex = 0; blockIndex < blockArray.length; blockIndex++) {
//       let node = blockArray[blockIndex];
//       let key = node.key;
//       let prevNode = previousState.document.getNode(key);
//       previousBlockComplete[key] = true;
//       if (prevNode) {
//         let diffJSON = Diff.diffWords(prevNode.text, node.text);
//         if (diffJSON.length > 1 || diffJSON[0].added || diffJSON[0].removed) {
//           let newTextNodes = [];
//           for (let diffIndex = 0; diffIndex < diffJSON.length; diffIndex++) {
//             if (diffJSON[diffIndex].added) {
//               let newNode = this.parseDiff(diffJSON[diffIndex], node);
//               newTextNodes.push(newNode);
//             } else if (diffJSON[diffIndex].removed) {
//               let newNode = this.parseDiff(diffJSON[diffIndex], prevNode);
//               newTextNodes.push(newNode);
//             } else {
//               let newNode = this.parseDiff(diffJSON[diffIndex], node);
//               newTextNodes.push(newNode);
//             }
//           }
//           let pathToBlock = pathMap.get(node);
//           let newNodes = node.getTextsAsArray();
//           if (newTextNodes.length > 0) {
//             newNodes = newTextNodes;
//           }
//           let newDiffBlock = Block.create({
//             key: key,
//             nodes: newNodes,
//             type: node.type,
//           });
//           tempEditor = tempEditor.removeNode(pathToBlock);
//           tempEditor = tempEditor.insertNode(pathToBlock, newDiffBlock);
//         }
//       } else {
//         let pathToBlock = pathMap.get(node);
//         let nodeTextArray = node.getTextsAsArray();
//         let newNodeTexts = [];
//         for (
//           let nodeTextIndex = 0;
//           nodeTextIndex < nodeTextArray.length;
//           nodeTextIndex++
//         ) {
//           newNodeTexts.push(nodeTextArray[nodeTextIndex].addMark("added"));
//         }
//         let newBlock = Block.create({
//           key: key,
//           nodes: newNodeTexts,
//           type: node.type,
//         });
//         tempEditor = tempEditor.removeNode(pathToBlock);
//         tempEditor = tempEditor.insertNode(pathToBlock, newBlock);
//       }
//     }
//     let keys = Object.keys(previousBlockComplete);
//     for (let prevNodeIndex = 0; prevNodeIndex < keys.length; prevNodeIndex++) {
//       let key = keys[prevNodeIndex];
//       if (!previousBlockComplete[key]) {
//         let prevNode = previousState.document.getNode(key);
//         let previousTextArray = prevNode.getTextsAsArray();
//         let newRemovedBlock = prevNode;
//         for (
//           let prevTextIndex = 0;
//           prevTextIndex < previousTextArray.length;
//           prevTextIndex++
//         ) {
//           let pathToText = prevNode.getPath(previousTextArray[prevTextIndex]);
//           newRemovedBlock = prevNode.addMark(pathToText, "removed");
//         }
//         let pathToBlock = previousPathMap.get(prevNode);
//         tempEditor = tempEditor.insertNode(pathToBlock, newRemovedBlock);
//       }
//     }
//     return tempEditor;
//   };

//   setRef = (editor) => {
//     this.editor = editor;
//   };

//   render() {
//     let { paper, router } = this.props;
//     let editHistory = paper.editHistory.map((edit, index) => {
//       return (
//         <div
//           key={`edit_history_${index}`}
//           className={css(
//             styles.editHistoryCard,
//             this.state.selectedEdit === index && styles.selectedEdit
//           )}
//           onClick={() => this.changeEditView(index, edit)}
//         >
//           <div className={css(styles.date)}>
//             {moment(edit.approvedDate).format("MMM Do YYYY, h:mm A")}
//             {index === 0 && <span>{` (Current Ver.)`}</span>}
//           </div>
//           <div className={css(styles.user)}>
//             {`${edit.proposedBy.firstName} ${edit.proposedBy.lastName}`}
//           </div>
//         </div>
//       );
//     });
//     return (
//       <ComponentWrapper>
//         <Head
//           title={this.props.paper && this.props.paper.title}
//           description={
//             this.props.paper &&
//             `Add information about ${this.props.paper.title}`
//           }
//           socialImageUrl={this.props.paper && this.props.paper.metatagImage}
//         />
//         <div
//           className={css(styles.container, isMobile && styles.mobileContainer)}
//         >
//           {isMobile && (
//             <div className={css(styles.edits, styles.mobileEdits)}>
//               <div className={css(styles.editHistoryContainer)}>
//                 <div className={css(styles.revisionTitle)}>
//                   Revision History
//                 </div>
//                 {editHistory}
//               </div>
//             </div>
//           )}
//           <Link
//             href={"/paper/[paperId]/[tabName]"}
//             as={`/paper/${router.query.paperId}/summary`}
//           >
//             <div className={css(styles.back)}>
//               <i className={css(styles.arrow) + " fal fa-long-arrow-left"}></i>
//               Summary
//             </div>
//           </Link>
//           <div className={css(styles.editor, isMobile && styles.mobileEditor)}>
//             <h1> {paper.title} </h1>
//             <TextEditor
//               canEdit={false}
//               readOnly={true}
//               containerStyles={styles.editorContainer}
//               canSubmit={false}
//               commentEditor={false}
//               passedValue={this.state.editorState}
//               initialValue={this.state.editorState}
//               setRef={this.setRef}
//             />
//           </div>
//           {!isMobile && (
//             <div className={css(styles.edits)}>
//               <div className={css(styles.editHistoryContainer)}>
//                 <div className={css(styles.revisionTitle)}>
//                   Revision History
//                 </div>
//                 {editHistory}
//               </div>
//             </div>
//           )}
//         </div>
//       </ComponentWrapper>
//     );
//   }
// }

// var styles = StyleSheet.create({
//   container: {
//     display: "flex",
//     boxSizing: "border-box",
//     position: "relative",
//   },
//   summaryActions: {
//     width: 280,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },
//   action: {
//     color: "#241F3A",
//     fontSize: 16,
//     opacity: 0.6,
//     display: "flex",
//     cursor: "pointer",
//   },
//   editorContainer: {
//     marginLeft: -16,
//   },
//   pencilIcon: {
//     marginRight: 5,
//   },
//   draftContainer: {
//     width: "100%",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "flex-end",
//   },
//   editor: {
//     paddingTop: 75,
//     width: "100%",
//   },
//   edits: {
//     paddingTop: 75,
//   },
//   editHistoryContainer: {
//     background: "#F9F9FC",
//     minHeight: 200,
//     borderRadius: 4,
//   },
//   selectedEdit: {
//     background: "#F0F1F7",
//   },
//   editHistoryCard: {
//     width: 250,
//     padding: "14px 30px",
//     cursor: "pointer",
//     ":hover": {
//       background: "#F0F1F7",
//     },
//   },
//   date: {
//     fontSize: 14,
//     fontWeight: 500,
//   },
//   user: {
//     fontSize: 12,
//     opacity: 0.5,
//   },
//   revisionTitle: {
//     padding: "20px 30px",
//     color: "#241F3A",
//     fontSize: 12,
//     opacity: 0.4,
//     letterSpacing: 1.2,

//     textTransform: "uppercase",
//   },
//   back: {
//     display: "flex",
//     opacity: 0.4,
//     alignItems: "center",
//     height: 30,
//     paddingTop: 10,
//     position: "absolute",
//     left: 0,
//     top: 16,
//     cursor: "pointer",

//     ":hover": {
//       opacity: 1,
//     },
//   },
//   arrow: {
//     marginRight: 8,
//   },
//   mobileContainer: {
//     flexDirection: "column",
//     alignItems: "center",
//   },
//   mobileEditor: {
//     paddingTop: 20,
//   },
//   mobileEdits: {
//     width: 310,
//   },
// });
// const mapStateToProps = (state) => ({
//   paper: state.paper,
// });

// export default connect(mapStateToProps)(withRouter(PaperEditHistory));
