import HubPage from "~/components/Hubs/HubPage";
import { buildStaticPropsForFeed } from "~/config/utils/feed";

const Index = (props) => {
  return <HubPage home={true} {...props} />;
};

export async function getStaticProps(ctx) {
  return buildStaticPropsForFeed({ docType: "hypothesis", feed: 0 });
}

export default Index;
