export interface Env {
  AI: Ai;
  VECTORIZE: VectorizeIndex;
}

const CONTROLS = [
  { id: "CC6.1", text: "Logical access controls restrict access to systems and data, including MFA and least privilege." },
  { id: "CC6.6", text: "Boundary protection such as WAF and firewall rules protect against external threats." },
  { id: "CC7.2", text: "Systems are monitored for anomalies and security events, with logging and alerting." },
  { id: "CC6.7", text: "Data in transit is encrypted using TLS and transmission is restricted to authorized parties." },
];

async function embed(env: Env, texts: string[]) {
  const res: any = await env.AI.run("@cf/baai/bge-base-en-v1.5", { text: texts });
  return res.data as number[][];
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);

    if (url.pathname === "/ingest") {
      const vectors = await embed(env, CONTROLS.map(c => c.text));
      await env.VECTORIZE.upsert(
        CONTROLS.map((c, i) => ({
          id: c.id,
          values: vectors[i],
          metadata: { text: c.text },
        }))
      );
      return Response.json({ ingested: CONTROLS.length });
    }

    if (url.pathname === "/map") {
      const finding = url.searchParams.get("finding") ?? "";
      const [vec] = await embed(env, [finding]);
      const out = await env.VECTORIZE.query(vec, { topK: 3, returnMetadata: "all" });
      return Response.json({ finding, matches: out.matches });
    }

    return new Response("GET /ingest then /map?finding=...");
  },
};