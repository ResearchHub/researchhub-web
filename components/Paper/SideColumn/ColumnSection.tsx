import { Fragment, useState } from "react";
import { StyleSheet, css } from "aphrodite";
import ReactPlaceholder from "react-placeholder/lib";

// Component
import { SideColumnTitle } from "../../Typography";
import HubEntryPlaceholder from "../../Placeholders/HubEntryPlaceholder";
import JournalCard from "./JournalCard";

export type ColumnSectionProps = {
  items: any[];
  paper: any;
  sectionTitle: any;
};

function ColumnSection({ items, paper, sectionTitle }: ColumnSectionProps) {
  return (
    <ReactPlaceholder
      ready={paper && "id" in paper}
      customPlaceholder={<HubEntryPlaceholder color="#efefef" rows={1} />}
    >
      <div>
        {paper && (paper.url || paper.external_source) && (
          <Fragment>
            <SideColumnTitle
              title={sectionTitle}
              overrideStyles={styles.title}
            />
            {items}
          </Fragment>
        )}
      </div>
    </ReactPlaceholder>
  );
}

const styles = StyleSheet.create({
  title: {
    margin: "15px 0 10px",
    "@media only screen and (max-width: 415px)": {
      margin: "15px 0 5px",
    },
  },
});

export default ColumnSection;
