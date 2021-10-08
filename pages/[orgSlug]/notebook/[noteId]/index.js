import Notebook from "~/components/Notebook/Notebook";
import HeadComponent from "~/components/Head";

const Index = () => {
  return (
    <>
      <HeadComponent title={"ResearchHub Notebook"} />
      <Notebook />
    </>
  );
};

export default Index;
