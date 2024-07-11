import { createContext, useContext, useState } from "react";
import { FullAuthorProfile, parseFullAuthorProfile } from "./types";
import { fetchAuthorProfile } from "./api";

export type AuthorProfileContextType = {
  fullAuthorProfile: FullAuthorProfile;
  isLoadingPublications: boolean;
  setFullAuthorProfile: (fullAuthorProfile: FullAuthorProfile) => void;
  setIsLoadingPublications: (isLoadingPublications: boolean) => void;
  reloadAuthorProfile: () => void;
};

const AuthorProfileContext = createContext<AuthorProfileContextType>({
  // @ts-ignore ignoring because fullAuthorProfile will always be set
  fullAuthorProfile: null,
  isLoadingPublications: false,
  setFullAuthorProfile: () => {
    throw new Error("setFullAuthorProfile() not implemented");
  },
  setIsLoadingPublications: () => {
    throw new Error("setIsLoadingPublications() not implemented");
  },
  reloadAuthorProfile: () => {
    throw new Error("reloadAuthorProfile() not implemented");
  },
});

export const authorProfileContext = () => useContext(AuthorProfileContext);

export const AuthorProfileContextProvider = ({
  children,
  fullAuthorProfile,
}) => {
  const [_fullAuthorProfile, setFullAuthorProfile] =
    useState<FullAuthorProfile>(fullAuthorProfile);
  const [isLoadingPublications, setIsLoadingPublications] = useState(false);

  const reloadAuthorProfile = async () => {
    const profile = await fetchAuthorProfile({
      authorId: _fullAuthorProfile.id as string,
    });
    const fullAuthorProfile = parseFullAuthorProfile(profile);
    setFullAuthorProfile(fullAuthorProfile);
  };

  return (
    <AuthorProfileContext.Provider
      value={{
        fullAuthorProfile: _fullAuthorProfile,
        setFullAuthorProfile,
        isLoadingPublications,
        setIsLoadingPublications,
        reloadAuthorProfile,
      }}
    >
      {children}
    </AuthorProfileContext.Provider>
  );
};
