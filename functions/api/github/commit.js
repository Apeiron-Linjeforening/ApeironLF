/* functions/api/github/commit.js  →  POST /api/github/commit
   Committer ett sett filer som ÉN commit på branchen (default main) via
   GitHubs Git Data API. Tokenet leses fra httpOnly-cookien — det når aldri
   nettleseren. Body:
     { message: string, files: [ { path, content, encoding } ] }
   encoding: "utf-8" (tekst) eller "base64" (binært, f.eks. bilder).
   Svar: { ok, commit, url } eller { ok:false, error }. */
import { cfg, json, readCookie, gh } from './_common.js';

// Sikkerhetsvakt: Admin-panelet skal BARE publisere innhold (tekst, HTML,
// bilder) — aldri selve byggekjeden eller server-/sikkerhetskonfigurasjonen.
// Det hindrer at en kapret admin-økt kan plante en bakdør (egen Cloudflare-
// funksjon, en GitHub Action) eller svekke sikkerhetshodene/CSP-en. Disse
// stiene endres kun via vanlig git-push av en utvikler, aldri via admin.
function isForbiddenPath(p) {
  var x = String(p == null ? '' : p).replace(/^\/+/, '').toLowerCase();
  if (x.indexOf('..') >= 0) return true;             // ingen sti-traversering
  if (x.indexOf('functions/') === 0) return true;    // Cloudflare Pages Functions (server-kode)
  if (x.indexOf('.github/') === 0) return true;      // GitHub Actions / workflows
  if (x === '_headers' || x === '_redirects') return true; // HTTP-headere (CSP) + redirects
  if (x === 'api-config.js') return true;            // API-nøkkel-stub
  if (x === '.gitignore' || x === 'wrangler.toml') return true;
  return false;
}

export async function onRequestPost(context) {
  var request = context.request, c = cfg(context.env);
  var token = readCookie(request, 'gh_token');
  if (!token) return json({ ok: false, error: 'not_authenticated' }, 401);
  if (!c.owner || !c.name) return json({ ok: false, error: 'repo_not_configured' }, 500);

  var body;
  try { body = await request.json(); } catch (e) { return json({ ok: false, error: 'bad_json' }, 400); }
  var files = Array.isArray(body.files) ? body.files : [];
  var message = (body.message || 'Oppdater innhold via admin').toString().slice(0, 500);
  if (!files.length) return json({ ok: false, error: 'no_files' }, 400);
  if (files.length > 200) return json({ ok: false, error: 'too_many_files' }, 400);

  // Håndhev ALLOWED_LOGINS også her (forsvar i dybden).
  if (c.allowed.length) {
    var who = await gh('/user', token);
    if (!who.ok || !who.data || c.allowed.indexOf(String(who.data.login).toLowerCase()) < 0) {
      return json({ ok: false, error: 'not_allowed' }, 403);
    }
  }

  var base = '/repos/' + c.owner + '/' + c.name;

  // 1) nåværende branch-tip
  var ref = await gh(base + '/git/ref/heads/' + encodeURIComponent(c.branch), token);
  if (!ref.ok || !ref.data || !ref.data.object) return json({ ok: false, error: 'ref_failed', detail: ref.data }, 502);
  var baseCommitSha = ref.data.object.sha;

  // 2) tre-sha for base-commit
  var baseCommit = await gh(base + '/git/commits/' + baseCommitSha, token);
  if (!baseCommit.ok || !baseCommit.data || !baseCommit.data.tree) return json({ ok: false, error: 'base_commit_failed' }, 502);
  var baseTreeSha = baseCommit.data.tree.sha;

  // 3) lag blob per fil
  var treeItems = [];
  for (var i = 0; i < files.length; i++) {
    var f = files[i];
    if (!f || !f.path) continue;
    if (isForbiddenPath(f.path)) return json({ ok: false, error: 'forbidden_path', path: f.path }, 403);
    var enc = f.encoding === 'base64' ? 'base64' : 'utf-8';
    var blob = await gh(base + '/git/blobs', token, { method: 'POST', body: { content: String(f.content == null ? '' : f.content), encoding: enc } });
    if (!blob.ok || !blob.data || !blob.data.sha) return json({ ok: false, error: 'blob_failed', path: f.path, detail: blob.data }, 502);
    treeItems.push({ path: String(f.path).replace(/^\/+/, ''), mode: '100644', type: 'blob', sha: blob.data.sha });
  }
  if (!treeItems.length) return json({ ok: false, error: 'no_valid_files' }, 400);

  // 4) nytt tre oppå basetreet
  var tree = await gh(base + '/git/trees', token, { method: 'POST', body: { base_tree: baseTreeSha, tree: treeItems } });
  if (!tree.ok || !tree.data || !tree.data.sha) return json({ ok: false, error: 'tree_failed', detail: tree.data }, 502);

  // 5) ny commit
  var commit = await gh(base + '/git/commits', token, { method: 'POST', body: { message: message, tree: tree.data.sha, parents: [baseCommitSha] } });
  if (!commit.ok || !commit.data || !commit.data.sha) return json({ ok: false, error: 'commit_failed', detail: commit.data }, 502);

  // 6) flytt branchen til den nye commiten
  var upd = await gh(base + '/git/refs/heads/' + encodeURIComponent(c.branch), token, { method: 'PATCH', body: { sha: commit.data.sha, force: false } });
  if (!upd.ok) return json({ ok: false, error: 'ref_update_failed', detail: upd.data }, 502);

  return json({ ok: true, commit: commit.data.sha, count: treeItems.length, url: commit.data.html_url || ('https://github.com/' + c.repo + '/commit/' + commit.data.sha) });
}
