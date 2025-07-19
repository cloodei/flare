let MQTT_CLUSTER_WS: string, MQTT_USERNAME: string, MQTT_PASSWORD: string, API_BASE_URL: string;

async function init() {
  const fetchEnv = await fetch("/env");
  const env = await fetchEnv.json();

  MQTT_CLUSTER_WS = env.MQTT_CLUSTER_WS;
  MQTT_USERNAME = env.MQTT_USERNAME;
  MQTT_PASSWORD = env.MQTT_PASSWORD;
  API_BASE_URL = env.API_BASE_URL;
}

async function getAllReadings() {
  let refresh = false, response = await fetch(`${API_BASE_URL}/readings`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("access_token")}`
    }
  });
  if (response.status === 400) {
    const res = await fetch(`${API_BASE_URL}/refresh`, {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();
    if (!res.ok)
      throw new Error(result.message || "Failed to refresh token");

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

  const data: {
    data: {
      temperature: number;
      humidity: number;
      room: string;
      time: Date;
    }[]
    refresh: boolean
  } = { data: (await response.json()).map((item: { temperature: number; humidity: number; room: string; created_at: string; }) => ({
    temperature: item.temperature,
    humidity: item.humidity,
    room: item.room,
    time: new Date(item.created_at)
  })), refresh };

  return data;
}

export { MQTT_CLUSTER_WS, MQTT_USERNAME, MQTT_PASSWORD, API_BASE_URL, getAllReadings, init };
