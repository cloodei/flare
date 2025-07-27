const opts: RequestInit = {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" }
};
let CLUSTER: string, USAGE: string, PASSAGE: string, API_BASE_URL: string;

function off() {
  fetch(`${API_BASE_URL}/logoff`, {
    credentials: "include"
  });
}

function out() {
  return fetch(`${API_BASE_URL}/logout`, opts);
}

async function init() {
  const fetchEnv = await fetch("/env");
  const env = await fetchEnv.json();

  CLUSTER = env.CLUSTER;
  USAGE = env.USAGE;
  PASSAGE = env.PASSAGE;
  API_BASE_URL = env.API_BASE_URL;
}

async function getAllReadings() {
  let refresh = false;
  let response = await fetch(`${API_BASE_URL}/readings`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    }
  });

  if (response.status === 401) {
    const res = await fetch(`${API_BASE_URL}/refresh`, opts);
    if (!res.ok)
      return 0 as const;

    const result = await res.json();
    const { access_token: newAccessToken, user } = result;

    localStorage.setItem("access_token", newAccessToken);
    localStorage.setItem("user", JSON.stringify(user));

    response = await fetch(`${API_BASE_URL}/readings`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${newAccessToken}`
      }
    });
    if (!response.ok)
      throw new Error("Unable to fetch data: " + response.statusText);

    refresh = true;
  }
  else if (!response.ok)
    throw new Error("Unable to fetch data: " + response.statusText);

  const data: { temperature: number; humidity: number; room: string; created_at: string; }[] = await response.json();
  return {
    data: data.map(item => ({
      temperature: item.temperature,
      humidity: item.humidity,
      room: item.room,
      time: new Date(item.created_at)
    })),
    refresh
  };
}

export { CLUSTER, USAGE, PASSAGE, API_BASE_URL, getAllReadings, init, out, off };
