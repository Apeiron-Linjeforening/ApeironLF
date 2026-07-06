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
          + '<div class="fpv-wrap"><iframe id="pv-foot" title="Forhåndsvisning av footeren" scrolling="no"></iframe></div>'
        + '</section>'
        + '<div class="tip">'
          + '<button class="tip-reset" id="reset-btn" type="button">Tilbakestill til siste publiserte versjon</button>'
          + '<strong>Slik oppdaterer du footeren</strong>'
          + '<ol>'
            + '<li>Rediger feltene nedenfor. Endringene vises i forhåndsvisningen og lagres i nettleseren</li>'
            + '<li>Legg til, fjern eller dra for å sortere lenker</li>'
            + '<li>Trykk <b>☁ Publiser til GitHub</b> oppe til høyre</li>'
            + '<li>Erstatt <code>site-content.js</code> i GitHub-repoet og push/commit</li>'
            + '<li>Cloudflare oppdaterer alle sider automatisk innen et minutt</li>'
          + '</ol>'
          + '<div class="tip-note">💾 Footeren er lik på alle sider. «Rapporter en feil»-knappen åpner en boks som bruker e-posten du setter her.</div>'
        + '</div>'
        + '<div data-footer-banner>'
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
      function saveData() { AC.persistDraft(LS_KEY, data); AC.toast('Lagret i nettleseren'); }
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
          AC.undoDelete(data.links, i, '«' + (l.label || 'Lenke') + '» fjernet', shellLinks, lazySave);
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
          AC.undoDelete(data.social, i, '«' + (s.label || 'Sosial lenke') + '» fjernet', shellSocial, lazySave);
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
      function frameDoc(hideBrand) {
        var hb = hideBrand ? '.footer .wrap>img,.footer__name,.footer__tag{display:none !important;}' : '';
        // klikk-og-dra for å scrolle (simulerer touch) når innholdet er høyere enn ruta
        var drag = '(function(){function se(){return document.scrollingElement||document.documentElement;}function sc(){var s=se();return s.scrollHeight>s.clientHeight+2;}var dn=false,sy=0,st=0;function cur(){document.body.style.cursor=sc()?"grab":"";}setTimeout(cur,120);document.addEventListener("mousedown",function(e){if(!sc())return;dn=true;sy=e.clientY;st=se().scrollTop;document.body.style.cursor="grabbing";e.preventDefault();});document.addEventListener("mousemove",function(e){if(!dn)return;se().scrollTop=st-(e.clientY-sy);});window.addEventListener("mouseup",function(){if(!dn)return;dn=false;cur();});})();';
        return '<!DOCTYPE html><html lang="no"><head><meta charset="utf-8">'
          + '<link rel="preconnect" href="https://fonts.googleapis.com">'
          + '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
          + '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Spectral:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">'
          + '<link rel="stylesheet" href="css/styles.css">'
          + '<style>html,body{margin:0;background:transparent;}.footer{margin:0;}' + hb
          + '*{scrollbar-width:none;-ms-overflow-style:none;}*::-webkit-scrollbar{width:0;height:0;display:none;}</style>'
          + '</head><body data-mode="paper"><div id="site-footer"></div>'
          + '<scr' + 'ipt>window.SITE_FOOTER=' + JSON.stringify(previewData()) + ';</scr' + 'ipt>'
          + '<scr' + 'ipt src="js/footer-icons.js"></scr' + 'ipt>'
          + '<scr' + 'ipt src="js/site-chrome.js"></scr' + 'ipt>'
          + '<scr' + 'ipt>' + drag + '</scr' + 'ipt>'
          + '</body></html>';
      }
      function fitFoot() {
        var fr = q('pv-foot'); if (!fr) return;
        if (host.classList.contains('fpv-collapsed')) return;   // ikke mål mens previewen er foldet (iframen er display:none = høyde 0)
        try {
          var ft = fr.contentDocument && fr.contentDocument.querySelector('.footer');
          if (ft) fr.style.height = Math.max(160, ft.offsetHeight) + 'px';
        } catch (e) {}
      }
      function renderPreview() {
        var fr = q('pv-foot'); if (!fr) return;
        fr.onload = fitFoot;
        fr.srcdoc = frameDoc(true);   // inline desktop-preview: skjul branding (kortere)
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
        AC.toast('Fil lastet ned. Erstatt i GitHub og push!');
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

      function shellLinks() { renderLinks(); if (shell && shell.isActive()) shell.refresh(); }
      function shellSocial() { renderSocial(); if (shell && shell.isActive()) shell.refresh(); }
      /* ── delt «Liste + detalj»-skall (collections: banner + Lenker + Sosiale) ── */
      var shell = AC.PanelShell.mount(host, AC, {
        rail: 'collections',
        title: 'Footer', subtitle: '2 lister',
        remember: 'apeiron-footer-shell-sel',
        previewDock: false,
        launchpad: false,
        banner: { label: 'Tekst & rapporter-lenke', current: function () { return data.name || ''; }, adopt: function () { return host.querySelector('[data-footer-banner]'); } },
        groups: [
          { key: 'links', label: 'Lenker', addLabel: 'Ny lenke', primary: true, listDetail: true, icon: '🔗', idOf: function (l) { return l._id; },
            items: function () { return data.links; },
            meta: function (l) { return { av: '🔗', cls: 'sq', nm: l.label || '(uten tekst)', sub: l.href || 'ingen adresse' }; },
            detail: function (l) { return linkCard(l); },
            onReorder: function (ids) { data.links.sort(function (a, b) { return ids.indexOf(a._id) - ids.indexOf(b._id); }); lazySave(); },
            onAdd: function () { var l = { _id: uid(), label: '', href: '' }; data.links.push(l); renderLinks(); lazySave(); return l._id; } },
          { key: 'social', label: 'Sosiale lenker', addLabel: 'Ny sosial lenke', listDetail: true, icon: '◈', idOf: function (s) { return s._id; },
            items: function () { return data.social; },
            meta: function (s) { return { av: '◈', cls: 'sq', nm: s.label || '(uten tekst)', sub: s.href || 'ingen URL' }; },
            detail: function (s) { return socialCard(s); },
            onReorder: function (ids) { data.social.sort(function (a, b) { return ids.indexOf(a._id) - ids.indexOf(b._id); }); lazySave(); },
            onAdd: function () { var s = { _id: uid(), label: '', href: '', icon: '' }; data.social.push(s); renderSocial(); lazySave(); return s._id; } }
        ]
      });
      function applyPanelLayout() { shell.layoutChanged(); }
      window.addEventListener('apeiron-panellayout', applyPanelLayout);

      loadData(); AC.draftBaseline(LS_KEY, data);
      bind('m-name', function (v) { data.name = v; });
      bind('m-tagline', function (v) { data.tagline = v; });
      bind('m-fine', function (v) { data.fine = v; });
      bind('m-rep-label', function (v) { data.report.label = v; });
      bind('m-rep-email', function (v) { data.report.email = v; });
      bind('m-rep-subject', function (v) { data.report.subject = v; });
      renderAll();
      applyPanelLayout();
      // flytt previewen ut av bunn-dokken, opp mellom «Footer»-hodet (.aps__head) og
      // innholdet (.aps__md), samme grep som meny.
      var fPvBtn = host.querySelector('.aps__preview'); if (fPvBtn) fPvBtn.hidden = true;
      var fPrev = host.querySelector('.preview-top');
      var fMd = host.querySelector('.aps .aps__md');
      if (fPrev && fMd && fMd.parentNode) fMd.parentNode.insertBefore(fPrev, fMd);

      // Preview-knapper i «Footer»-hodet: «📱 Vis mobil» + fold-sammen. Alltid høyrestilt.
      host.classList.add('fpv-on');
      var fStyle = document.createElement('style');
      fStyle.textContent = '.fpv-btns{margin-left:auto;display:flex;gap:8px}'
        + '.fpv-btn{border:1px solid #d9d2c2;background:#fff;color:#232740;border-radius:8px;padding:6px 13px;font-size:12.5px;cursor:pointer;font-family:inherit}.fpv-btn:hover{border-color:#cdbf95}'
        + '.fpv-on.fpv-collapsed .preview-top{display:none !important}'
        + '.fpv-modal{position:fixed;inset:0;z-index:99999;background:rgba(20,22,36,.55);display:flex;align-items:center;justify-content:center;padding:20px}'
        + '.fpv-modal[hidden]{display:none}'
        + '.fpv-card{background:#f4f1ea;border-radius:16px;padding:16px;box-shadow:0 24px 60px rgba(0,0,0,.35);display:flex;flex-direction:column;align-items:center;max-height:96vh;overflow:auto}'
        + '.fpv-mhead{position:sticky;top:0;z-index:3;background:#f4f1ea;display:flex;align-items:center;gap:12px;width:100%;margin-bottom:10px;padding:4px 0;font-weight:600;font-size:13px;color:#232740}'
        + '.fpv-close{margin-left:auto;border:1px solid #d9d2c2;background:#fff;border-radius:8px;padding:6px 12px;font-size:12.5px;cursor:pointer;font-family:inherit;color:#232740}'
        + '.fpv-phone{border:8px solid #1a1d30;border-radius:30px;overflow:hidden;background:#232740;width:430px;height:680px;max-width:calc(100vw - 40px)}'
        + '.fpv-phone iframe{border:0;width:100%;height:100%;background:#232740}'
        + '.fpv-warn{margin:0 0 12px;max-width:430px;font-size:11.5px;line-height:1.4;color:#8a2b2b;background:#fdeaea;border:1px solid #e6b3b3;border-radius:8px;padding:7px 11px;text-align:center}'
        + '.fpv-rotbox{position:relative;overflow:hidden;background:transparent;margin:0 auto}'
        + '.fpv-rotbox iframe{position:absolute;top:0;left:0;border:0;background:transparent;transform-origin:0 0;transform:rotate(90deg) translateY(-100%)}'
        + '.fpv-rothint{margin-top:10px;max-width:300px;font-size:11px;color:#6b6f86;text-align:center}';
      document.head.appendChild(fStyle);

      // mobil-forhåndsvisning som overlegg (på body, så skallet ikke skjuler den)
      var fMobModal = document.createElement('div'); fMobModal.className = 'fpv-modal'; fMobModal.hidden = true;
      fMobModal.innerHTML = '<div class="fpv-card"><div class="fpv-mhead"><span>📱 Footer på mobil</span><button class="fpv-close" type="button">✕ Lukk</button></div><div class="fpv-warn">⚠ Footeren kan se ganske annerledes ut på ulike mobiler. Skjermbredde og tekststørrelse varierer.</div><div class="fpv-phone"><iframe id="pv-foot-mob" title="Mobil-forhåndsvisning av footeren"></iframe></div></div>';
      document.body.appendChild(fMobModal);
      var fMobFrame = fMobModal.querySelector('#pv-foot-mob');
      fMobModal.querySelector('.fpv-close').addEventListener('click', function () { fMobModal.hidden = true; });
      fMobModal.addEventListener('click', function (e) { if (e.target === fMobModal) fMobModal.hidden = true; });

      // 90-graders forhåndsvisning som overlegg (som meny sin roterte visning)
      var fRotModal = document.createElement('div'); fRotModal.className = 'fpv-modal'; fRotModal.hidden = true;
      fRotModal.innerHTML = '<div class="fpv-card"><div class="fpv-mhead"><span>🔄 Footer i 90°</span><button class="fpv-close" type="button">✕ Lukk</button></div><div class="fpv-rotbox"><iframe id="pv-foot-rot" title="90-graders forhåndsvisning av footeren"></iframe></div><div class="fpv-rothint">Footeren er snudd 90° så den brede desktop-visningen får plass på en smal skjerm. Lukk for å redigere.</div></div>';
      document.body.appendChild(fRotModal);
      var fRotFrame = fRotModal.querySelector('#pv-foot-rot');
      var fRotBox = fRotModal.querySelector('.fpv-rotbox');
      fRotModal.querySelector('.fpv-close').addEventListener('click', function () { fRotModal.hidden = true; });
      fRotModal.addEventListener('click', function (e) { if (e.target === fRotModal) fRotModal.hidden = true; });
      function fRotSize() { var L = Math.max(500, window.innerHeight - 150); fRotFrame.style.width = L + 'px'; fRotBox.style.height = L + 'px'; }
      function fRotFit() { var FH = 300; try { var ft = fRotFrame.contentDocument && fRotFrame.contentDocument.querySelector('.footer'); if (ft) FH = Math.max(160, ft.offsetHeight); } catch (e) {} fRotFrame.style.height = FH + 'px'; fRotBox.style.width = FH + 'px'; }
      function fRotOpen() { fRotSize(); fRotFrame.onload = fRotFit; fRotFrame.srcdoc = frameDoc(true); fRotModal.hidden = false; }
      function fRotResize() { if (!fRotModal.hidden) { fRotSize(); fRotFit(); } }
      window.addEventListener('resize', fRotResize);

      function fEsc(e) { if (e.key === 'Escape') { fMobModal.hidden = true; fRotModal.hidden = true; } }
      document.addEventListener('keydown', fEsc);

      // knapper i hodet, gruppert i en høyrestilt beholder (margin-left:auto)
      var fHead = host.querySelector('.aps__head');
      var fBtns = document.createElement('span'); fBtns.className = 'fpv-btns';
      var fMobBtn = document.createElement('button'); fMobBtn.type = 'button'; fMobBtn.className = 'fpv-btn'; fMobBtn.textContent = '📱 Vis mobil';
      fMobBtn.addEventListener('click', function () { fMobFrame.srcdoc = frameDoc(false); fMobModal.hidden = false; });   // mobil: vis branding (ekte mobil-footer)
      var fRotBtn = document.createElement('button'); fRotBtn.type = 'button'; fRotBtn.className = 'fpv-btn'; fRotBtn.textContent = '🔄 90° visning';
      fRotBtn.addEventListener('click', fRotOpen);
      var fToggle = document.createElement('button'); fToggle.type = 'button'; fToggle.className = 'fpv-btn'; fToggle.textContent = '▾ Skjul forhåndsvisning';
      fToggle.addEventListener('click', function () { var c = host.classList.toggle('fpv-collapsed'); fToggle.textContent = c ? '▸ Vis forhåndsvisning' : '▾ Skjul forhåndsvisning'; if (!c) { requestAnimationFrame(fitFoot); } });
      fBtns.appendChild(fMobBtn); fBtns.appendChild(fRotBtn); fBtns.appendChild(fToggle);
      if (fHead) { var fHome = fHead.querySelector('[data-aps-home]'); if (fHome) fHead.insertBefore(fBtns, fHome); else fHead.appendChild(fBtns); }

      AC.viewSwitch({ list: q('list-links'), key: 'apeiron-footer-links-view-v1', help: 'Velg hvordan lenke-radene vises mens du redigerer her i admin. Påvirker bare redigeringsvisningen, ikke nettsiden.' });
      AC.viewSwitch({ list: q('list-social'), key: 'apeiron-footer-social-view-v1', help: 'Velg hvordan de sosiale lenkene vises mens du redigerer her i admin. Påvirker bare redigeringsvisningen, ikke nettsiden.' });

      return { export: exportFile, destroy: function () { window.removeEventListener('resize', fitFoot); window.removeEventListener('apeiron-panellayout', applyPanelLayout); if (shell) shell.destroy(); document.removeEventListener('keydown', fEsc); window.removeEventListener('resize', fRotResize); if (fMobModal && fMobModal.parentNode) fMobModal.parentNode.removeChild(fMobModal); if (fRotModal && fRotModal.parentNode) fRotModal.parentNode.removeChild(fRotModal); if (fStyle && fStyle.parentNode) fStyle.parentNode.removeChild(fStyle); host.classList.remove('fpv-on'); } };
    }
  });
})();
