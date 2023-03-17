import { toTitleCase } from "~/config/utils/string";
import Error from "next/error";
import fetchHubFromSlug from "~/pages/hubs/api/fetchHubFromSlug";
import Head from "~/components/Head";
import HubPage from "~/components/Hubs/HubPage";

function Index({ slug, hub, error, isLiveFeed }) {
  if (error) {
    return <Error statusCode={error.code} />;
  }

  return (
    <div>
      <Head
        title={
          hub
            ? toTitleCase(hub.name) + " on ResearchHub"
            : toTitleCase(slug) + " on ResearchHub"
        }
        description={
          hub
            ? "Discuss and Discover " + toTitleCase(hub.name)
            : "Discuss and Discover " + toTitleCase(slug)
        }
      />
      <HubPage
        hub={hub}
        slug={slug}
        isLiveFeed={isLiveFeed}
        isHomePage={false}
      />
    </div>
  );
}

export async function getStaticPaths(ctx) {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps(ctx) {
  let hub;

  try {
    hub = await fetchHubFromSlug({ slug: ctx.params.slug });
  } catch (err) {
    console.log("err", err);
    return {
      props: {
        error: {
          code: 500,
        },
      },
      revalidate: 5,
    };
  }

  if (!hub) {
    return {
      props: {
        error: {
          code: 404,
        },
      },
      revalidate: 5,
    };
  }

  return {
    props: {
      hub,
      slug: ctx.params.slug,
      isLiveFeed: true,
    },
    revalidate: 60 * 10,
  };
}

export default Index;
