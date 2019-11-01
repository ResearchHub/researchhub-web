import Head from "next/head";

export default (props) => {
  const title = props.title || "Research Hub";
  const description =
    props.description ||
    "Discuss and discover academic research on Research Hub";
  return (
    <Head>
      <title>{title}</title>
      <meta key="description" name="description" content={description} />
      {props.children}
    </Head>
  );
};
