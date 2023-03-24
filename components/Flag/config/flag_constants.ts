export enum FLAG_REASON {
  SPAM = "Spam",
  COPYRIGHT = "Copyright Infringement",
  LOW_QUALITY = "Low Quality",
  NOT_CONSTRUCTIVE = "Not Constructive",
  PLAGIARISM = "Plagiarism",
  ABUSIVE_OR_RUDE = "Rude or Abusive",
  NOT_SPECIFIED = "Flag reason not specified",
}

export enum FLAG_REASON_DESCRIPTION {
  LOW_QUALITY = "Quality is unreasonably low, lacks scientific rigor or contains glaring issues",
  COPYRIGHT = "Cannot be publicly shared due to licensing. Likely behind a paywall",
  NOT_CONSTRUCTIVE = 'Does not move the conversation forward productively or re-iterates existing knowledge. e.g. "Thanks", "I agree", "+1"',
  PLAGIARISM = "Copied work or ideas of others without citation",
  ABUSIVE_OR_RUDE = "Aims to offend; not respectful of community members",
  SPAM = "Exists only to promote a product or service",
  NOT_SPECIFIED = "Not specified",
}
