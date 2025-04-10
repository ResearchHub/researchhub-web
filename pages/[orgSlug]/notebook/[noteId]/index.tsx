import HeadComponent from "~/components/Head";
import Notebook from "~/components/Notebook/Notebook";
import Script from "next/script";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import { useRouter } from "next/router";
import { fetchNote } from "~/config/fetch";
import nookies from "nookies";
import { ENV_AUTH_TOKEN } from "~/config/utils/auth";
import NextError from "next/error";
import { Helpers } from "@quantfive/js-web-config";
import ensureAuthenticated from "~/config/auth/ensureAuthenticated";

interface Props {
  errorCode?: number;
  errorText?: string;
}

const Index = ({ errorCode, errorText }: Props) => {
  const router = useRouter();

  if (errorCode) {
    return <NextError statusCode={errorCode} title={errorText} />;
  }

  return (
    <>
      <HeadComponent title={"ResearchHub Notebook"} />
      {/* @ts-ignore */}
      <Notebook wsAuth={true} wsUrl={WS_ROUTES.NOTE(router.query.orgSlug)} />
      <Script src="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js" />
      <Script
        src="https://cdn.jsdelivr.net/npm/katex@0.11.0/dist/contrib/mhchem.min.js"
        strategy="lazyOnload" // this script needs to load after the main katex script
      />
    </>
  );
};

export async function getServerSideProps(ctx) {
  const authResponse = await ensureAuthenticated({ nextPageContext: ctx });
  if (!authResponse.isAuthenticated) {
    return authResponse.redirectResponse;
  } else if (authResponse.errorResponse) {
    return authResponse.errorResponse;
  }

  // Precondition: User is logged in
  const cookies = nookies.get(ctx);
  const authToken = cookies[ENV_AUTH_TOKEN];
  let response: Response;
  try {
    response = await fetchNote({ noteId: ctx.params.noteId }, authToken)
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON);
  } catch (error: any) {
    if (error?.response?.status === 403 || error?.response?.status === 401) {
      return {
        props: {
          errorCode: 403,
          errorText: "You do not have permission to view this page",
        },
      };
    } else {
      return {
        props: {
          errorCode: 500,
        },
      };
    }
  }

  return {
    props: {},
  };
}

export default Index;
