interface Env {
  VITE_MQTT_CLUSTER_WS: string;
  VITE_MQTT_USERNAME: string;
  VITE_MQTT_PASSWORD: string;
  VITE_API_URL: string;
}

export default {
  fetch(request, env, _ctx) {
    const url = new URL(request.url);
    
    if (url.pathname === "/env") {
      return Response.json({
        MQTT_CLUSTER_WS: env.VITE_MQTT_CLUSTER_WS,
        MQTT_USERNAME: env.VITE_MQTT_USERNAME,
        MQTT_PASSWORD: env.VITE_MQTT_PASSWORD,
        API_BASE_URL: env.VITE_API_URL,
      });
    }

    if (url.pathname.startsWith("/api/")) {
      return Response.json({
        name: "Cloudflare",
      });
    }
		return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
