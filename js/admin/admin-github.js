/* admin-github.js — klient mot G1-innloggingen (Cloudflare Pages Functions).
   Tokenet bor i en httpOnly-cookie på serveren; denne fila ber bare
   funksjonene om status og om å committe. Ingen token i nettleseren. */
(function () {
  'use strict';
  var state = { authenticated: false, checked: false };

  function status() {
    return fetch('/api/github/me', { credentials: 'same-origin' })
      .then(function (r) {
        return r.text().then(function (t) {
          var d; try { d = JSON.parse(t); } catch (e) { d = null; }
          if (!d || typeof d.authenticated === 'undefined') return { authenticated: false, unavailable: true };
          return d;
        });
      })
      .then(function (d) { state = Object.assign({ checked: true }, d || { authenticated: false }); return state; })
      .catch(function () { state = { authenticated: false, checked: true, offline: true }; return state; });
  }
  // Siste commit på branchen (+ ev. endrede filer siden ?base). Brukes til
  // «Sist publisert av …» og konfliktsjekk. Feiler stille (returnerer !ok)
  // når man kjører lokalt / er utlogget — kallere skal ikke blokkere på det.
  function latest(base) {
    var url = '/api/github/latest' + (base ? ('?base=' + encodeURIComponent(base)) : '');
    return fetch(url, { credentials: 'same-origin' })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .catch(function () { return { ok: false, offline: true }; });
  }
  // Siste commits på branchen (hvem/hva/når). Driver «Angre siste publisering».
  function history(n) {
    var url = '/api/github/history' + (n ? ('?n=' + encodeURIComponent(n)) : '');
    return fetch(url, { credentials: 'same-origin' })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .catch(function () { return { ok: false, offline: true }; });
  }
  // Angre siste publisering: ruller branchen tilbake til forrige tre.
  // expect = SHA-en man så som «siste» (konfliktvakt på serveren).
  function revert(expect) {
    return fetch('/api/github/revert', {
      method: 'POST', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expect: expect || '' })
    }).then(function (r) { return r.json().catch(function () { return { ok: false, error: 'bad_response' }; }); })
      .catch(function () { return { ok: false, error: 'network' }; });
  }
  function login() { location.href = '/api/github/login'; }
  function logout() {
    return fetch('/api/github/logout', { method: 'POST', credentials: 'same-origin' })
      .then(function () { state = { authenticated: false, checked: true }; });
  }
  function blobToBase64(blob) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () { var s = String(r.result); var i = s.indexOf(','); res(i >= 0 ? s.slice(i + 1) : s); };
      r.onerror = function () { rej(r.error); };
      r.readAsDataURL(blob);
    });
  }
  // files: [{path, content}] (tekst) eller [{path, blob}] (binært)
  function commit(files, message) {
    return Promise.all((files || []).map(function (f) {
      if (f.blob) return blobToBase64(f.blob).then(function (b64) { return { path: f.path, content: b64, encoding: 'base64' }; });
      return Promise.resolve({ path: f.path, content: String(f.content == null ? '' : f.content), encoding: f.encoding || 'utf-8' });
    })).then(function (payload) {
      return fetch('/api/github/commit', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message || 'Oppdater innhold via admin', files: payload })
      }).then(function (r) { return r.json().catch(function () { return { ok: false, error: 'bad_response' }; }); });
    });
  }

  window.AdminGitHub = {
    status: status, login: login, logout: logout, commit: commit, latest: latest,
    history: history, revert: revert,
    get state() { return state; }
  };
})();
