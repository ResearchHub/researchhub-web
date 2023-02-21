import { generateApiUrl, GET_CONFIG } from "./fetch";

export async function getUser() {
  const url = generateApiUrl({ pathName: "user/" });
  try {
    const resp = await fetch(url, GET_CONFIG({}));
    if (resp.ok) {
      const json = await resp.json();
      const user = json.results[0];
      return { isLoggedIn: !!user, user };
    }
  } catch (error) {}
  return { isLoggedIn: false };
}
