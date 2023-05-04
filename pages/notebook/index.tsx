/* 
  The main purpos of this file is to redirect user to their default
  organization notebook.
*/
import nookies from "nookies";
import NextError from "next/error";
import { AUTH_TOKEN } from "~/config/constants";
import { generateApiUrl } from "~/config/api";
import { fetchUserOrgs } from "~/config/fetch";
import { captureEvent } from "~/config/utils/events";

interface Props {
  errorCode: number;
}

const NotebookPage = ({ errorCode }: Props) => {
  console.log("errorCode", errorCode);

  if (errorCode) {
    return <NextError statusCode={errorCode} />;
  }

  return null;
};

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const authToken = cookies[AUTH_TOKEN];

  // Ideally, we should redirect user to login page if they don't have an auth token
  // However, because we do not have such a page, we will redirect them to 404
  // Open issue: https://github.com/ResearchHub/researchhub-web/issues/1408
  if (!authToken) {
    return {
      props: {
        errorCode: 404,
      },
    };
  }

  const url = generateApiUrl(`organization/0/get_user_organizations`);

  // @ts-ignore
  const allUserOrgs: Array<any> = await fetchUserOrgs({ url }, authToken);

  // Precondition: Every user should have at least one organization
  // Precondition: Last org is the default org
  // This is obviously not a great way to check, but it's the best we can do for now
  const org = allUserOrgs[allUserOrgs.length - 1];

  if (!org) {
    // This scenario should not happen.
    captureEvent({
      error: new Error("No organizations found for user"),
      data: { allUserOrgs },
    });
    return {
      props: {
        errorCode: 500,
      },
    };
  }

  return {
    redirect: {
      destination: `${org.slug}/notebook`,
      permanent: false,
    },
  };
}

export default NotebookPage;
