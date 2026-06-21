/* functions/api/github/login.js  →  GET /api/github/login
   Starter GitHub OAuth web-flow. Setter en state-cookie og sender
   brukeren til GitHub for å godkjenne. */
import { cfg, origin, redirect, setCookie, randHex } from './_common.js';

export async function onRequestGet(context) {
  var c = cfg(context.env);
  if (!c.clientId) return new Response('GITHUB_CLIENT_ID mangler i miljøvariabler.', { status: 500 });
  var state = randHex(16);
  var redirectUri = origin(context.request) + '/api/github/callback';
  var url = 'https://github.com/login/oauth/authorize'
    + '?client_id=' + encodeURIComponent(c.clientId)
    + '&redirect_uri=' + encodeURIComponent(redirectUri)
    + '&scope=' + encodeURIComponent(c.scope)
    + '&state=' + encodeURIComponent(state)
    + '&allow_signup=false';
  return redirect(url, { 'Set-Cookie': setCookie('gh_state', state, 600) });
}
