import Head from "next/head";
// import { useRouter } from "next/router";

import { COMPANY_NAME, METATAG_DEFAULT_IMAGE_URL } from "../config/constants";

const HeadComponent = (props) => {
  const { noindex } = props;
  const title = props.title || `${COMPANY_NAME} | Open Science Community`;
  const description =
    props.description ||
    `We're a community seeking to improve prioritization, collaboration, reproducibility, and funding of scientific research. Discuss and discover academic research on ${COMPANY_NAME}`;
  const socialImageUrl = props.socialImageUrl || METATAG_DEFAULT_IMAGE_URL;
  const url = props.url;

  return (
    <Head>
      <title>{title}</title>
      {props.graph && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(props.graph) }}
        />
      )}
      {/* {props.parentPaths && props.parentPaths.length > 0 && formatBreadCrumb()} */}
      <meta key="description" name="description" content={description} />
      {props.canonical && <link rel="canonical" href={props.canonical} />}
      {/* Social meta tags */}
      <meta property="og:description" content={description} />
      {/* Image dimensions: minimum 200x200; recommended 1500x1500 */}
      <meta property="og:image" content={socialImageUrl} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:image:secure_url" content={socialImageUrl} />
      <meta property="og:image:type" content={"image/png"} />
      <meta property="og:title" content={title} />
      <meta property="og:type" content={"Article"} />
      <meta property="og:site_name" content={COMPANY_NAME} />
      <meta property="og:url" content={url} />
      {/* Facebook */}
      <meta property="fb:app_id" content={"id"} />
      {(process.env.REACT_APP_ENV === "staging" || noindex) && (
        <meta name="robots" content="noindex" />
      )}
      {/* Twitter */}
      <meta
        property="twitter:card"
        name="twitter:card"
        content={"summary_large_image"}
      />
      <meta
        property="twitter:site"
        name="twitter:site"
        content={"@researchhub"}
      />
      <meta
        property="twitter:description"
        name="twitter:description"
        value={description}
      />
      <meta
        property="twitter:image"
        name="twitter:image"
        content={socialImageUrl}
      />
      {/* Left */}
      <meta property="twitter:label1" name="twitter:label1" value={title} />
      <meta property="twitter:data1" name="twitter:data1" value={title} />
      {/* Right */}
      <meta property="twitter:label2" name="twitter:label2" value={title} />
      <meta property="twitter:data2" name="twitter:data2" value={title} />
      <meta property="twitter:title" name="twitter:title" value={title} />
      <meta property="twitter:url" name="twitter:url" value={url} />
      {props.children}
    </Head>
  );
};

export default HeadComponent;
