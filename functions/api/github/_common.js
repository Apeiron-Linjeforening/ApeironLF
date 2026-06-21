/* functions/api/github/_common.js
   Delte hjelpere for GitHub-innlogging + commit (Cloudflare Pages Functions).
   Underscore-prefiks => ikke en egen rute. */

export function cfg(env) {
  var repo = (env.GITHUB_REPO || '').trim();          // "eier/navn"
  var parts = repo.split('/');
  return {
    clientId: env.GITHUB_CLIENT_ID || '',
    clientSecret: env.GITHUB_CLIENT_SECRET || '',
    owner: parts[0] || '',
    name: parts[1] || '',
    repo: repo,
    branch: (env.GITHUB_BRANCH || 'main').trim(),
    scope: (env.GITHUB_SCOPE || 'public_repo').trim(),
    allowed: (env.ALLOWED_LOGINS || '').split(',').map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean)
  };
}

export function origin(request) { return new URL(request.url).origin; }

export function json(obj, status, extraHeaders) {
  var h = Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, extraHeaders || {});
  return new Response(JSON.stringify(obj), { status: status || 200, headers: h });
}

export function redirect(url, extraHeaders) {
  var h = Object.assign({ Location: url, 'Cache-Control': 'no-store' }, extraHeaders || {});
  return new Response(null, { status: 302, headers: h });
}

export function readCookie(request, name) {
  var raw = request.headers.get('Cookie') || '';
  var m = raw.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
  return m ? decodeURIComponent(m[1]) : null;
}

// Bygger en Set-Cookie-verdi. maxAge i sekunder; 0 => slett.
export function setCookie(name, value, maxAge) {
  var parts = [name + '=' + encodeURIComponent(value), 'Path=/', 'HttpOnly', 'Secure', 'SameSite=Lax'];
  parts.push('Max-Age=' + (maxAge == null ? 28800 : maxAge));
  return parts.join('; ');
}

export function randHex(bytes) {
  var a = new Uint8Array(bytes || 16);
  crypto.getRandomValues(a);
  return Array.prototype.map.call(a, function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
}

// Kall GitHubs API med token. Returnerer { ok, status, data }.
export async function gh(path, token, init) {
  init = init || {};
  var headers = Object.assign({
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'apeiron-admin',
    'X-GitHub-Api-Version': '2022-11-28'
  }, init.headers || {});
  if (token) headers['Authorization'] = 'Bearer ' + token;
  if (init.body && typeof init.body !== 'string') { init.body = JSON.stringify(init.body); headers['Content-Type'] = 'application/json'; }
  var res = await fetch('https://api.github.com' + path, { method: init.method || 'GET', headers: headers, body: init.body });
  var data = null;
  try { data = await res.json(); } catch (e) {}
  return { ok: res.ok, status: res.status, data: data };
}
