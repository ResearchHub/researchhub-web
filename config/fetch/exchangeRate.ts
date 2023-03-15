import API, { generateApiUrl } from "../../config/api";

export const fetchExchangeRate = async () => {
  const url = generateApiUrl("exchange_rate", "?page_size=1");
  const resp = await fetch(url, API.GET_CONFIG());
  if (!resp.ok) {
    throw new Error("Failed to fetch exchange rate");
  }

  const json = await resp.json();
  return json;
};
