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
        cluster: env.CLUSTER,
        usage: env.USAGE,
        passage: env.PASSAGE,
        base: env.VITE_API_URL
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
