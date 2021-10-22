import Notebook from "~/components/Notebook/Notebook";
import HeadComponent from "~/components/Head";

const Index = ({ note }) => {
  return (
    <>
      <HeadComponent title={"ResearchHub Notebook"} />
      <Notebook />
    </>
  );
};

export default Index;
