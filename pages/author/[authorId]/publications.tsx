import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { fetchAuthorProfile, fetchAuthorOverview, PaginatedPublicationResponse, fetchAuthorPublications, parsePublicationResponse } from "~/components/Author/lib/api";
import { parseFullAuthorProfile } from "~/components/Author/lib/types";
import HorizontalTabBar from "~/components/HorizontalTabBar";
import { css, StyleSheet } from "aphrodite";
import { buildAuthorTabs } from "~/components/Author/lib/utils";
import { useRouter } from "next/router";
import AuthorProfileHeader from "~/components/Author/Profile/AuthorProfileHeader";
import { useState } from "react";
import { getDocumentCard } from "~/components/UnifiedDocFeed/utils/getDocumentCard";
import AddPublicationsModal from "~/components/Publication/AddPublicationsModal";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import { useSelector } from "react-redux";
import Button from "~/components/Form/Button";
import { parseUser } from "~/config/types/root_types";
import { RootState } from "~/redux";
import { isEmpty } from "~/config/utils/nullchecks";

type Args = {
  profile: any;
  publicationsResponse: any;
};

const AuthorProfilePage: NextPage<Args> = ({ profile, publicationsResponse }) => {

  const router = useRouter();

  
  if (!profile || !publicationsResponse) {
    // TODO: Need a skeleton loading state
    return <div>Loading...</div>;
  }

  const [_publicationsResponse, setPublicationsResponse] = useState<PaginatedPublicationResponse>(parsePublicationResponse(publicationsResponse));
  const fullAuthorProfile = parseFullAuthorProfile(profile);
  const authorTabs = buildAuthorTabs({ profile: fullAuthorProfile, router });
  const auth = useSelector((state: any) => state.auth);
  const currentUser = useSelector((state: RootState) =>
    isEmpty(state.auth?.user) ? null : parseUser(state.auth.user)
  );
    
  return (
    <div className={css(styles.profilePage)}>
      <div className={css(styles.profileContent)}>
        <AuthorProfileHeader profile={fullAuthorProfile} />
      </div>
      <div className={css(styles.tabsWrapper)}>
        <HorizontalTabBar tabs={authorTabs} />
      </div>
      <div className={css(styles.mainContentWrapper)}>
        <div className={css(styles.mainContent)}>
          
          <div className={css(styles.wrapper)}>
            <div className={css(styles.sectionHeader)}>Publications</div>
            {currentUser?.authorProfile?.id === fullAuthorProfile.id && (
              // @ts-ignore legacy
              <AddPublicationsModal
                // @ts-ignore legacy
                wsUrl={WS_ROUTES.NOTIFICATIONS(auth?.user?.id)}
                // @ts-ignore legacy
                wsAuth
              >
                  <Button>Add Publications</Button>
              </AddPublicationsModal>
            )}
            <div className={css(styles.contentWrapper)}>
              <div>
                {/* @ts-ignore */}
                {getDocumentCard({ unifiedDocumentData: publicationsResponse.results })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = StyleSheet.create({
  profilePage: {
    backgroundColor: "rgb(250, 250, 250)",
  },
  profileContent: {
    width: "1000px",
    margin: "0 auto",
  },
  activityWrapper: {
    width: 700,
    marginTop: 20,
  },
  mainContentWrapper: {
    margin: "0 auto",
    backgroundColor: "rgb(255, 255, 255)",
    borderTop: "1px solid #DEDEE6",
    border: "1px solid #F5F5F9",
    padding: 20,
  },
  mainContent: {
    width: "1000px",
    margin: "0 auto",
  },
  tabsWrapper: {
    width: "1000px",
    margin: "0 auto",
    marginTop: 20,
  },


  wrapper: {
  },
  contentWrapper: {
    display: "flex",
  },
  sectionHeader: {
    color: "rgb(139, 137, 148, 1)",
    textTransform: "uppercase",
    fontWeight: 500,
    letterSpacing: "1.2px",
    fontSize: 12,
    display: "flex",
    alignItems: "center",
    gap: 5,
    marginBottom: 20,
    marginTop: 20,
  },    
});

export const getStaticProps: GetStaticProps = async (ctx) => {
  const profile = await fetchAuthorProfile({ authorId: ctx!.params!.authorId as string })
  const publicationsResponse = await fetchAuthorPublications({ authorId: ctx!.params!.authorId as string })

  return {
    props: {
      profile,
      publicationsResponse,
    },
    revalidate: 86000,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export default AuthorProfilePage;
