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
  if (errorCode) {
    return <NextError statusCode={errorCode} />;
  }

  return null;
};

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const authToken = cookies[AUTH_TOKEN];

  if (!authToken) {
    return {
      redirect: {
        destination: `/login?redirect=${ctx.req.url}`,
        permanent: false,
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
