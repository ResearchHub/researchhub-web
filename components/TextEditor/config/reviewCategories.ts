const reviewCategories = {
  overall: {
    label: "Overall Rating",
    value: "overall",
    description: "What are your overall impressions of this paper?",
    isDefault: true,
  },
  impact: {
    label: "Impact",
    value: "impact",
    description:
      "Is the research question innovative? Do the study's findings advance the authors' field in a meaningful way?",
    isDefault: false,
  },
  methods: {
    label: "Methods",
    value: "methods",
    description:
      "Does the study design test the authors' hypothesis? Are the methods described in enough detail for independent replication?",
    isDefault: false,
  },
  results: {
    label: "Results",
    value: "results",
    description:
      "Were the study's findings analyzed and interpreted reasonably ? Is the resulting data open and auditable?",
    isDefault: false,
  },
  discussion: {
    label: "Discussion",
    value: "discussion",
    description:
      "Do the results support the authors’ conclusions? Are there any alternative interpretations of the study's findings that the authors should have considered?",
    isDefault: false,
  },
};

export default reviewCategories;
