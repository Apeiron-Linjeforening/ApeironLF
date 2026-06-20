/* ============================================================
   admin-modules/footer.js — Footer-editor som C-modul
   Erstatter footer-admin.html. Krever globalene FOOTER_ICONS,
   FOOTER_ICON_LABELS (footer-icons.js) og SITE_FOOTER (site-content.js),
   som skallet (admin.html) laster.
   ============================================================ */
(function () {
  'use strict';

  AdminPanels.define('footer', {
    title: 'Footer',
    see: { href: 'index.html', label: 'Se nettsiden ↗' },
    exportName: 'site-content.js',

    mount: function (host, AC) {
      host.innerHTML =
        '<section class="preview-top">'
          + '<h3>Forhåndsvisning</h3>'
          + '<p class="pp-sub">Slik ser footeren ut nederst på alle sider — bytt mellom 🖥 og 📱 for desktop- og mobilbredde. Oppdateres mens du skriver.</p>'
          + '<div class="fpv-wrap"><iframe id="pv-foot" title="Forhåndsvisning av footeren" scrolling="no"></iframe></div>'
        + '</section>'
        + '<div class="tip">'
          + '<button class="tip-reset" id="reset-btn" type="button">Tilbakestill til siste publiserte versjon</button>'
          + '<strong>Slik oppdaterer du footeren</strong>'
          + '<ol>'
            + '<li>Rediger feltene nedenfor — endringene vises i forhåndsvisningen og lagres i nettleseren</li>'
            + '<li>Legg til, fjern eller dra for å sortere lenker</li>'
            + '<li>Klikk <b>↓ Last ned alle endrede</b> oppe til høyre</li>'
            + '<li>Erstatt <code>site-content.js</code> i GitHub-repoet og push/commit</li>'
            + '<li>Cloudflare oppdaterer alle sider automatisk innen et minutt</li>'
          + '</ol>'
          + '<div class="tip-note">💾 Footeren er lik på alle sider. «Rapporter en feil»-knappen åpner en boks som bruker e-posten du setter her.</div>'
        + '</div>'
        + '<div class="meta-panel"><h3>Tekst</h3>'
          + '<div class="meta-grid">'
            + '<div class="fg"><label data-help="Den store tittelen øverst i footeren, f.eks. «APEIRON».">Navn (stor tittel)</label><input type="text" id="m-name"></div>'
            + '<div class="fg"><label data-help="Kursiv undertekst rett under navnet, f.eks. «filosofi & etikk · NTNU Trondheim».">Undertekst (tagline)</label><input type="text" id="m-tagline"></div>'
          + '</div>'
          + '<div class="meta-grid" style="margin-top:14px;">'
            + '<div class="fg"><label data-help="Den lille linjen helt nederst, typisk copyright, f.eks. «© 2026 Apeiron Linjeforening».">Bunntekst (copyright)</label><input type="text" id="m-fine"></div>'
          + '</div>'
        + '</div>'
        + '<div class="meta-panel"><h3>«Rapporter en feil»-lenke</h3>'
          + '<div class="meta-grid">'
            + '<div class="fg"><label data-help="Teksten på lenken nederst i footeren. Et klikk åpner en liten boks (kopier e-post / åpne e-post).">Lenketekst</label><input type="text" id="m-rep-label"></div>'
            + '<div class="fg narrow"><label data-help="E-postadressen feilmeldinger sendes til.">E-post</label><input type="text" id="m-rep-email" placeholder="navn@eksempel.no"></div>'
            + '<div class="fg narrow"><label data-help="Forhåndsutfylt emnefelt i e-posten, f.eks. «Feil på nettsiden».">E-post emne</label><input type="text" id="m-rep-subject"></div>'
          + '</div>'
        + '</div>'
        + '<div class="sec">'
          + '<div class="sec-head"><h2>Lenker</h2><span class="count" id="count-links"></span><button class="btn-add" type="button" id="add-link">+ Ny lenke</button></div>'
          + '<p class="sec-desc">Generelle lenker i footeren. Adresse kan være en side (<code>pensum.html</code>), en seksjon (<code>index.html#kontakt</code>) eller en ekstern URL.</p>'
          + '<div class="list" id="list-links"></div>'
        + '</div>'
        + '<div class="sec">'
          + '<div class="sec-head"><h2>Sosiale lenker</h2><span class="count" id="count-social"></span><button class="btn-add" type="button" id="add-social">+ Ny sosial lenke</button></div>'
          + '<p class="sec-desc">Vises med ikon nederst i footeren. Velg ikon for kjente tjenester.</p>'
          + '<div class="list" id="list-social"></div>'
        + '</div>';

      var q = function (id) { return host.querySelector('#' + id); };

      var LS_KEY = 'apeiron-footer-v1';
      var ICONS = window.FOOTER_ICONS || {};
      var ICON_LABELS = window.FOOTER_ICON_LABELS || {};

      var data = null;
      var uidc = 0;
      function uid() { return 'f' + (Date.now().toString(36)) + (uidc++).toString(36); }

      function fresh() {
        var f = window.SITE_FOOTER || {};
        return {
          name: f.name || '', tagline: f.tagline || '', fine: f.fine || '',
          report: Object.assign({ label: '', email: '', subject: '' }, f.report || {}),
          links: (f.links || []).map(function (l) { return { _id: uid(), label: l.label || '', href: l.href || '' }; }),
          social: (f.social || []).map(function (s) { return { _id: uid(), label: s.label || '', href: s.href || '', icon: s.icon || '' }; })
        };
      }
      function loadData() {
        var raw = localStorage.getItem(LS_KEY);
        if (raw) {
          try {
            var d = JSON.parse(raw);
            d.links = (d.links || []).map(function (l) { return { _id: l._id || uid(), label: l.label || '', href: l.href || '' }; });
            d.social = (d.social || []).map(function (s) { return { _id: s._id || uid(), label: s.label || '', href: s.href || '', icon: s.icon || '' }; });
            d.report = Object.assign({ label: '', email: '', subject: '' }, d.report || {});
            data = d; return;
          } catch (_) {}
        }
        data = fresh();
      }
      function saveData() { localStorage.setItem(LS_KEY, JSON.stringify(data)); AC.toast('Lagret i nettleseren'); }
      var saveTimer = null;
      function lazySave() { clearTimeout(saveTimer); saveTimer = setTimeout(function () { saveData(); renderPreview(); }, 300); }
      function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }

      var HREF_HELP = 'Hvor lenken går:\n• En side i repoet: «pensum.html»\n• En seksjon på forsiden: «index.html#kontakt»\n• En ekstern adresse: «https://...».';

      function linkCard(l) {
        var card = document.createElement('div');
        card.className = 'row-card'; card.setAttribute('data-id', l._id);
        card.innerHTML =
          '<span class="drag-handle" title="Dra for å sortere">⠿</span>'
          + '<div class="fg"><label data-help="Teksten som vises for lenken i footeren.">Tekst</label><input type="text" data-f="label" placeholder="f.eks. Pensum"></div>'
          + '<div class="fg"><label data-help="' + esc(HREF_HELP) + '">Adresse</label><div class="addr-wrap"><input type="text" data-f="href" placeholder="pensum.html eller index.html#kontakt"><button class="btn-loc" type="button" title="Velg side og seksjon">📍</button></div><div class="lnk-warn"></div></div>'
          + '<button class="btn-del-row" type="button" title="Fjern">✕</button>';
        card.querySelector('[data-f="label"]').value = l.label;
        card.querySelector('[data-f="href"]').value = l.href;
        card.querySelectorAll('[data-f]').forEach(function (el) {
          el.addEventListener('input', function () { l[el.getAttribute('data-f')] = el.value; lazySave(); });
        });
        card.querySelector('.btn-del-row').addEventListener('click', function () {
          var i = data.links.indexOf(l); if (i < 0) return;
          AC.undoDelete(data.links, i, '«' + (l.label || 'Lenke') + '» fjernet', renderLinks, lazySave);
        });
        AC.enhanceHelp(card);
        AC.wireHrefField(card);
        return card;
      }
      function iconOptions(selected) {
        var opts = '<option value="">(ingen)</option>';
        Object.keys(ICONS).forEach(function (k) {
          opts += '<option value="' + esc(k) + '"' + (selected === k ? ' selected' : '') + '>' + esc(ICON_LABELS[k] || k) + '</option>';
        });
        return opts;
      }
      function socialCard(s) {
        var card = document.createElement('div');
        card.className = 'row-card'; card.setAttribute('data-id', s._id);
        card.innerHTML =
          '<span class="drag-handle" title="Dra for å sortere">⠿</span>'
          + '<div class="fg narrow"><label data-help="Ikonet ved siden av teksten. «(ingen)» = kun tekst.">Ikon</label><select data-f="icon">' + iconOptions(s.icon || '') + '</select></div>'
          + '<div class="fg narrow"><label data-help="Teksten ved siden av ikonet, f.eks. «Instagram».">Tekst</label><input type="text" data-f="label" placeholder="f.eks. Instagram"></div>'
          + '<div class="fg"><label data-help="Full nettadresse. Åpnes i ny fane.">URL</label><input type="text" data-f="href" placeholder="https://..."><div class="lnk-warn"></div></div>'
          + '<button class="btn-del-row" type="button" title="Fjern">✕</button>';
        card.querySelector('[data-f="label"]').value = s.label;
        card.querySelector('[data-f="href"]').value = s.href;
        card.querySelectorAll('[data-f]').forEach(function (el) {
          var evt = el.tagName === 'SELECT' ? 'change' : 'input';
          el.addEventListener(evt, function () { s[el.getAttribute('data-f')] = el.value; lazySave(); });
        });
        card.querySelector('.btn-del-row').addEventListener('click', function () {
          var i = data.social.indexOf(s); if (i < 0) return;
          AC.undoDelete(data.social, i, '«' + (s.label || 'Sosial lenke') + '» fjernet', renderSocial, lazySave);
        });
        AC.enhanceHelp(card);
        AC.wireHrefField(card);
        return card;
      }
      function renderLinks() {
        var el = q('list-links'); el.innerHTML = '';
        data.links.forEach(function (l) { el.appendChild(linkCard(l)); });
        q('count-links').textContent = data.links.length + ' lenker';
      }
      function renderSocial() {
        var el = q('list-social'); el.innerHTML = '';
        data.social.forEach(function (s) { el.appendChild(socialCard(s)); });
        q('count-social').textContent = data.social.length + ' lenker';
      }
      function bind(id, setter) { var el = q(id); el.addEventListener('input', function () { setter(el.value); lazySave(); }); return el; }
      function renderMeta() {
        q('m-name').value = data.name; q('m-tagline').value = data.tagline; q('m-fine').value = data.fine;
        q('m-rep-label').value = data.report.label; q('m-rep-email').value = data.report.email; q('m-rep-subject').value = data.report.subject;
      }
      function previewData() {
        return {
          name: data.name, tagline: data.tagline, fine: data.fine,
          links: data.links.map(function (l) { return { label: l.label, href: l.href }; }),
          social: data.social.map(function (s) { return { label: s.label, href: s.href, icon: s.icon }; }),
          report: { label: data.report.label, email: data.report.email, subject: data.report.subject }
        };
      }
      // Forhåndsvisningen er den EKTE footeren: vi laster styles.css + site-chrome.js
      // i en iframe med utkastet injisert, slik at den ser nøyaktig ut som på sidene
      // — og får samme 🖥/📱-veksler (telefon-ramme i mobilmodus) som de andre panelene.
      function frameDoc() {
        return '<!DOCTYPE html><html lang="no"><head><meta charset="utf-8">'
          + '<link rel="preconnect" href="https://fonts.googleapis.com">'
          + '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
          + '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Spectral:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">'
          + '<link rel="stylesheet" href="styles.css">'
          + '<style>html,body{margin:0;background:transparent;}.footer{margin:0;}</style>'
          + '</head><body data-mode="paper"><div id="site-footer"></div>'
          + '<scr' + 'ipt>window.SITE_FOOTER=' + JSON.stringify(previewData()) + ';</scr' + 'ipt>'
          + '<scr' + 'ipt src="footer-icons.js"></scr' + 'ipt>'
          + '<scr' + 'ipt src="site-chrome.js"></scr' + 'ipt>'
          + '</body></html>';
      }
      function fitFoot() {
        var fr = q('pv-foot'); if (!fr) return;
        try {
          var ft = fr.contentDocument && fr.contentDocument.querySelector('.footer');
          if (ft) fr.style.height = Math.max(160, ft.offsetHeight) + 'px';
        } catch (e) {}
      }
      function renderPreview() {
        var fr = q('pv-foot'); if (!fr) return;
        fr.onload = fitFoot;
        fr.srcdoc = frameDoc();
      }
      window.addEventListener('resize', fitFoot);
      function exportFile() {
        var out = {
          name: data.name, tagline: data.tagline,
          links: data.links.filter(function (l) { return (l.label || '').trim() || (l.href || '').trim(); }).map(function (l) { return { label: l.label, href: l.href }; }),
          social: data.social.filter(function (s) { return (s.href || '').trim(); }).map(function (s) { return { label: s.label, href: s.href, icon: s.icon }; }),
          report: { label: data.report.label, email: data.report.email, subject: data.report.subject },
          fine: data.fine
        };
        var content =
          '/* ============================================================\n'
          + '   site-content.js — redigerbart innhold for delt footer\n'
          + '   Leses av site-chrome.js, som bygger footeren på alle sider.\n'
          + '   Redigeres via Admin-senteret → Footer.\n'
          + '   Sist oppdatert: ' + new Date().toLocaleDateString('no-NO') + '\n'
          + '   ============================================================ */\n'
          + 'window.SITE_FOOTER = ' + JSON.stringify(out, null, 2) + ';\n';
        AC.saveFile('site-content.js', content);
        AC.toast('Fil lastet ned — erstatt i GitHub og push!');
      }

      q('reset-btn').addEventListener('click', function () {
        if (!confirm('Dette sletter alle ueksporterte endringer og laster inn siste publiserte versjon. Fortsette?')) return;
        localStorage.removeItem(LS_KEY); data = fresh(); renderAll(); AC.toast('Tilbakestilt til publisert versjon');
      });
      q('add-link').addEventListener('click', function () { data.links.push({ _id: uid(), label: '', href: '' }); renderLinks(); lazySave(); });
      q('add-social').addEventListener('click', function () { data.social.push({ _id: uid(), label: '', href: '', icon: '' }); renderSocial(); lazySave(); });

      AC.enableDragSort(q('list-links'), {
        itemSelector: '.row-card', handleSelector: '.drag-handle',
        onReorder: function (ids) { data.links.sort(function (a, b) { return ids.indexOf(a._id) - ids.indexOf(b._id); }); lazySave(); }
      });
      AC.enableDragSort(q('list-social'), {
        itemSelector: '.row-card', handleSelector: '.drag-handle',
        onReorder: function (ids) { data.social.sort(function (a, b) { return ids.indexOf(a._id) - ids.indexOf(b._id); }); lazySave(); }
      });

      function renderAll() { renderMeta(); renderLinks(); renderSocial(); renderPreview(); AC.enhanceHelp(host); }

      loadData();
      bind('m-name', function (v) { data.name = v; });
      bind('m-tagline', function (v) { data.tagline = v; });
      bind('m-fine', function (v) { data.fine = v; });
      bind('m-rep-label', function (v) { data.report.label = v; });
      bind('m-rep-email', function (v) { data.report.email = v; });
      bind('m-rep-subject', function (v) { data.report.subject = v; });
      renderAll();

      AC.viewSwitch({ list: q('list-links'), key: 'apeiron-footer-links-view-v1', help: 'Velg hvordan lenke-radene vises mens du redigerer her i admin. Påvirker bare redigeringsvisningen, ikke nettsiden.' });
      AC.viewSwitch({ list: q('list-social'), key: 'apeiron-footer-social-view-v1', help: 'Velg hvordan de sosiale lenkene vises mens du redigerer her i admin. Påvirker bare redigeringsvisningen, ikke nettsiden.' });

      return { export: exportFile, destroy: function () { window.removeEventListener('resize', fitFoot); } };
    }
  });
})();
