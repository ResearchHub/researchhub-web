import nookies from "nookies";

import Notebook from "~/components/Notebook/Notebook";
import {
  createNewNote,
  createNoteContent,
  fetchOrgNotes,
} from "~/config/fetch";
import EmptyState from "~/components/CKEditor/EmptyState.md";
import { AUTH_TOKEN, PRIVATE_ELN_ORG_PARAM } from "~/config/constants";

const Index = () => {
  return <Notebook />;
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
  if (isPrivateNotebook) {
    const response = await fetchOrgNotes({ orgId: 0 }, authToken);
    notes = response;
  } else {
    const response = await fetchOrgNotes(
      { orgId: currentOrganization.id },
      authToken
    );
    notes = response;
  }

  if (notes.length) {
    return {
      redirect: {
        destination: `/${orgSlug}/notebook/${notes[0].id}`,
        permanent: false,
      },
    };
  } else {
    const note = await handleCreateNewNote({ isPrivateNotebook }, authToken);

    console.log(note);
    return {
      redirect: {
        destination: `/${orgSlug}/notebook/${note.id}`,
        permanent: false,
      },
    };
  }
}

const handleCreateNewNote = async ({ isPrivateNotebook }, authToken) => {
  const title = "Welcome to your new lab notebook!";
  let note;
  if (isPrivateNotebook) {
    note = await createNewNote({ title }, authToken);
  } else {
    note = await createNewNote({ orgId: currentOrg.id, title }, authToken);
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
