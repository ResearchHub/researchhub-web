import Notebook from "~/components/Notebook/Notebook";
import HeadComponent from "~/components/Head";
import nookies from "nookies";
import { AUTH_TOKEN } from "~/config/constants";
import { fetchNote } from "~/config/fetch";
import Error from "next/error";

const Index = ({ note }) => {
  return (
    <>
      <HeadComponent title={"ResearchHub Notebook"} />
      <Notebook />
    </>
  );
};

export default Index;
