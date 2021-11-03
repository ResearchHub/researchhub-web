import HeadComponent from "~/components/Head";
import Notebook from "~/components/Notebook/Notebook";
import Script from 'next/script'

const Index = ({ note }) => {
  return (
    <>
      <HeadComponent title={"ResearchHub Notebook"} />
      <Notebook />
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
