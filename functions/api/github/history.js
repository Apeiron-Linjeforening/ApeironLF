/* functions/api/github/history.js  →  GET /api/github/history[?n=<antall>]
   Returnerer de siste commitene på branchen (hvem, hva, når) — brukt til
   «Angre siste publisering»-kortet, så redaktøren ser nøyaktig hva som blir
   angret før hen trykker. Tokenet leses fra httpOnly-cookien. */
import { cfg, json, readCookie, gh } from './_common.js';

export async function onRequestGet(context) {
  var request = context.request, c = cfg(context.env);
  var token = readCookie(request, 'gh_token');
  if (!token) return json({ ok: false, error: 'not_authenticated' }, 401);
  if (!c.owner || !c.name) return json({ ok: false, error: 'repo_not_configured' }, 500);

  var n = parseInt(new URL(request.url).searchParams.get('n'), 10);
  if (!(n > 0)) n = 10;
  if (n > 30) n = 30;

  var base = '/repos/' + c.owner + '/' + c.name;
  var r = await gh(base + '/commits?sha=' + encodeURIComponent(c.branch) + '&per_page=' + n, token);
  if (!r.ok || !Array.isArray(r.data)) return json({ ok: false, error: 'history_failed', detail: r.data }, 502);

  var commits = r.data.map(function (d) {
    var a = (d.commit && d.commit.author) || {};
    return {
      sha: d.sha,
      author: (d.author && d.author.login) || a.name || '',
      authorName: a.name || (d.author && d.author.login) || '',
      date: a.date || '',
      message: (d.commit && d.commit.message) || '',
      parents: (d.parents || []).map(function (p) { return p.sha; }),
      htmlUrl: d.html_url || ''
    };
  });
  return json({ ok: true, commits: commits });
}
