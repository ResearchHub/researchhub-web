import { getCategories, getHubs } from "~/config/fetch_hubs";
import HubsListPage from "~/components/Hubs/HubsListPage";

function HubsIndex(props){

  console.log("yooooo");

  return (
    <HubsListPage {...props} />
  )
}


export async function getStaticProps() {
console.log("11111");
  const categories = await getCategories();
  const { hubsByCategory } = await getHubs();

  return {
    props: {
      categories,
      hubsByCategory 
    }
  }
}

export default HubsIndex;