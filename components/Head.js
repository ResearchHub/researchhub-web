import Head from "next/head";

export default (props) => {
  const title = props.title || "ResearchHub | Open Science Community";
  const description =
    props.description ||
    "We're a community seeking to improve prioritization, collaboration, reproducibility, and funding of scientific research. Discuss and discover academic research on Research Hub";
  return (
    <Head>
      <title>{title}</title>
      <meta key="description" name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta property="og:title" content={title} />
      {props.children}
    </Head>
  );
};
