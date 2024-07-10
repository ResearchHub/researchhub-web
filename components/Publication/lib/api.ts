import { Helpers } from "@quantfive/js-web-config";
import { OpenAlexWork, parseOpenAlexWork, parseOpenAlexAuthor, OpenAlexAuthor } from "~/components/Verification/lib/types";
import API, { generateApiUrl } from "~/config/api";
import { ID } from "~/config/types/root_types";
import { AuthorClaimError } from "./types";

interface Props {
  doi: ID;
  authorId?: ID;
}

type PublicationsByDoiResponse = {
  works: OpenAlexWork[];
  selectedAuthorId: ID;
  availableAuthors: OpenAlexAuthor[];
};

const parsePublicationsByDoi = (data: any): PublicationsByDoiResponse => {
  return {
    works: data.works.map((w) => parseOpenAlexWork(w, true)),
    availableAuthors: data.available_authors.map(parseOpenAlexAuthor),
    selectedAuthorId: data.selected_author_id,
  };
}

export const fetchPublicationsByDoi = ({ doi, authorId }: Props): Promise<PublicationsByDoiResponse> => {
  const url = generateApiUrl(`paper/fetch_publications_by_doi`, `?doi=${doi} ${authorId ? `&author_id=${authorId}` : '' }` );
  return fetch(url, API.GET_CONFIG())
  .then((resp: any) => {
    if (resp.status === 404) {
      throw new Error('404');
    }
    return resp;
  })
    .then(Helpers.parseJSON)
    .then((resp: any) => {
      return parsePublicationsByDoi(resp);
    })
};

export const addPublicationsToAuthor = ({ authorId, openAlexPublicationIds }: {
  authorId: ID,
  openAlexPublicationIds: ID[],
} ) => {
  const url = generateApiUrl(`author/${authorId}/add_publications`);
  return fetch(url, API.POST_CONFIG({
    openalex_ids: openAlexPublicationIds,
  }))
    .then(Helpers.parseJSON)
}

export const claimProfileAndAddPublications = ({ authorId, openAlexPublicationIds, openAlexAuthorId }: {
  authorId: ID,
  openAlexPublicationIds: ID[],
  openAlexAuthorId?: ID,
} ) => {
  const url = generateApiUrl(`author/${authorId}/claim_profile_and_add_publications`);
  return fetch(url, API.POST_CONFIG({
    openalex_ids: openAlexPublicationIds,
    openalex_author_id: "https://openalex.org/A5068835581",
  }))
  .then(async (resp: any) => {
    const body = await resp.json()

    if (resp.ok) {
      return body;
    }
    else {
      throw new AuthorClaimError(body.reason);
    }
  })
}