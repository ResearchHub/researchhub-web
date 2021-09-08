type ReturnType = "post" | "paper" | null

export function getUnifiedDocType(input: string | null | undefined): ReturnType {
  const lowerCasedInput = input?.toLowerCase() ?? null
  switch(lowerCasedInput) {
    case 'discussion':
      return 'post';
    case 'paper':
      return 'paper';
    default: 
      return null;
  }
}