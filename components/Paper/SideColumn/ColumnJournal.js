import { Fragment, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import ReactPlaceholder from "react-placeholder/lib";

// Component
import { SideColumnTitle } from "~/components/Typography";
import HubEntryPlaceholder from "~/components/Placeholders/HubEntryPlaceholder";
import JournalCard from "./JournalCard";

const ColumnJournal = (props) => {
  const { paper } = props;

  return (
    <ReactPlaceholder
      showLoadingAnimation
      ready={paper}
      customPlaceholder={<HubEntryPlaceholder color="#efefef" rows={1} />}
    >
      <div>
        {paper && (paper.url || paper.external_source) && (
          <Fragment>
            <SideColumnTitle title={"Journal"} overrideStyles={styles.title} />
            {<JournalCard paper={paper} />}
          </Fragment>
        )}
      </div>
    </ReactPlaceholder>
  );
};

const styles = StyleSheet.create({
  title: {
    margin: "15px 0 10px",
  },
});

export default ColumnJournal;
