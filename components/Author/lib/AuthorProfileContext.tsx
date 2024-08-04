import { createContext, useContext, useState } from "react";
import { Achievement, AuthorSummaryStats, FullAuthorProfile, parseFullAuthorProfile } from "./types";
import { fetchAuthorProfile } from "./api";

export type AuthorProfileContextType = {
  fullAuthorProfile: FullAuthorProfile;
  isLoadingPublications: boolean;
  summaryStats: AuthorSummaryStats;
  achievements: Array<Achievement>;
  setFullAuthorProfile: (fullAuthorProfile: FullAuthorProfile) => void;
  setIsLoadingPublications: (isLoadingPublications: boolean) => void;
  reloadAuthorProfile: () => void;
  setAchievements: (achievements: Array<Achievement>) => void;
  setSummaryStats: (summaryStats: AuthorSummaryStats) => void;
};

const AuthorProfileContext = createContext<AuthorProfileContextType>({
  // @ts-ignore ignoring because fullAuthorProfile will always be set
  fullAuthorProfile: null,
  isLoadingPublications: false,
  // @ts-ignore ignoring because achievements will always be set
  summaryStats: null,
  setFullAuthorProfile: () => {
    throw new Error("setFullAuthorProfile() not implemented");
  },
  setIsLoadingPublications: () => {
    throw new Error("setIsLoadingPublications() not implemented");
  },
  reloadAuthorProfile: () => {
    throw new Error("reloadAuthorProfile() not implemented");
  },
  setAchievements: () => {
    throw new Error("setAchievements() not implemented");
  },
  setSummaryStats: () => {
    throw new Error("setSummaryStats() not implemented");
  },
});

export const authorProfileContext = () => useContext(AuthorProfileContext);

export const AuthorProfileContextProvider = ({
  children,
  fullAuthorProfile,
  achievements,
  summaryStats,
}) => {
  const [_fullAuthorProfile, setFullAuthorProfile] =
    useState<FullAuthorProfile>(fullAuthorProfile);
    const [_summaryStats, setSummaryStats] =
    useState<AuthorSummaryStats>(summaryStats);    
    const [_achievements, setAchievements] = useState<Array<Achievement>>(achievements);
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
        achievements,
        summaryStats,
        setFullAuthorProfile,
        isLoadingPublications,
        setIsLoadingPublications,
        reloadAuthorProfile,
        setSummaryStats,
        setAchievements,
      }}
    >
      {children}
    </AuthorProfileContext.Provider>
  );
};
