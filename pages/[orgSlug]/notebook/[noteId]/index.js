import Notebook from "~/components/Notebook/Notebook";
import HeadComponent from "~/components/Head";
import nookies from "nookies";
import { AUTH_TOKEN } from "~/config/constants";
import { fetchNote } from "~/config/fetch";
import Error from "next/error";

const Index = ({ note, currentOrg, error }) => {

  console.log('note', note);
  console.log('currentOrg', currentOrg);

  if (error) {
    return (
      <Error statusCode={error.code} />
    );
  }

  return (
    <>
      <HeadComponent title={"ResearchHub Notebook"} />
      <Notebook note={note} currentOrg={currentOrg} />
    </>
  );
};

export async function getServerSideProps(ctx) {
  const { query, req, params } = ctx;
  const { noteId } = params;

  const cookies = nookies.get(ctx);
  const authToken = cookies[AUTH_TOKEN];

  let note;
  try {
    note = await fetchNote({ noteId }, authToken);
  }
  catch (err) {
    console.error("Failed to fetch note", noteId);
    return {
      props: {
        error: {
          code: 404
        }
      }
    }
  }

  return {
    props: {
      note,
      currentOrg: note?.organization
    }
  }
}

export default Index;
