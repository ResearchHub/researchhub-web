import { connect, useStore } from "react-redux";
import { isUserEditorOfHubs } from "~/components/UnifiedDocFeed/utils/getEditorUserIDsFromHubs";
import { StyleSheet, css } from "aphrodite";
import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import { Waypoint } from "react-waypoint";
import * as Sentry from "@sentry/browser";
import Error from "next/error";

// Components
import DiscussionTab from "~/components/Paper/Tabs/DiscussionTab";
import Head from "~/components/Head";
import PaperTab from "~/components/Paper/Tabs/PaperTab";
import PaperBanner from "~/components/Paper/PaperBanner.js";
import SummaryTab from "~/components/Paper/Tabs/SummaryTab";
import { isEmpty } from "~/config/utils/nullchecks";
import { Paper as PaperDoc } from "~/config/types/paper";

// Dynamic modules
import dynamic from "next/dynamic";
const PaperFeatureModal = dynamic(() =>
  import("~/components/Modals/PaperFeatureModal")
);
const PaperPDFModal = dynamic(() =>
  import("~/components/Modals/PaperPDFModal")
);
const PaperTransactionModal = dynamic(() =>
  import("~/components/Modals/PaperTransactionModal")
);

// Redux
import { PaperActions } from "~/redux/paper";
import { MessageActions } from "~/redux/message";
import { AuthActions } from "~/redux/auth";
import { LimitationsActions } from "~/redux/limitations";
import { BulletActions } from "~/redux/bullets";
import { ModalActions } from "~/redux/modals";

// Undux
import InlineCommentUnduxStore from "~/components/PaperDraftInlineComment/undux/InlineCommentUnduxStore";
import PaperDraftUnduxStore from "~/components/PaperDraft/undux/PaperDraftUnduxStore";

// Config
import colors from "~/config/themes/colors";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { breakpoints } from "~/config/themes/screen";
import {
  convertToEditorValue,
  convertDeltaToText,
  isQuillDelta,
} from "~/config/utils/editor";
import * as shims from "~/redux/paper/shims";
import DocumentHeader from "~/components/Document/DocumentHeader";

const fetchPaper = (url, config) => {
  return fetch(url, config)
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((resp) => {
      return resp;
    })
    .catch((error) => {
      console.log(error);
      Sentry.captureException({ error, url, config });
    });
};

