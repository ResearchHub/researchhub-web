import HubPage from "~/components/Hubs/HubPage";
import HomeContainer from "~/researchhub-citation-manager/renderer/components/home/HomeContainer.tsx";

function Page(props) {
  return <HomeContainer home={true} {...props} />;
}

export async function getStaticProps(ctx) {
  return {
    props: {},
  };
}

export default Page;
