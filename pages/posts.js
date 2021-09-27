import HubPage from "~/components/Hubs/HubPage";
import { buildStaticPropsForFeed } from "~/config/utils/feed";

const Index = (props) => {
  return <HubPage home={true} {...props} />;
};

export const getStaticProps = buildStaticPropsForFeed({ docType: "posts" });

export default Index;
