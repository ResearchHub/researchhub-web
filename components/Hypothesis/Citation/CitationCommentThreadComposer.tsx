import { connect } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { ReactElement, SyntheticEvent } from "react";
import ColumnContainer from "~/components/Paper/SideColumn/ColumnContainer";
import DiscussionPostMetadata from "~/components//DiscussionPostMetadata.js";
import TextEditor from "~/components/TextEditor";
import colors from "~/config/themes/colors";
import { postCitationThread } from "../api/postCitationThread";
import { ID } from "~/config/types/root_types";

type Props = {
  auth?: any; // redux
  citationID: ID;
  citationThreadID?: ID;
  citationTitle: string;
  citationUnidocID: ID;
  onSubmitSuccess: () => void;
  onCancel: () => void;
};

function CitationCommentThreadComposer({
  auth,
  citationID,
  citationTitle,
  onSubmitSuccess,
  onCancel,
}: Props): ReactElement<"div"> {
  const { user } = auth ?? {};
  const authorProfile = user?.author_profile ?? {};
  const { first_name: authorFirstName, last_name: authorLastName } =
    authorProfile;
  const handleCancel = () => {
    onCancel();
  };
  const handleSubmit = (text: string, plainText: string) => {
    postCitationThread({
      onError: (error: Error): void => console.warn("ERROR: ", error),
      onSuccess: ({ threadID }): void => {
        onSubmitSuccess();
        alert(`success: ${threadID}`);
      },
      params: {
        context_title: citationTitle,
        documentID: citationID,
        plain_text: plainText,
        source: "citation_comment",
        text,
      },
    });
  };
  return (
    <div className={css([styles.citationCommentThreadCard])}>
      <ColumnContainer overrideStyles={styles.columnContainer}>
        <DiscussionPostMetadata
          authorProfile={authorProfile}
          // @ts-ignore legacy code
          data={{
            created_by: user,
          }}
          noTimeStamp
          smaller
          username={authorFirstName + " " + authorLastName}
        />
        <div className={css(styles.threadComposerContainer)}>
          <TextEditor
            canEdit
            // @ts-ignore - legacy code
            commentEditorStyles={styles.commentEditorStyles}
            initialValue={null}
            mediaOnly
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            placeholder="What are your thoughts?"
            smallToolBar
          />
        </div>
      </ColumnContainer>
    </div>
  );
}

const styles = StyleSheet.create({
  citationCommentThreadCard: { marginBottom: 8 },
  columnContainer: {
    width: "100%",
    padding: "20px 15px",
    minHeight: 100,
    "@media only screen and (max-width: 1024px)": {
      marginTop: 0,
    },
  },
  threadComposerContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingTop: 4,
  },
  commentEditorStyles: {
    "@media only screen and (max-width: 415px)": {
      fontSize: 14,
    },
    "@media only screen and (max-width: 321px)": {
      fontSize: 12,
    },
  },
});
const mapStateToProps = ({ auth }: any) => ({
  auth,
});

export default connect(mapStateToProps, {})(CitationCommentThreadComposer);
