import HubPage from "~/components/Hubs/HubPage";
import Chatbot from "~/components/Chatbot";

function Page(props) {
  return (
    <div>
      <HubPage home={true} {...props} />
      {/* Add the Chatbot component below your HubPage */}
      <Chatbot />
    </div>
  );
}

export async function getStaticProps(ctx) {
  return {
    props: {},
  };
}

export default Page;
