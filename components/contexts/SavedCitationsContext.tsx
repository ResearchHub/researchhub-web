/** This context is meant to provide components of the app the ability to tap into a user's saved citations */

import { createContext, useContext, useEffect, useState } from "react";
import { buildApiUri } from "~/config/utils/buildApiUri";
import API from "~/config/api";
import { Helpers } from "@quantfive/js-web-config";
import { ID } from "~/config/types/root_types";

const fetchSavedUserCitations = () => {
  return fetch(
    buildApiUri({
      apiPath: `citation_entry/saved_user_citations`,
    }),
    API.GET_CONFIG()
  )
    .then(Helpers.parseJSON)
    .then((data: any) => {
      return data.map(parseSavedCitation);
    });
};

export type SavedCitation = {
  id: ID;
  organizationId: ID;
  projectId: ID;
  relatedUnifiedDocumentId: ID;
};

export const parseSavedCitation = (data: any): SavedCitation => {
  return {
    id: data.id,
    organizationId: data.organization_id,
    projectId: data.project_id,
    relatedUnifiedDocumentId: data.related_unified_doc_id,
  };
};

export type SavedCitationsContextType = {
  savedCitations: SavedCitation[];
  setSavedCitations: (savedCitations: SavedCitation[]) => void;
};

const SavedCitationsContext = createContext<SavedCitationsContextType>({
  savedCitations: [],
  setSavedCitations: () => {
    throw new Error("setSavedCitations() not implemented");
  },
});

export const savedCitationsContext = () => useContext(SavedCitationsContext);

export const SavedCitationsContextProvider = ({ children }) => {
  const [savedCitations, setSavedCitations] = useState<SavedCitation[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const savedCitations = await fetchSavedUserCitations();
        setSavedCitations(savedCitations);
      } catch (error) {
        console.warn("Failed fetching saved citations", error);
      }
    })();
  }, []);

  return (
    <SavedCitationsContext.Provider
      value={{
        savedCitations,
        setSavedCitations,
      }}
    >
      {children}
    </SavedCitationsContext.Provider>
  );
};
