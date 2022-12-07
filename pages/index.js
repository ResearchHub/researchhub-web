import HubPage from "~/components/Hubs/HubPage";

function Page(props) {
  return <HubPage home={true} {...props} />;
}

export async function getStaticProps(ctx) {
  return {
    props: {},
  };
}

export default Page;
