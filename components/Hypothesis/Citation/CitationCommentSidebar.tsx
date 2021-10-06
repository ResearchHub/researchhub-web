import { breakpoints } from "~/config/themes/screen";
import { css, StyleSheet } from "aphrodite";
import { ID } from "~/config/types/root_types";
import React, { ReactElement, SyntheticEvent, useState } from "react";
import { slide as SlideMenu } from "@quantfive/react-burger-menu";
import {
  getCurrMediaWidth,
  useEffectOnScreenResize,
} from "~/config/utils/useEffectOnScreenResize";
import CitationCommentThreadComposer from "./CitationCommentThreadComposer";
import colors from "~/config/themes/colors";
import HypothesisUnduxStore, {
  HypothesisStore,
} from "../undux/HypothesisUnduxStore";
import icons from "~/config/themes/icons";
import DiscussionEntry from "~/components/Threads/DiscussionEntry";

type CitationCommentSidebarProps = {
  citationID: ID;
  citationThreadEntries: ReactElement<typeof DiscussionEntry>[];
  citationTitle: string;
  hypothesisUnduxStore: HypothesisStore;
  setLastUpdateTime: (time: number) => void;
};

const MEDIA_WIDTH_LIMIT = breakpoints.large.int;

const yo = [
  {
    block_key: null,
    comment_count: 0,
    comments: [],
    context_title: null,
    created_by: {
      id: 4,
      author_profile: {
        id: 2,
        user: 4,
        first_name: "Calvin",
        last_name: "Lee",
        created_date: "2021-03-15T17:39:35.850062Z",
        updated_date: "2021-07-23T18:07:00.063609Z",
        description: "Hello, I'm Calvin of Q5",
        profile_image:
          "https://lh3.googleusercontent.com/a-/AOh14GieST7Py5kmh3_9cFfAZJb1UHKAJR7uRCZ9ORGT=s96-c",
        author_score: 11,
        university: null,
        orcid_id: null,
        orcid_account: null,
        education: [],
        headline: { title: "Test headline", isPublic: true },
        facebook: null,
        twitter: null,
        linkedin: null,
        academic_verification: null,
        claimed: true,
        merged_with: null,
        claimed_by_user_author_id: 2,
        is_claimed: true,
        num_posts: 5,
        reputation: 102,
        sift_link: "https://console.sift.com/users/4?abuse_type=content_abuse",
        total_score: 11,
        wallet: null,
      },
    },
    created_date: "2021-10-06T17:04:19.211603Z",
    created_location: null,
    entity_key: null,
    external_metadata: null,
    hypothesis: 3,
    citation: null,
    id: 196,
    is_public: true,
    is_removed: false,
    paper_slug: null,
    paper: null,
    post_slug: null,
    post: null,
    plain_text: "This is comment for the hypothesis.",
    promoted: false,
    score: 1,
    source: "researchhub",
    text: { ops: [{ insert: "This is comment for the hypothesis.\n" }] },
    title: null,
    user_flag: null,
    user_vote: {
      id: 371,
      content_type: 20,
      created_by: 4,
      created_date: "2021-10-06T17:04:19.379520Z",
      vote_type: 1,
      item: 196,
    },
    was_edited: false,
    document_meta: { id: 3, title: "New Hypothesis", slug: "new-hypothesis" },
  },
  {
    block_key: null,
    comment_count: 0,
    comments: [],
    context_title: null,
    created_by: {
      id: 4,
      author_profile: {
        id: 2,
        user: 4,
        first_name: "Calvin",
        last_name: "Lee",
        created_date: "2021-03-15T17:39:35.850062Z",
        updated_date: "2021-07-23T18:07:00.063609Z",
        description: "Hello, I'm Calvin of Q5",
        profile_image:
          "https://lh3.googleusercontent.com/a-/AOh14GieST7Py5kmh3_9cFfAZJb1UHKAJR7uRCZ9ORGT=s96-c",
        author_score: 11,
        university: null,
        orcid_id: null,
        orcid_account: null,
        education: [],
        headline: { title: "Test headline", isPublic: true },
        facebook: null,
        twitter: null,
        linkedin: null,
        academic_verification: null,
        claimed: true,
        merged_with: null,
        claimed_by_user_author_id: 2,
        is_claimed: true,
        num_posts: 5,
        reputation: 102,
        sift_link: "https://console.sift.com/users/4?abuse_type=content_abuse",
        total_score: 11,
        wallet: null,
      },
    },
    created_date: "2021-10-06T17:05:59.179255Z",
    created_location: null,
    entity_key: null,
    external_metadata: null,
    hypothesis: 3,
    citation: null,
    id: 197,
    is_public: true,
    is_removed: false,
    paper_slug: null,
    paper: null,
    post_slug: null,
    post: null,
    plain_text: "This is comment for the hypothesis. COMMENT 2!",
    promoted: false,
    score: 1,
    source: "researchhub",
    text: {
      ops: [{ insert: "This is comment for the hypothesis. COMMENT 2!\n" }],
    },
    title: null,
    user_flag: null,
    user_vote: {
      id: 372,
      content_type: 20,
      created_by: 4,
      created_date: "2021-10-06T17:05:59.269981Z",
      vote_type: 1,
      item: 197,
    },
    was_edited: false,
    document_meta: { id: 3, title: "New Hypothesis", slug: "new-hypothesis" },
  },
];

function useEffectFetchCitationThreads({}): void {}

