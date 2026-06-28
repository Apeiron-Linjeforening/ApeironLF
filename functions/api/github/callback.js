/* functions/api/github/callback.js  →  GET /api/github/callback
   GitHub sender brukeren hit med ?code=&state=. Vi sjekker state mot
   cookien, bytter koden mot et token (server-side, med client_secret),
   og lagrer tokenet i en httpOnly-cookie. Tokenet når ALDRI nettleser-JS. */
import { cfg, origin, redirect, readCookie, setCookie } from './_common.js';

export async function onRequestGet(context) {
  var request = context.request, c = cfg(context.env);
  var u = new URL(request.url);
  var code = u.searchParams.get('code');
  var state = u.searchParams.get('state');
  var saved = readCookie(request, 'gh_state');

  if (!code || !state || !saved || state !== saved) {
    return redirect(origin(request) + '/admin.html?gh=error&reason=state', { 'Set-Cookie': setCookie('gh_state', '', 0) });
  }

  var redirectUri = origin(request) + '/api/github/callback';
  var res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'apeiron-admin' },
    body: JSON.stringify({ client_id: c.clientId, client_secret: c.clientSecret, code: code, redirect_uri: redirectUri })
  });
  var data = null;
  try { data = await res.json(); } catch (e) {}
  var token = data && data.access_token;

  if (!token) {
    return redirect(origin(request) + '/admin.html?gh=error&reason=token', { 'Set-Cookie': setCookie('gh_state', '', 0) });
  }

  // Slett state-cookien og sett token-cookien (30 dager). To Set-Cookie via Headers.
  var headers = new Headers();
  headers.append('Location', origin(request) + '/admin.html?gh=ok');
  headers.append('Cache-Control', 'no-store');
  headers.append('Set-Cookie', setCookie('gh_state', '', 0));
  headers.append('Set-Cookie', setCookie('gh_token', token, 2592000));
  return new Response(null, { status: 302, headers: headers });
}
