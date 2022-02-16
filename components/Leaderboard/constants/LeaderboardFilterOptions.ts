export const filterOptions = [
  {
    value: "today",
    label: "Today",
  },
  {
    value: "past_week",
    label: "Past Week",
  },
  {
    value: "past_month",
    label: "Past Month",
  },
  {
    value: "past_year",
    label: "Past Year",
    disableScope: true,
  },
  {
    value: "all_time",
    label: "All Time",
    disableScope: true,
  },
];

export const createdOptions = [
  {
    value: "created_date",
    label: "Paper Submission Date",
  },
  {
    value: "published_date",
    label: "Paper Published Date",
  },
];

export const createdByOptions = [
  {
    value: "created_date",
    label: "Paper Submission Date",
  },
]

export const defaultState = {
  items: [],
  hubId: null,
  fetchingLeaderboard: true,
  by: defaultBy, 
  createdByOptions,
  filterBy: defaultFilterBy,
  loadingMore: false,
  page: 1,
  next: null,
  type: null,
}