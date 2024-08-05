import {
  AuthorInstitution,
  parseInstitution,
} from "~/components/Institution/lib/types";
import { Hub, parseHub } from "~/config/types/hub";
import {
  AuthorProfile,
  Education,
  ID,
  parseAuthorProfile,
  parseEducation,
} from "~/config/types/root_types";

export type Achievement = "CITED_AUTHOR" | "OPEN_ACCESS" | "OPEN_SCIENCE_SUPPORTER" | "EXPERT_PEER_REVIEWER_1" | "EXPERT_PEER_REVIEWER_2" | "EXPERT_PEER_REVIEWER_3" | "EXPERT_PEER_REVIEWER_4" | "EXPERT_PEER_REVIEWER_5" | "HIGHLY_UPVOTED_1" | "HIGHLY_UPVOTED_2" | "HIGHLY_UPVOTED_3" | "HIGHLY_UPVOTED_4" | "HIGHLY_UPVOTED_5";

export type FullAuthorProfile = {
  id: ID;
  firstName: string;
  lastName: string;
  hasVerifiedPublications: boolean;
  profileImage?: string;
  headline?: string;
  user: {
    id: ID;
    createdDate: string;
    isVerified: boolean;
  } | null;
  description?: string;
  openAlexIds: Array<string>;
  institutions: Array<AuthorInstitution>;
  coauthors: Array<AuthorProfile>;
  education: Array<Education>;
  hIndex: number;
  i10Index: number;
  createdDate: string;
  orcidUrl?: string;
  linkedInUrl?: string;
  googleScholarUrl?: string;
  xUrl?: string;
  reputation: Reputation | null;
  reputationList: Array<Reputation>;
  activityByYear: Array<{
    year: number;
    worksCount: number;
    citationCount: number;
  }>;  
  };
  
export type AuthorSummaryStats = {
  openAccessPct: number;
  worksCount: number;
  citationCount: number;
  twoYearMeanCitedness: number;
  peerReviewCount: number;
  upvotesReceived: number;
  amountFunded: number;
}

export type Reputation = {
  score: number;
  bins: Array<Array<number>>;
  hub: Hub;
  percentile: number;
};

export type YearlyActivity = {
  year: number;
  worksCount: number;
  citationCount: number;
}

export const parseReputation = (raw: any): Reputation => {
  const percentile = Math.ceil(raw.percentile * 100);
  return {
    score: raw.score,
    bins: raw.bins,
    hub: parseHub(raw.hub),
    percentile,
  };
};

export const parseReputationList = (raw: any): Array<Reputation> => {
  return raw.map((rep) => parseReputation(rep));
};

function ensureSufficientYears(activityData: YearlyActivity[]): YearlyActivity[] {
  const currentYear = new Date().getFullYear();
  const yearsRequired = 12;
  const yearsPresent = new Set(activityData.map((activity) => activity.year));
  const completedData: YearlyActivity[] = [...activityData];

  for (let i = 0; i < yearsRequired; i++) {
    const yearToCheck = currentYear - i;
    if (!yearsPresent.has(yearToCheck)) {
      completedData.push({
        worksCount: 0,
        citationCount: 0,
        year: yearToCheck,
      });
    }
  }

  // Sort the data by year in descending order
  completedData.sort((a, b) => b.year - a.year);

  return completedData;
}  

export const parseAuthorAchievements = (raw: any): Array<Achievement> => {
  return ["OPEN_SCIENCE_SUPPORTER", "HIGHLY_UPVOTED_5", "EXPERT_PEER_REVIEWER_5", "CITED_AUTHOR", "OPEN_ACCESS"]  //raw.achievements || [];
}

export const parseAuthorSummaryStats = (raw: any): AuthorSummaryStats => {
  return {
    worksCount: raw.summary_stats.works_count,
    citationCount: raw.summary_stats.citation_count,
    twoYearMeanCitedness: raw.summary_stats.two_year_mean_citedness,
    upvotesReceived: raw.summary_stats.upvote_count,
    amountFunded: raw.summary_stats.amount_funded || 0,
    openAccessPct: Math.round((raw.open_access_pct || 0) * 100),
    peerReviewCount: raw.summary_stats.peer_review_count,
  }
}

export const parseFullAuthorProfile = (raw: any): FullAuthorProfile => {
  const parsed:FullAuthorProfile = {
    id: raw.id,
    hasVerifiedPublications: true, // Temporarily hard-coding this until we decide whether verfication is necessary
    profileImage: raw.profile_image,
    firstName: raw.first_name,
    lastName: raw.last_name,
    description: raw.description,
    headline: raw?.headline?.title || "",
    openAlexIds: raw.openalex_ids || [],
    education: Array.isArray(raw.education)
      ? raw.education.map((edu) => parseEducation(edu))
      : [],
    hIndex: raw.h_index,
    i10Index: raw.i10_index,
    createdDate: raw.created_date,
    coauthors: raw.coauthors.map((coauthor) => parseAuthorProfile(coauthor)),
    orcidUrl: raw.orcid_id,
    linkedInUrl: raw.linkedin,
    googleScholarUrl: raw.google_scholar,
    xUrl: raw.twitter,    
    user: null,
    activityByYear: (raw.activity_by_year || []).map((activity):YearlyActivity => ({
      year: activity.year,
      worksCount: activity.works_count,
      citationCount: activity.citation_count,
    })),
    institutions: raw.institutions.map((inst) => {
      return {
        id: inst.id,
        institution: parseInstitution(inst.institution),
        years: inst.years,
      };
    }),
    reputation: raw.reputation ? parseReputation(raw.reputation) : null,
    reputationList: parseReputationList(raw.reputation_list),
  };

  if (raw.user) {
    parsed.user = {
      id: raw?.user?.id,
      createdDate: raw?.user?.created_date,
      isVerified: raw?.user?.is_verified || false,
    }
  }

  // Sometimes activity by year includes missing years
  try {
    parsed.activityByYear = ensureSufficientYears(parsed.activityByYear);
  }
  catch(e) {
    // Ignore error
  }
  
  return parsed;
};

// To be used when we do not have any reputation set yet
export const DEMO_BINS: Array<Reputation> = [
  {
    score: 0,
    bins: [
      [0, 1000],
      [1000, 10000],
      [10000, 100000],
      [100000, 1000000],
    ],
    hub: {
      id: null,
      slug: "",
      name: "Biology",
      relevancyScore: 0,
      description: "",
    },
    percentile: 0,
  },
  {
    score: 0,
    bins: [
      [0, 1000],
      [1000, 10000],
      [10000, 100000],
      [100000, 1000000],
    ],
    hub: {
      id: null,
      slug: "",
      name: "Chemistry",
      relevancyScore: 0,
      description: "",
    },
    percentile: 0,
  },
  {
    score: 0,
    bins: [
      [0, 1000],
      [1000, 10000],
      [10000, 100000],
      [100000, 1000000],
    ],
    hub: {
      id: null,
      slug: "",
      name: "Economics",
      relevancyScore: 0,
      description: "",
    },
    percentile: 0,
  },
];
