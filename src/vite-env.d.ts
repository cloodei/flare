/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_MQTT_CLUSTER_WS: string;
  readonly VITE_MQTT_CLUSTER_URL: string;
  readonly VITE_MQTT_USERNAME: string;
  readonly VITE_MQTT_PASSWORD: string;
}