const Paper = ({
  openPaperPDFModal,
  initialPaperData,
  auth,
  error,
  isFetchComplete = false,
}) => {
  const router = useRouter();
  const store = useStore();

  if (error) {
    Sentry.captureException({ error, initialPaperData, query: router.query });
    return <Error statusCode={error.code} />;
  }

  // ENUM: NOT_FETCHED, FETCHING, COMPLETED
  const [fetchFreshDataStatus, setFetchFreshDataStatus] =
    useState("NOT_FETCHED");
  const [paper, setPaper] = useState({});
  // TODO: paperV2 is a strongly typed object meant to deprecate
  // the old JSON respnose from API. We should aim to use only this object
  // in future tech-deb sprint.
  const [paperV2, setPaperV2] = useState(new PaperDoc({}));

  const [summary, setSummary] = useState((paper && paper.summary) || {});
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [hasBounties, setHasBounties] = useState(false);
  const [allBounties, setAllBounties] = useState([]);

  const [discussionCount, setCount] = useState(null);
  const [activeTab, setActiveTab] = useState(0); // sections for paper page
  const { hubs = [], uploaded_by } = paper;
  const isModerator = store.getState().auth.user.moderator;
  const currUserID = auth?.user?.id ?? null;
  const isEditorOfHubs =
    /* NOTE: this is a temp measure for deal with spammers. Eventually we want to only use the first conditional */
    isUserEditorOfHubs({ currUserID, hubs }) ||
    Boolean(auth?.user?.author_profile?.is_hub_editor);

  const commentsRef = useRef(null);

  const structuredDataForSEO = useMemo(
    () => buildStructuredDataForSEO(),
    [paper]
  );

  useEffect(() => {
    if (!process.browser) return;

    const idx = window.location.hash.indexOf("#comments");
    if (idx > -1 && commentsRef.current) {
      const elem = commentsRef.current;
      const pos = elem.getBoundingClientRect().top + window.scrollY;
      window.scroll({
        top: pos,
        behavior: "instant",
      });

      // Remove #comments from URL to avoid scrolling on user page refresh
      setTimeout(() => {
        history.replaceState(null, null, " ");
      }, 250);
    }
  }, [commentsRef.current]);

  // Typically, this if statement would be created with a useEffect clause
  // but since useEffect does not work with SSG, we need a standard if statement.
  const noSetPaperData = !isEmpty(initialPaperData) && isEmpty(paper);
  if (noSetPaperData) {
    const paper = shims.paper(initialPaperData);
    setPaper(paper);
    setPaperV2(new PaperDoc(paper));

    if (discussionCount === null) {
      setCount(calculateCommentCount(initialPaperData));
    }
  }

  useEffect(() => {
    if (fetchFreshDataStatus === "NOT_FETCHED" && !isEmpty(paper)) {
      fetchFreshData(paper);
    }
  }, [fetchFreshDataStatus, paper]);

  function fetchFreshData(paper) {
    setFetchFreshDataStatus("FETCHING");
    fetchPaper(API.PAPER({ paperId: paper.id }), API.GET_CONFIG()).then(
      (freshPaperData) => {
        setFetchFreshDataStatus("COMPLETED");

        const updatedPaper = new PaperDoc(
          shims.paper({
            ...freshPaperData,
          })
        );

        setPaperV2(updatedPaper);
      }
    );
  }

  const navigateToEditPaperInfo = (e) => {
    const { unifiedDocument } = paperV2;

    e && e.stopPropagation();
    if (unifiedDocument.documentType === "paper") {
      let href = "/paper/upload/info/[paperId]";
      let as = `/paper/upload/info/${unifiedDocument.document?.id}`;
      router.push(href, as);
    }
  };

  const restorePaper = () => {
    setPaper({ ...paper, is_removed: false });
    paperV2.unifiedDocument.isRemoved = false;
    setPaperV2(paperV2);
  };

  const removePaper = () => {
    setPaper({ ...paper, is_removed: true });
    paperV2.unifiedDocument.isRemoved = true;
    setPaperV2(paperV2);
  };

  function calculateCommentCount(paper) {
    let discussionCount = 0;
    if (paper) {
      discussionCount = paper.discussion_count;
    }
    return discussionCount;
  }

  function formatDescription() {
    const { abstract, tagline } = paper;

    if (!paper) return "";

    if (paper.summary) {
      const { summary, summary_plain_text } = paper.summary;

      if (summary_plain_text) {
        return summary_plain_text;
      }

      if (summary) {
        return isQuillDelta(summary)
          ? convertDeltaToText(summary)
          : convertToEditorValue(summary).document.text;
      }
    }

    if (abstract) {
      return abstract;
    }

    if (tagline) {
      return tagline;
    }

    return "";
  }

  function buildStructuredDataForSEO() {
    let data = {
      "@context": "https://schema.org/",
      name: paper.title,
      keywords: paper.title + "researchhub" + "research hub",
      description: formatDescription(),
    };

    let image = [];

    if (paper.first_preview) {
      image.push(paper.first_preview);
    }
    if (paper.first_figure) {
      image.push(paper.first_figure);
    }
    if (image.length) {
      data["image"] = image;
    }
    if (paper.authors && paper.authors.length > 0) {
      let author = paper.authors[0];
      let authorData = {
        "@type": "Person",
        name: `${author.first_name} ${author.last_name}`,
      };

      data.author = authorData;
    }

    if (
      paper.paper_publish_date &&
      typeof paper.paper_publish_date === "string"
    ) {
      let date = paper.paper_publish_date.split("-");
      date.pop();
      date = date.join("-");
      data["datePublished"] = date;
    }

    return data;
  }

  let socialImageUrl = paper.metatagImage;

  if (!socialImageUrl) {
    socialImageUrl = paper.first_preview && paper.first_preview.file;
  }

  function updatePaperState(newState) {
    setPaper(newState);
  }

  function onSectionEnter(index) {
    activeTab !== index && setActiveTab(index);
  }
  const inlineCommentUnduxStore = InlineCommentUnduxStore.useStore();
  const shouldShowInlineComments =
    inlineCommentUnduxStore.get("displayableInlineComments").length > 0;

  return (
    <div>
      <PaperBanner
        document={paper}
        documentType="paper"
        loadingPaper={!isFetchComplete}
      />
      <PaperTransactionModal
        paper={paper}
        updatePaperState={updatePaperState}
      />
      <PaperFeatureModal
        paper={paper}
        updatePaperState={updatePaperState}
        updateSummary={setSummary}
      />
      <PaperPDFModal paperId={paper.id} paper={paper} />
      <Head
        title={paper.title}
        description={formatDescription()}
        socialImageUrl={socialImageUrl}
        noindex={paper.is_removed || paper.is_removed_by_user}
        canonical={`${process.env.HOST}/paper/${paper.id}/${paper.slug}`}
      >
        <script
          type="application/ld+json"
          id="structuredData"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredDataForSEO),
          }}
        ></script>
      </Head>
      <div className={css(styles.root)}>
        <Waypoint
          onEnter={() => onSectionEnter(0)}
          topOffset={40}
          bottomOffset={"95%"}
        >
          <a name="main" />
        </Waypoint>
        <div className={css(styles.container)}>
          <div className={css(styles.main)}>
            <div className={css(styles.top)}>
              <div className={css(styles.headerContainer)}>
                <DocumentHeader
                  document={paperV2}
                  hasBounties={hasBounties}
                  allBounties={allBounties}
                  onDocumentRemove={removePaper}
                  onDocumentRestore={restorePaper}
                  openPaperPDFModal={openPaperPDFModal}
                  handleEdit={navigateToEditPaperInfo}
                />
              </div>
            </div>
            <div className={css(styles.bodyContainer, styles.section)}>
              <Waypoint
                onEnter={() => onSectionEnter(1)}
                topOffset={40}
                bottomOffset={"95%"}
              >
                <div>
                  <a name="abstract" />
                  <SummaryTab
                    paperId={paper.id}
                    paper={paper}
                    summary={summary}
                    updatePaperState={updatePaperState}
                    updateSummary={setSummary}
                    loadingSummary={loadingSummary}
                  />
                </div>
              </Waypoint>
            </div>
            {isFetchComplete /* Performance Optimization */ && (
              <Waypoint
                onEnter={() => onSectionEnter(2)}
                topOffset={40}
                bottomOffset={"95%"}
              >
                <div
                  className={css(styles.discussionContainer, styles.section)}
                >
                  <a name="comments" id="comments" ref={commentsRef} />
                  {
                    <DiscussionTab
                      hostname={process.env.HOST}
                      documentType={"paper"}
                      paperId={paper.id}
                      paperState={paper}
                      setHasBounties={setHasBounties}
                      setAllBounties={setAllBounties}
                      showBountyBtn={true}
                      calculatedCount={discussionCount}
                      setCount={setCount}
                      isCollapsible={false}
                    />
                  }
                </div>
              </Waypoint>
            )}
            {isFetchComplete /* Performance Optimization */ && (
              <Waypoint
                onEnter={() => onSectionEnter(4)}
                topOffset={40}
                bottomOffset={"95%"}
              >
                <div className={css(styles.section)}>
                  <a name="paper pdf" />
                  <div className={css(styles.paperTabContainer)}>
                    <PaperTab
                      isEditorOfHubs={isEditorOfHubs}
                      isModerator={isModerator}
                      paper={paper}
                      paperId={paper.id}
                    />
                  </div>
                </div>
              </Waypoint>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PaperIndexWithUndux = (props) => {
  return (
    <PaperDraftUnduxStore.Container>
      <InlineCommentUnduxStore.Container>
        <Paper {...props} />
      </InlineCommentUnduxStore.Container>
    </PaperDraftUnduxStore.Container>
  );
};

export async function getStaticPaths(ctx) {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps(ctx) {
  let paper;
  const { paperId } = ctx.params;

  try {
    paper = await fetchPaper(API.PAPER({ paperId }), API.GET_CONFIG());
  } catch (err) {
    console.log("err", err);
    return {
      props: {
        error: {
          code: 500,
        },
      },
      revalidate: 5,
    };
  }

  if (!paper) {
    return {
      props: {
        error: {
          code: 404,
        },
      },
      revalidate: 1,
    };
  } else {
    const slugFromQuery = ctx.params.paperName;

    // DANGER ZONE: Be careful when updating this. Could result
    // in an infinite loop that could bring server down.
    if (paper.slug && paper.slug !== slugFromQuery) {
      return {
        redirect: {
          destination: `/paper/${paperId}/${paper.slug}`,
          permanent: true,
        },
      };
    }

    const props = {
      initialPaperData: paper,
      isFetchComplete: true,
    };

    return {
      props,
      // Static page will be regenerated after specified seconds.
      revalidate: 60,
    };
  }
}

const styles = StyleSheet.create({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
  },
  container: {
    marginTop: 30,
    marginBottom: 30,
  },
  main: {
    boxSizing: "border-box",
    width: 800,
    margin: "0 auto",
    [`@media only screen and (max-width: ${breakpoints.medium.str})`]: {
      width: "100%",
      paddingLeft: 25,
      paddingRight: 25,
    },
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      width: "100%",
      paddingLeft: 15,
      paddingRight: 15,
    },
  },
  discussionContainer: {},
  section: {
    marginTop: 25,
    paddingTop: 25,
    borderTop: `1px solid ${colors.GREY_LINE()}`,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  user: state.auth.user,
});

const mapDispatchToProps = {
  showMessage: MessageActions.showMessage,
  updateUser: AuthActions.updateUser,
  setUploadingPaper: AuthActions.setUploadingPaper,
  getLimitations: LimitationsActions.getLimitations,
  updatePaperState: PaperActions.updatePaperState,
  getThreads: PaperActions.getThreads,
  getBullets: BulletActions.getBullets,
  openPaperPDFModal: ModalActions.openPaperPDFModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaperIndexWithUndux);
