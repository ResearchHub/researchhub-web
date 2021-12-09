import EmptyState from "~/components/CKEditor/EmptyState.md";
import Error from "next/error";
import HeadComponent from "~/components/Head";
import Notebook from "~/components/Notebook/Notebook";
import nookies from "nookies";
import { AUTH_TOKEN } from "~/config/constants";
import { Helpers } from "@quantfive/js-web-config";
import { ROUTES as WS_ROUTES } from "~/config/ws";
import { captureError } from "~/config/utils/error";
import {
  createNewNote,
  createNoteContent,
  fetchOrg,
  fetchOrgNotes,
  updateOrgDetails,
} from "~/config/fetch";
import { useRouter } from "next/router";

const Index = ({ error }) => {
  const router = useRouter();

  if (error) {
    return <Error {...error} />;
  }

  return (
    <>
      <HeadComponent title={"ResearchHub Notebook"} />
      <Notebook wsAuth={true} wsUrl={WS_ROUTES.NOTE(router.query.orgSlug)} />
    </>
  );
};

export async function getServerSideProps(ctx) {
  const { params } = ctx;
  const { orgSlug } = params;

  const cookies = nookies.get(ctx);
  const authToken = cookies[AUTH_TOKEN];

  // Create a new note if no notes exist in org, otherwise push to first note.
  let notes = {
    results: [],
  };

  try {
    const response = await fetchOrgNotes({ orgSlug }, authToken);
    const parsed = await Helpers.parseJSON(response);
    console.log("response", response);
    if (response.ok) {
      notes = parsed.results;
    } else {
      captureError({
        msg: "could not fetch org notes",
        data: { orgSlug },
      });

      return {
        props: {
          error: {
            statusCode: response.status,
          },
        },
      };
    }
  } catch (error) {
    captureError({
      msg: "failed to fetch org notes",
      data: { orgSlug },
    });

    return {
      props: {
        error: {
          statusCode: 500,
        },
      },
    };
  }

  if (notes.length) {
    return {
      redirect: {
        destination: `/${orgSlug}/notebook/${notes[notes.length - 1].id}`,
        permanent: false,
      },
    };
  } else {
    const orgResponse = await fetchOrg({ orgSlug }, authToken);
    const org = orgResponse.results[0];
    if (!org.note_created) {
      const note = await handleCreateNewNote({ orgSlug }, authToken);

      await updateOrgDetails(
        { orgId: org.id, params: { note_created: true } },
        authToken
      );

      return {
        redirect: {
          destination: `/${orgSlug}/notebook/${note.id}`,
          permanent: false,
        },
      };
    }
  }

  return {
    props: {},
  };
}

const handleCreateNewNote = async ({ orgSlug }, authToken) => {
  const title = "Welcome to your new lab notebook!";
  const note = await createNewNote({ orgSlug, title }, authToken);

  await createNoteContent(
    {
      noteId: note.id,
      editorData: EmptyState,
      title: "Welcome to your new lab notebook!",
    },
    authToken
  );

  return note;
};

export default Index;
