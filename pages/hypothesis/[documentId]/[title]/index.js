import Script from "next/script";
import HypothesisContainer from "~/components/Hypothesis/HypothesisContainer";

export default function Hypothesis(props) {
  return (
    <>
      <HypothesisContainer />
      <Script src="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js" />
      <Script
        src="https://cdn.jsdelivr.net/npm/katex@0.11.0/dist/contrib/mhchem.min.js"
        strategy="lazyOnload" // this script needs to load after the main katex script
      />
    </>
  );
}
