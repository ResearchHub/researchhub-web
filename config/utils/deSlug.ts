export function deSlug(slug: string): string {
  return slug
    .split("-")
    .map((str: string): string => str.charAt(0).toUpperCase() + str.slice(1))
    .join(" ");
}
