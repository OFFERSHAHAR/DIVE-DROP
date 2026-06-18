const http = require("http");

const PORT = Number(process.env.AGENT_GATEWAY_PORT || 8080);
const FLASK = { host: "127.0.0.1", port: 5000, name: "app" };
const N8N = { host: "127.0.0.1", port: 5678, name: "n8n" };
const OLLAMA = { host: "127.0.0.1", port: 11434, name: "ollama" };

const FLASK_PREFIXES = [
  "/app",
  "/agents",
  "/model-status",
  "/model-command",
  "/model-override",
  "/profile",
  "/memory",
  "/flow",
  "/agent-usage",
  "/admin",
  "/file-write",
  "/local-path-context",
  "/users",
];

function startsWithPath(url, path) {
  return url === path || url.startsWith(path + "/") || url.startsWith(path + "?");
}

function chooseTarget(url) {
  const cleanUrl = url || "/";
  if (startsWithPath(cleanUrl, "/ollama")) {
    return OLLAMA;
  }
  if (FLASK_PREFIXES.some((path) => startsWithPath(cleanUrl, path))) {
    return FLASK;
  }
  return N8N;
}

function rewritePath(url, target) {
  const cleanUrl = url || "/";
  if (target === OLLAMA) {
    const rewritten = cleanUrl.replace(/^\/ollama(?=\/|\?|$)/, "");
    return rewritten || "/";
  }
  return cleanUrl;
}

const server = http.createServer((req, res) => {
  const target = chooseTarget(req.url || "/");
  const path = rewritePath(req.url || "/", target);
  const headers = { ...req.headers, host: target.host + ":" + target.port };

  const proxyReq = http.request({
    hostname: target.host,
    port: target.port,
    method: req.method,
    path,
    headers,
  }, (proxyRes) => {
    res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on("error", (error) => {
    const body = JSON.stringify({
      ok: false,
      error: "gateway_target_unavailable",
      target: target.name,
      message: error.message,
    });
    res.writeHead(502, {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    });
    res.end(body);
  });

  req.pipe(proxyReq);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("Agent gateway listening on http://127.0.0.1:" + PORT);
  console.log("/app and agent API routes -> Flask 5000");
  console.log("/ollama/* -> Ollama 11434");
  console.log("everything else -> n8n 5678");
});
