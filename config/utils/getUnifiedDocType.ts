type FEReturnType = "hypothesis" | "post" | "paper" | null;
type BEReturnType = "discussion" | "hypothesis" | "paper" | null;

// this function is used to resolve BE model name discrepencies with FE naming conventions
// the return type is intentionally kept strict.
export function getUnifiedDocType(
  input: string | null | undefined
): FEReturnType {
  const lowerCasedInput = input?.toLowerCase() ?? null;
  switch (lowerCasedInput) {
    case "discussion":
    case "post":
    case "posts":
      return "post";
    case "hypothesis":
      return "hypothesis";
    case "paper":
      return "paper";
    default:
      return null;
  }
}

// this function is used to resolve FE type name to with BE naming conventions
export function getBEUnifiedDocType(
  input: string | null | undefined
): BEReturnType {
  const lowerCasedInput = input?.toLowerCase() ?? null;
  switch (lowerCasedInput) {
    case "post":
    case "posts":
      return "discussion";
    case "hypothesis":
      return "hypothesis";
    case "paper":
      return "paper";
    default:
      return null;
  }
}
