import Head from "next/head";

export default (props) => {
  const title = props.title || "ResearchHub";
  const description =
    props.description ||
    "Discuss and discover academic research on ResearchHub";
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
