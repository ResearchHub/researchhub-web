import HeadComponent from "~/components/Head";
import Notebook from "~/components/Notebook/Notebook";
import Script from "next/script";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import { useRouter } from "next/router";
import { fetchNote } from "~/config/fetch";
import nookies from "nookies";
import { AUTH_TOKEN } from "~/config/constants";
import { captureEvent } from "~/config/utils/events";
import NextError from "next/error";
import { Helpers } from "@quantfive/js-web-config";
import API from "~/config/api";

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
  const cookies = nookies.get(ctx);
  const authToken = cookies[AUTH_TOKEN];
console.log('authToken', authToken)

  let authResponse: Response;
  try {
    authResponse = await fetch(API.USER({}), API.GET_CONFIG(authToken))
      .then(Helpers.checkStatus)
      .then(Helpers.parseJSON)
  }
  catch(error:any) {
    console.log('error', error)
    return;
  }

  console.log('authResponse', authResponse)

  let response: Response;
  try {
    response = await fetchNote({ noteId: ctx.params.noteId }, authToken);
  }
  catch (error: any) {
    if (error?.response?.status === 401) {
      return {
        redirect: {
          destination: `/login?redirect=${ctx.req.url}`,
          permanent: false,
        },
      };
    }
    else {
      return {
        props: {
          errorCode: 500,
        },
      }
    }
  }



  const isAuthError = response.status === 401 || response.status === 403;
  if (isAuthError) {
    if (authToken) {

      


      return {
        props: {
          errorCode: 403,
          errorText: "You do not have permission to view this page",
        },        
      }
    }
    else {
      return {
        redirect: {
          destination: `/login?redirect=${ctx.req.url}`,
          permanent: false,
        },      
      }
    }
  }
  
  const isOtherError = response.status > 400;
  if (isOtherError) {
    return {
      props: {
        errorCode: response.status,
      },
    }    
  }

  return {
    props: {},
  };


}

export default Index;
