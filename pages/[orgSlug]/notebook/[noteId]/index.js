import Notebook from "~/components/Notebook/Notebook";
import HeadComponent from "~/components/Head";
import nookies from "nookies";
import { AUTH_TOKEN } from "~/config/constants";

const Index = () => {
  return (
    <>
      <HeadComponent title={"ResearchHub Notebook"} />
      <Notebook />
    </>
  );
};

// export async function getServerSideProps(ctx) {
//   const { query, req, params } = ctx;
//   const { orgSlug } = params;
//
//   const cookies = nookies.get(ctx);
//   const authToken = cookies[AUTH_TOKEN];
//
//
//
// }

export default Index;
