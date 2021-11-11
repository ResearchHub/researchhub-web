import HeadComponent from "~/components/Head";
import Notebook from "~/components/Notebook/Notebook";
import Script from 'next/script'
import { ROUTES as WS_ROUTES } from "~/config/ws";
import { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();

  return (
    <>
      <HeadComponent title={"ResearchHub Notebook"} />
      <Notebook
        wsAuth={true}
        wsUrl={WS_ROUTES.NOTE(router.query.orgSlug)}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/katex@0.11.0/dist/contrib/mhchem.min.js"
        strategy="lazyOnload" // this script needs to load after the main katex script
      />
    </>
  );
};

export default Index;
