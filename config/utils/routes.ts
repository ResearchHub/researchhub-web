type UserPageTab =
  | "overview"
  | "discussions"
  | "authored-papers"
  | "contributions"
  | "posts"
  | "transactions";

type TimePeriod =
  | "today"
  | "past-week"
  | "past-month"
  | "past-year"
  | "all-time";

export const ROUTES = {
  home: "/",
  about: "/about",
  mods: "/moderators/author-claim-case-dashboard?case_status=OPEN",
  live: "/live",
  referral: "/referral",
  hubs: {
    all: "/hubs",
    my: "my-hubs",
    one: (hub: string) => `/hubs/${hub}`,
  },
  leaderboard: {
    users: (hub?: string, period?: TimePeriod) =>
      "/leaderboard/users" +
      (hub ? `/${hub}` : "") +
      (period ? `/${period}` : ""),
    authors: (hub?: string, period?: TimePeriod) =>
      "/leaderboard/authors" +
      (hub ? `/${hub}` : "") +
      (period ? `/${period}` : ""),
    papers: (hub?: string, period?: TimePeriod) =>
      "/leaderboard/papers" +
      (hub ? `/${hub}` : "") +
      (period ? `/${period}` : ""),
  },
  paper: {
    upload: "/paper/upload/info",
    one: (id: string, title?: string, discussionThreadId?: string) =>
      `/paper/${id}` +
      (title ? `/${title}` : "") +
      (title && discussionThreadId ? `/${discussionThreadId}` : ""),
  },
  post: {
    create: "/post/create",
    one: (id: string, title?: string, discussionThreadId?: string) =>
      `/post/${id}` +
      (title ? `/${title}` : "") +
      (title && discussionThreadId ? `/${discussionThreadId}` : ""),
  },
  hypothesis: {
    create: "/hypothesis/create",
    one: (id: string, title?: string, discussionThreadId?: string) =>
      `/hypothesis/${id}` +
      (title ? `/${title}` : "") +
      (title && discussionThreadId ? `/${discussionThreadId}` : ""),
  },
  user: {
    tab: (userId: string, tab: UserPageTab) => `/user/${userId}/${tab}`,
    settings: "/user/settings",
  },
} as const;
