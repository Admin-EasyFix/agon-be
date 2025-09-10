const STRAVA_API_BASE = "https://www.strava.com/api/v3";

export function stravaFetch<T>(
  endpoint: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<T> {
  return fetch(`${STRAVA_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Strava API error: ${res.status} ${res.statusText}`);
      }
      return res.json() as Promise<T>;
    })
}
