type ReturnType = "hypothesis" | "post" | "paper" | null;

// this function is used to resolve BE model name discrepencies with FE naming conventions
// the return type is intentionally kept strict.
export function getUnifiedDocType(
  input: string | null | undefined
): ReturnType {
  const lowerCasedInput = input?.toLowerCase() ?? null;
  switch (lowerCasedInput) {
    case "discussion":
      return "post";
    case "hypothesis":
      return "hypothesis";
    case "paper":
      return "paper";
    default:
      return null;
  }
}
