/* functions/api/github/me.js  →  GET /api/github/me
   Forteller nettleseren om brukeren er innlogget (og hvem). Håndhever
   ALLOWED_LOGINS hvis satt. Tokenet leses fra httpOnly-cookien. */
import { cfg, json, readCookie, setCookie, gh } from './_common.js';

export async function onRequestGet(context) {
  var request = context.request, c = cfg(context.env);
  var token = readCookie(request, 'gh_token');
  if (!token) return json({ authenticated: false });

  var r = await gh('/user', token);
  if (!r.ok || !r.data || !r.data.login) {
    return json({ authenticated: false }, 200, { 'Set-Cookie': setCookie('gh_token', '', 0) });
  }
  var login = String(r.data.login);
  if (c.allowed.length && c.allowed.indexOf(login.toLowerCase()) < 0) {
    return json({ authenticated: false, error: 'not_allowed', login: login }, 403, { 'Set-Cookie': setCookie('gh_token', '', 0) });
  }
  return json({
    authenticated: true,
    login: login,
    name: r.data.name || login,
    avatar: r.data.avatar_url || '',
    repo: c.repo,
    branch: c.branch
  });
}
