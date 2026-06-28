/* functions/api/github/revert.js  →  POST /api/github/revert
   «Angre siste publisering»: ruller branchen tilbake til tilstanden FØR den
   siste commiten, ved å lage en ny commit som peker på forrige tre. Historikken
   beholdes (ingenting slettes) — angringen er bare nok en commit på toppen, som
   selv kan angres på nytt. Tokenet leses fra httpOnly-cookien og når aldri
   nettleseren.

   Body (valgfri): { expect: "<sha>" } — SHA-en redaktøren så som «siste» da
   hen trykket angre. Stemmer den ikke med faktisk HEAD, har noen andre publisert
   i mellomtiden, og vi avbryter med error:"head_moved" så UI kan be om å laste
   inn på nytt (vi angrer aldri en commit redaktøren ikke har sett).

   Svar: { ok, reverted:{sha,message,author}, restoredTo:{sha,message}, commit }
   eller { ok:false, error }. */
import { cfg, json, readCookie, gh } from './_common.js';

export async function onRequestPost(context) {
  var request = context.request, c = cfg(context.env);
  var token = readCookie(request, 'gh_token');
  if (!token) return json({ ok: false, error: 'not_authenticated' }, 401);
  if (!c.owner || !c.name) return json({ ok: false, error: 'repo_not_configured' }, 500);

  // Håndhev ALLOWED_LOGINS også her (forsvar i dybden) + få redaktørens navn.
  var who = await gh('/user', token);
  if (!who.ok || !who.data || !who.data.login) return json({ ok: false, error: 'not_authenticated' }, 401);
  if (c.allowed.length && c.allowed.indexOf(String(who.data.login).toLowerCase()) < 0) {
    return json({ ok: false, error: 'not_allowed' }, 403);
  }

  var body = {};
  try { body = await request.json(); } catch (e) { body = {}; }
  var expect = body && body.expect ? String(body.expect) : '';

  var base = '/repos/' + c.owner + '/' + c.name;

  // 1) nåværende branch-tip
  var ref = await gh(base + '/git/ref/heads/' + encodeURIComponent(c.branch), token);
  if (!ref.ok || !ref.data || !ref.data.object) return json({ ok: false, error: 'ref_failed', detail: ref.data }, 502);
  var headSha = ref.data.object.sha;

  // Konfliktvakt: ikke angre en annen commit enn den redaktøren så.
  if (expect && expect !== headSha) return json({ ok: false, error: 'head_moved', head: headSha }, 409);

  // 2) head-commiten (for melding + forelder)
  var head = await gh(base + '/git/commits/' + headSha, token);
  if (!head.ok || !head.data) return json({ ok: false, error: 'head_commit_failed', detail: head.data }, 502);
  var parents = head.data.parents || [];
  if (!parents.length) return json({ ok: false, error: 'nothing_to_revert' }, 400); // første commit, ingen forelder

  var parentSha = parents[0].sha;

  // 3) forelderens tre (= tilstanden vi ruller tilbake til)
  var parent = await gh(base + '/git/commits/' + parentSha, token);
  if (!parent.ok || !parent.data || !parent.data.tree) return json({ ok: false, error: 'parent_commit_failed', detail: parent.data }, 502);
  var parentTreeSha = parent.data.tree.sha;

  // 4) ny commit med forelderens tre, men HEAD som forelder (lineær framover-angring)
  var firstLine = String(head.data.message || '').split('\n')[0].slice(0, 200);
  var msg = '\u21a9 Angre publisering: ' + (firstLine || headSha.slice(0, 7));
  var commit = await gh(base + '/git/commits', token, {
    method: 'POST',
    body: { message: msg, tree: parentTreeSha, parents: [headSha] }
  });
  if (!commit.ok || !commit.data || !commit.data.sha) return json({ ok: false, error: 'commit_failed', detail: commit.data }, 502);

  // 5) flytt branchen (fast-forward, force:false)
  var upd = await gh(base + '/git/refs/heads/' + encodeURIComponent(c.branch), token, { method: 'PATCH', body: { sha: commit.data.sha, force: false } });
  if (!upd.ok) return json({ ok: false, error: 'ref_update_failed', detail: upd.data }, 502);

  var ha = (head.data.author || {});
  var pa = (parent.data.author || {});
  return json({
    ok: true,
    commit: commit.data.sha,
    reverted: { sha: headSha, message: firstLine, author: ha.name || '' },
    restoredTo: { sha: parentSha, message: String(parent.data.message || '').split('\n')[0].slice(0, 200), author: pa.name || '' },
    url: commit.data.html_url || ('https://github.com/' + c.repo + '/commit/' + commit.data.sha)
  });
}
