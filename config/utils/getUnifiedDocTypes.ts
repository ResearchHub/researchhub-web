type ReturnType = "post" | "paper" 

export function getUnifiedDocType(input: string | null | undefined) : string | null {
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