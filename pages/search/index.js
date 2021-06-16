import HubPage from "~/components/Hubs/HubPage";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";

const Index = (props) => {
  const config = {
    route: "all",
  };

  fetch(API.SEARCH({ search: "mastering", config }), API.GET_CONFIG())
    .then(Helpers.checkStatus)
    .then(Helpers.parseJSON)
    .then((resp) => {
      console.log(resp);
    });

  return null;
};

export async function getServerSideProps(context) {
  return { props: {} };
}

export default Index;
