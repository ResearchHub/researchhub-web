const reviewCategories = {
  "overall": {
    label: "Overall Rating",
    value: "overall",
    description: "What are your overall impressions of this paper?",
    isDefault: true,
  },
  "innovation": {
    label: "Impact and Innovation",
    value: "innovation",
    description: "Do the methods, design or conclusions of this paper have any societal, technological or scientific impact?",
    isDefault: false,
  },  
  "methods": {
    label: "Methods and Materials",
    value: "methods",
    description: "Experiment design clearly described; materials if any are enumerated.",
    isDefault: false,
  },
  "data": {
    label: "Data and Figures",
    value: "data",
    description: "Consistency of data; Quality of statistical analysis; Quality and clarity of figures and labels",
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
