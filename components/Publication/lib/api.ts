import { Helpers } from "@quantfive/js-web-config";
import { OpenAlexWork, parseOpenAlexWork, parseOpenAlexAuthor, OpenAlexAuthor } from "~/components/Verification/lib/types";
import API, { generateApiUrl } from "~/config/api";
import { ID } from "~/config/types/root_types";

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
    works: data.works.map(parseOpenAlexWork),
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
