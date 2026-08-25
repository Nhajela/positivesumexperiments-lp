// Response helpers for the machine-readable endpoints.
//
// Every endpoint sends `Access-Control-Allow-Origin: *` — the whole point of
// publishing this is that another site can fetch it from the browser without
// asking anyone. All of it is already public on the pages it mirrors.

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
} as const;

export function json(data: unknown, status = 200): Response {
  return new Response(`${JSON.stringify(data, null, 2)}\n`, {
    status,
    headers: { ...CORS, "Content-Type": "application/json; charset=utf-8" },
  });
}

export function notFound(what: string): Response {
  return json({ error: "not_found", message: `No such ${what}.` }, 404);
}

export function xml(
  document: string,
  contentType = "application/xml",
): Response {
  return new Response(document, {
    headers: { ...CORS, "Content-Type": `${contentType}; charset=utf-8` },
  });
}
