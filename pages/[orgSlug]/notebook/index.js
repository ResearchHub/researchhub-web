import nookies from "nookies";
import Notebook from "~/components/Notebook/Notebook";
import {
  createNewNote,
  createNoteContent,
  fetchOrg,
  fetchOrgNotes,
  updateOrgDetails,
} from "~/config/fetch";
import EmptyState from "~/components/CKEditor/EmptyState.md";
import { AUTH_TOKEN, PRIVATE_ELN_ORG_PARAM } from "~/config/constants";
import Error from "next/error";
import { Helpers } from "@quantfive/js-web-config";
import { captureError } from "~/config/utils/error";

import HeadComponent from "~/components/Head";

const Index = ({ error }) => {
  if (error) {
    return <Error {...error} />;
  }

  return (
    <>
      <HeadComponent title={"ResearchHub Notebook"} />
      <Notebook />
    </>
  );
};

export async function getServerSideProps(ctx) {
  const { query, req, params } = ctx;
  const { orgSlug } = params;
  const isPrivateNotebook = orgSlug === PRIVATE_ELN_ORG_PARAM;

  const cookies = nookies.get(ctx);
  const authToken = cookies[AUTH_TOKEN];

  // Create a new note if no notes exist in org, otherwise push to first note.
  let notes = {
    results: [],
  };

  try {
    const response = await fetchOrgNotes(
      { orgSlug: isPrivateNotebook ? 0 : orgSlug },
      authToken
    );
    const parsed = await Helpers.parseJSON(response);

    if (response.ok) {
      notes = parsed.results;
    } else {
      captureError({
        msg: "could not fetch org notes",
        data: { orgSlug, isPrivateNotebook },
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
      data: { orgSlug, isPrivateNotebook },
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
      const note = await handleCreateNewNote(
        { isPrivateNotebook, orgSlug },
        authToken
      );

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

const handleCreateNewNote = async (
  { isPrivateNotebook, orgSlug },
  authToken
) => {
  const title = "Welcome to your new lab notebook!";
  let note;
  if (isPrivateNotebook) {
    note = await createNewNote({ title }, authToken);
  } else {
    note = await createNewNote({ orgSlug, title }, authToken);
  }

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
