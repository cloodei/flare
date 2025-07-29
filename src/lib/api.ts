const opts: RequestInit = {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" }
};
let cluster: string, usage: string, passage: string, base: string;

function off() {
  fetch(`${base}/logoff`, {
    credentials: "include"
  });
}

function out() {
  return fetch(`${base}/logout`, opts);
}

async function init() {
  const fetchEnv = await fetch("/env");
  const env = await fetchEnv.json();

  cluster = env.cluster;
  usage = env.usage;
  passage = env.passage;
  base = env.base;
}

async function getAllReadings() {
  let refresh = false;
  let response = await fetch(`${base}/readings`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    }
  });

  if (response.status === 401) {
    const res = await fetch(`${base}/refresh`, opts);
    if (!res.ok)
      return 0 as const;

    const result = await res.json();
    const { access_token: newAccessToken, user } = result;

    localStorage.setItem("access_token", newAccessToken);
    localStorage.setItem("user", JSON.stringify(user));

    response = await fetch(`${base}/readings`, {
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

export { cluster, usage, passage, base, getAllReadings, init, out, off };
