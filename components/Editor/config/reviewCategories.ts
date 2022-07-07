const reviewCategories = {
  "overall": {
    label: "Overall Rating",
    value: "overall",
    description: "What are your overall impressions of this paper?",
    isDefault: true,
  },
  "data": {
    label: "Data and Figures",
    value: "data",
    description: "Consistency of data; Quality of statistical analysis; Quality and clarity of figures and labels",
    isDefault: false,
  },
  "methods": {
    label: "Methods and Materials",
    value: "methods",
    description: "Experiment design clearly described; materials if any are enumerated ..",
    isDefault: false,
  },
  "conclusions": {
    label: "Conclusions",
    value: "conclusions",
    description: "Are conclusions based on results and backed by data?",
    isDefault: false,
  },    
}

export default reviewCategories;
