# soc2-vectorize-demo

Cloudflare Worker: embed SOC 2 control texts with `bge-base-en-v1.5` (768-d) and
cosine-search them against audit findings via Vectorize.

## Usage

```bash
npm i
npx wrangler vectorize create soc2-controls --dimensions=768 --metric=cosine
npx wrangler deploy
```

```bash
curl https://<your-worker>.workers.dev/ingest
curl "https://<your-worker>.workers.dev/map?finding=WAF%20is%20disabled%20on%20production%20zone"
```

## Sample link

```bash
$ curl https://soc2-vectorize-demo.kali69017.workers.dev/map?finding=WAF%20is%20disabled%20on%20production%20zone
# TODO: paste real output after deploy
```