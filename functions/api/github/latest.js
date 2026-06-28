/* functions/api/github/latest.js  →  GET /api/github/latest[?base=<sha>]
   Forteller nettleseren om siste commit på branchen (hvem publiserte, når) —
   brukt til «Sist publisert av …» og til konfliktsjekk før publisering.
   Med ?base=<sha> sammenligner den base…HEAD og returnerer hvilke filer som
   er endret siden, slik at admin kan advare hvis noen andre har publisert de
   samme filene mens du jobbet. Tokenet leses fra httpOnly-cookien. */
import { cfg, json, readCookie, gh } from './_common.js';

export async function onRequestGet(context) {
  var request = context.request, c = cfg(context.env);
  var token = readCookie(request, 'gh_token');
  if (!token) return json({ ok: false, error: 'not_authenticated' }, 401);
  if (!c.owner || !c.name) return json({ ok: false, error: 'repo_not_configured' }, 500);

  var base = '/repos/' + c.owner + '/' + c.name;
  var head = await gh(base + '/commits/' + encodeURIComponent(c.branch), token);
  if (!head.ok || !head.data || !head.data.sha) return json({ ok: false, error: 'head_failed', detail: head.data }, 502);

  var d = head.data;
  var commitAuthor = (d.commit && d.commit.author) || {};
  var out = {
    ok: true,
    sha: d.sha,
    author: (d.author && d.author.login) || commitAuthor.name || '',
    authorName: commitAuthor.name || (d.author && d.author.login) || '',
    date: commitAuthor.date || '',
    message: (d.commit && d.commit.message) || '',
    htmlUrl: d.html_url || ''
  };

  var baseSha = new URL(request.url).searchParams.get('base');
  if (baseSha && baseSha !== d.sha) {
    out.changedSince = true;
    var cmp = await gh(base + '/compare/' + encodeURIComponent(baseSha) + '...' + encodeURIComponent(d.sha), token);
    out.changedFiles = (cmp.ok && cmp.data && Array.isArray(cmp.data.files))
      ? cmp.data.files.map(function (f) { return f.filename; })
      : null; // null => kunne ikke sammenligne (ukjent)
  } else {
    out.changedSince = false;
  }
  return json(out);
}
