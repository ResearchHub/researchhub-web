const reviewCategories = {
  "overall": {
    label: "Overall Rating",
    value: "overall",
    description: "What are your overall impressions of this paper?",
    isDefault: true,
  },
  "impact": {
    label: "Impact",
    value: "impact",
    description: "What research question do the authors address? Does the study advance the author's field in a meaningful way?",
    isDefault: false,
  },  
  "methods": {
    label: "Methods",
    value: "methods",
    description: "Does the experiment design adequately test the study's hypothesis? Are the methods described in enough detail for independent replication?",
    isDefault: false,
  },
  "results": {
    label: "Results",
    value: "results",
    description: "Was the collected data analyzed and presented reasonably? Do the figures clearly represent this data?",
    isDefault: false,
  },
  "discussion": {
    label: "Discussion",
    value: "discussion",
    description: "Do the results support the authors' conclusions? Are there any alternative interpretations of the data that the authors should have considered?",
    isDefault: false,
  },    
}

export default reviewCategories;
