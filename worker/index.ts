interface Env {
  CLUSTER: string
  USAGE: string
  PASSAGE: string
  VITE_API_URL: string
}

export default {
  fetch(request, env) {
    const url = new URL(request.url);
    
    if (url.pathname === "/env") {
      return Response.json({
        CLUSTER: env.CLUSTER,
        USAGE: env.USAGE,
        PASSAGE: env.PASSAGE,
        API_BASE_URL: env.VITE_API_URL
      });
    }

    if (url.pathname.startsWith("/api/")) {
      return Response.json({
        name: "Cloudflare",
      });
    }
		return new Response(null, { status: 404 });
  }
} satisfies ExportedHandler<Env>
