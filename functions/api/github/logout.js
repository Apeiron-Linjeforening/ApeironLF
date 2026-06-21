/* functions/api/github/logout.js  →  POST /api/github/logout
   Sletter token-cookien. */
import { json, setCookie } from './_common.js';

export async function onRequestPost() {
  return json({ ok: true }, 200, { 'Set-Cookie': setCookie('gh_token', '', 0) });
}
export async function onRequestGet() {
  return json({ ok: true }, 200, { 'Set-Cookie': setCookie('gh_token', '', 0) });
}