export default function CitationCommentSidebarWithMedia(): ReactElement<"div"> | null {
  const [shouldRenderWithSlide, setShouldRenderWithSlide] = useState<boolean>(
    MEDIA_WIDTH_LIMIT > getCurrMediaWidth()
  );

  const hypothesisUnduxStore = HypothesisUnduxStore.useStore();
  const targetCitationComment = hypothesisUnduxStore.get(
    "targetCitationComment"
  );
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());
  const [citationThreads, setCitationThreads] = useState<any>([]);
  const { citationID, citationTitle = "" } = targetCitationComment ?? {};

  useEffectFetchCitationThreads({
    citationID,
    lastUpdateTime,
    setCitationThreads,
  });

  useEffectOnScreenResize({
    onResize: (newMediaWidth): void =>
      setShouldRenderWithSlide(MEDIA_WIDTH_LIMIT > newMediaWidth),
  });

  const citationThreadEntries = citationThreads.map((yoyo, index) => (
    <DiscussionEntry
      key={index}
      data={yoyo}
      discussionCount={0}
      hoverEvents
      mediaOnly
      noVoteLine
      withPadding
    />
  ));

  const citationCommentSidebarProps: CitationCommentSidebarProps = {
    citationID,
    citationThreadEntries,
    citationTitle,
    hypothesisUnduxStore,
    setLastUpdateTime,
  };

  return shouldRenderWithSlide ? (
    <div className={css(styles.citationCommentMobile)}>
      <SlideMenu
        right
        width={"100%"}
        isOpen={true}
        styles={burgerMenuStyle}
        customBurgerIcon={false}
      >
        <CitationCommentSidebar {...citationCommentSidebarProps} />
      </SlideMenu>
    </div>
  ) : (
    <div className={css(styles.inlineSticky)}>
      <CitationCommentSidebar {...citationCommentSidebarProps} />
    </div>
  );
}

function CitationCommentSidebar({
  citationID,
  citationThreadEntries,
  citationTitle,
  hypothesisUnduxStore,
  setLastUpdateTime,
}: CitationCommentSidebarProps): ReactElement<"div"> {
  return (
    <div className={css(styles.citationCommentSidebar)}>
      <div className={css(styles.header)}>
        <div
          className={css(styles.backButton)}
          onClick={(): void =>
            hypothesisUnduxStore.set("targetCitationComment")(null)
          }
        >
          {icons.arrowRight}
          <span className={css(styles.marginLeft8)}>Hide</span>
        </div>
      </div>
      <CitationCommentThreadComposer
        citationID={citationID}
        citationTitle={citationTitle ?? ""}
        onCancel={(): void => {
          hypothesisUnduxStore.set("targetCitationComment")(null);
        }}
        onSubmitSuccess={(): void => setLastUpdateTime(Date.now())}
      />
      <div className={css(styles.citationThreadEntriesWrap)}>
        {citationThreadEntries}
      </div>
    </div>
  );
}

const burgerMenuStyle = {
  bmBurgerBars: {
    background: "#373a47",
  },
  bmBurgerBarsHover: {
    background: "#a90000",
  },
  bmCrossButton: {
    height: "26px",
    width: "26px",
    color: "#FFF",
    display: "none",
    visibility: "hidden",
  },
  bmCross: {
    background: "#bdc3c7",
    display: "none",
    visibility: "hidden",
  },
  bmMenuWrap: {
    position: "fixed",
    top: 0,
    zIndex: 10,
    overflowY: "auto",
    width: "85%",
  },
  bmMenu: {
    background: "#fff",
    fontSize: "1.15em",
    overflowY: "auto",
    width: "100%",
  },
  bmMorphShape: {
    fill: "#373a47",
  },
  bmItemList: {
    color: "#b8b7ad",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    overflow: "auto",
    borderTop: "1px solid rgba(255,255,255,.2)",
    ":focus": {
      outline: "none",
    },
  },
  bmItem: {
    display: "inline-block",
    margin: "15px 0 15px 0",
    color: "#FFF",
    ":focus": {
      outline: "none",
    },
  },
  bmOverlay: {
    background: "rgba(0, 0, 0, 0.3)",
    left: 0,
    right: 0,
    top: 0,
    zIndex: 9,
    bottom: 0,
  },
};

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    color: colors.BLACK(0.5),
    cursor: "pointer",
    ":hover": {
      color: colors.BLACK(1),
    },
    display: "flex",
    textDecoration: "none",
    "@media only screen and (max-width: 1023px)": {
      paddingLeft: 8,
      width: "100%",
      height: "100%",
    },
    "@media only screen and (max-width: 767px)": {
      top: -118,
      left: 0,
    },
    "@media only screen and (max-width: 415px)": {
      top: -90,
      left: 20,
    },
  },
  citationThreadEntriesWrap: {
    height: "100%",
    overflowY: "auto",
    border: `1px solid ${colors.LIGHT_GREY_BORDER}`,
    [`@media only screen and (max-width: ${breakpoints.large.str})`]: {
      border: "none",
    },
  },
  header: {
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    justifyContent: "flex-start",
    positioin: "relative",
    marginBottom: 16,
    "@media only screen and (max-width: 1199px)": {
      padding: 16,
    },
  },
  citationCommentSidebar: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    maxHeight: 1000,
    width: 400,
    ":focus": {
      outline: "none",
    },
    "@media only screen and (max-width: 1199px)": {
      width: "100%",
    },
  },
  inlineSticky: {
    position: "sticky",
    top: 60,
  },
  marginLeft8: {
    marginLeft: 8,
  },
  citationCommentMobile: {
    display: "none",
    "@media only screen and (max-width: 1199px)": {
      display: "block",
    },
  },
});
