export function logFetchError(fetchResponse) {
  const message = `Error fetching ${fetchResponse.url}:`;
  console.log(message, fetchResponse.status, fetchResponse.statusText);
}
