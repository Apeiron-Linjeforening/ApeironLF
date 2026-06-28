/* ============================================================
   admin-panel-shell.js — delt «Liste + detalj»-skall (PanelShell)
   ------------------------------------------------------------
   Ett gjenbrukbart skall som gir alle paneler samme «Liste + detalj»-
   visning (Forslag 2 / C+), med tilpasninger per rail-type slik at
   designet ikke ryker for paneler som gjør forskjellige ting.

   Skallet eier KUN navigasjonen (rail, søk, kollaps, banner-stripe,
   launchpad, husk-sist). Selve redigerings-skjemaet bygges fortsatt
   av modulen via group.detail(item) — som regel ved å gjenbruke
   modulens eksisterende kort-bygger. Slik arver hver migrering all
   eksisterende logikk (bilder, chips, angre, lagring) gratis.

   Aktiveres bare når AdminCommon.panelLayout() === 'liste-detalj'.
   Ellers er skallet skjult og modulens klassiske .sec-visning står.

   ── Bruk ────────────────────────────────────────────────────
   var shell = AdminCommon.PanelShell.mount(host, AC, {
     rail: 'collections',            // collections | single | filter | sections
     banner: { label, current, build } | null,
     filter: { segments:[{key,label,count}], def } ,  // kun rail:'filter'
     groups: [{
       key, label, addLabel, primary,
       items: function(){ return [...] },
       meta:  function(item){ return { av, cls, nm, sub, dot } },
       detail:function(item){ return HTMLElement },   // gjenbruk kort-bygger
       onAdd: function(){ ... return id },
       matchFilter: function(item, segKey){ return bool }   // kun filter
     }],
     remember: 'apeiron-xxx-shell-sel',
     launchpad: true,
     emptyText: '…'
   });
   // controller: refresh(), refreshItem(id?), select(group,id),
   //             layoutChanged(), destroy()
   ============================================================ */
(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function mount(host, AC, cfg) {
    cfg = cfg || {};
    var railType = cfg.rail || 'collections';
    var groups = cfg.groups || [];
    var isSingle = railType === 'single';
    var isFilter = railType === 'filter';
    var isSections = railType === 'sections';
    var useLaunchpad = cfg.launchpad != null ? cfg.launchpad : (railType === 'collections');
    var useCollapse = !(isSingle || isFilter);          // én gruppe → ingen kollaps
    var useBanner = !!cfg.banner && !isSections;        // sidetekst-paneler: banneret ER bare en seksjon
    var rememberKey = cfg.remember || null;

    /* Gruppe-kollaps: når cfg.collapseGroupsByDefault er satt starter ALLE
       grupper lukket. Brukerens eksplisitte åpning/lukking huskes per panel
       (avledet av remember-nøkkelen) og gjenopprettes neste gang. */
    var collapseGroupsDefault = !!cfg.collapseGroupsByDefault;
    var openGroupsKey = rememberKey ? rememberKey + ':open-groups' : null;
    function readOpenGroups() {
      if (!openGroupsKey) return null;
      try { return JSON.parse(localStorage.getItem(openGroupsKey) || 'null'); } catch (_) { return null; }
    }
    function writeOpenGroups(map) {
      if (!openGroupsKey) return;
      try { localStorage.setItem(openGroupsKey, JSON.stringify(map || {})); } catch (_) {}
    }
    function setGroupOpen(key, open) {
      var m = readOpenGroups() || {};
      if (open) m[key] = 1; else delete m[key];
      writeOpenGroups(m);
    }

    var wrap = null, sel = null, filterSeg = (cfg.filter && cfg.filter.def) || (cfg.filter && cfg.filter.segments[0] && cfg.filter.segments[0].key) || null;
    var launchpadShown = false;
    var overview = false;   // «Oversikt»-knappen: vis panelets egen oversikt i detaljruten
    var SET_KEY = '__settings';
    var SEC_KEY = '__section';
    var LIST_KEY = '__list';
    var PREVIEW_SEL = cfg.previewSelector || '.preview-top';
    var adoptedNode = null, adoptedHome = null;
    var dockNode = null, dockMarker = null;
    function isSettingsSel(s) { return useBanner && s && s.group === SET_KEY; }
    function isSectionSel(s) { return isSections && s && s.group === SEC_KEY; }
    function isListSel(s) { var g = s && groupByKey(s.group); return !!(g && g.listDetail && s.id === LIST_KEY); }
    function sectionList() {
      if (typeof cfg.sections === 'function') { try { return cfg.sections() || []; } catch (_) { return []; } }
      // standard: scan .panel-blokker i panelet (hver blir en seksjonsrad)
      var out = [];
      Array.prototype.forEach.call(host.querySelectorAll('.panel'), function (p, i) {
        if (!p.getAttribute('data-aps-sec')) p.setAttribute('data-aps-sec', 's' + i);
        var h2 = p.querySelector('.panel-title') || p.querySelector(':scope > h2') || p.querySelector(':scope > h3') || p.querySelector('h2') || p.querySelector('h3');
        var label = '', sub = '';
        if (h2) { var sm = h2.querySelector('small'); sub = sm ? sm.textContent.trim() : ''; label = (h2.textContent || '').replace(sub, '').trim(); }
        out.push({ id: p.getAttribute('data-aps-sec'), label: label || ('Seksjon ' + (i + 1)), sub: sub, node: p, av: '✎' });
      });
      return out;
    }
    function findSection(id) { var a = sectionList(); for (var i = 0; i < a.length; i++) if (String(a[i].id) === String(id)) return a[i]; return null; }

    function layout() { try { return (cfg.layout || AC.panelLayout)() ; } catch (_) { return 'klassisk'; } }
    function active() { return layout() === 'liste-detalj'; }

    function groupByKey(k) { for (var i = 0; i < groups.length; i++) if (groups[i].key === k) return groups[i]; return null; }
    function itemsOf(g) { try { return g.items() || []; } catch (_) { return []; } }
    function itemId(g, item) { return g && g.idOf ? g.idOf(item) : (item && item.id); }
    function findItem(gk, id) { var g = groupByKey(gk); if (!g) return null; var a = itemsOf(g); for (var i = 0; i < a.length; i++) if (String(itemId(g, a[i])) === String(id)) return a[i]; return null; }

    function readRemember() {
      if (!rememberKey) return null;
      try { return JSON.parse(localStorage.getItem(rememberKey) || 'null'); } catch (_) { return null; }
    }
    function writeRemember() {
      if (!rememberKey || isSettingsSel(sel)) return;
      try { localStorage.setItem(rememberKey, JSON.stringify(sel)); } catch (_) {}
    }

    /* ── primær-/sist-valgt oppløsning ── */
    function resolveSel() {
      if (overview) return null;
      if (isSectionSel(sel)) { if (findSection(sel.id)) return sel; }
      if (isSettingsSel(sel)) return sel;
      if (isListSel(sel)) return sel;
      if (sel) { var it = findItem(sel.group, sel.id); if (it) return sel; }
      // Ved ny åpning av et panel starter vi ALLTID på oversikten / toppen — vi
      // gjenoppretter IKKE sist-viste element (brukerønske: vis oversikten, ikke
      // det man så på sist). «Sist redigert» ligger fortsatt som en snarvei i
      // launchpad-oversikten (leser readRemember() direkte).
      if (isSections) { var a = sectionList(); if (a.length) { sel = { group: SEC_KEY, id: a[0].id }; return sel; } sel = null; return null; }
      // ingen sist-valgt: launchpad-paneler starter på oversikt (sel=null),
      // enkeltliste/filter åpner første element direkte.
      if (useLaunchpad) { sel = null; return null; }
      for (var i = 0; i < groups.length; i++) {
        if (groups[i].listDetail) { sel = { group: groups[i].key, id: LIST_KEY }; return sel; }
        var a2 = itemsOf(groups[i]); if (a2.length) { sel = { group: groups[i].key, id: itemId(groups[i], a2[0]) }; return sel; }
      }
      sel = null; return null;
    }

    /* ── DOM-skall ── */
    function ensureWrap() {
      if (wrap) return wrap;
      wrap = document.createElement('div');
      wrap.className = 'aps mod-shell' + (isSingle ? ' aps--single' : '') + ' aps--' + railType;
      wrap.hidden = true;
      wrap.innerHTML =
        '<div class="aps__head">'
          + '<span class="aps__ttl">' + esc(cfg.title || '') + '</span>'
          + '<span class="aps__sub">' + esc(cfg.subtitle || '') + '</span>'
          + '<span class="aps__sp"></span>'
          + '<button type="button" class="aps__home" data-aps-home>🗂 Oversikt</button>'
          + '<button type="button" class="aps__preview" data-aps-preview hidden><span class="ic">👁</span> Forhåndsvisning</button>'
          + '<span class="aps__hint" data-aps-hint hidden>↩ Husker hvor du var</span>'
        + '</div>'
        + '<div class="aps__md">'
          + '<div class="aps__nav">'
            + (isFilter ? '<div class="aps__segs" data-aps-segs></div>' : '<div class="aps__search"><input type="text" data-aps-search placeholder="Søk i innhold…" aria-label="Søk"></div>')
            + '<div class="aps__scroll" data-aps-scroll></div>'
            + '<div class="aps__foot" data-aps-foot></div>'
          + '</div>'
          + '<div class="aps__detail" data-aps-detail></div>'
        + '</div>'
        + '<div class="aps__dock" data-aps-dock hidden></div>';
      // sett inn FØR første .sec (klassisk visning) så den kan skjules ved siden av.
      // mountAtTop: legg skallet øverst i host (for paneler med nestet editor-grid
      // e.l. der søsken-skjulingen ellers ikke når alt det klassiske innholdet).
      if (cfg.mountAtTop) {
        host.insertBefore(wrap, host.firstChild);
      } else {
        var firstSec = host.querySelector('.sec, .preview-top');
        if (firstSec && firstSec.parentNode) firstSec.parentNode.insertBefore(wrap, firstSec);
        else host.appendChild(wrap);
      }

      // event-delegasjon i navigatoren OG i foten (add-knappen ligger i foten,
      // utenfor scroll-containeren — uten dette blir «+ Nytt» død)
      wrap.querySelector('[data-aps-scroll]').addEventListener('click', onNavClick);
      var footEl = wrap.querySelector('[data-aps-foot]');
      if (footEl) footEl.addEventListener('click', onNavClick);
      var srch = wrap.querySelector('[data-aps-search]');
      if (srch) srch.addEventListener('input', function () { applySearch(srch.value); });
      var det = wrap.querySelector('[data-aps-detail]');
      det.addEventListener('input', function () { clearTimeout(wrap._t); wrap._t = setTimeout(syncActiveRow, 150); });
      det.addEventListener('change', syncActiveRow);
      det.addEventListener('click', function (e) {
        if (e.target.closest('[data-aps-back]')) { overview = true; renderDetail(); paintActive(); }
      });
      var homeBtn = wrap.querySelector('[data-aps-home]');
      if (homeBtn) homeBtn.addEventListener('click', function () { overview = true; renderDetail(); paintActive(); });
      var pvBtn = wrap.querySelector('[data-aps-preview]');
      if (pvBtn) {
        var pvTop = host.querySelector(PREVIEW_SEL);
        if (pvTop && !cfg.previewDock) {
          pvBtn.hidden = false;
          pvBtn.addEventListener('click', function () {
            // gjenbruk panelets eksisterende «full størrelse»-forhåndsvisning
            var phwrap = host.classList && host.classList.contains('ph-wrap') ? host : host.closest('.ph-wrap');
            var full = pvTop.querySelector('.pv-tool-btn[title^="Vis i full"]') || pvTop.querySelector('.pv-tool-btn');
            if (full) full.click();
            else if (phwrap) { phwrap.classList.add('pv-full'); try { window.dispatchEvent(new Event('resize')); } catch (_) {} }
          });
        }
      }
      return wrap;
    }

    function onNavClick(e) {
      var t;
      if (t = e.target.closest('[data-aps-collapseall]')) {
        var collapse = t.getAttribute('data-aps-collapseall') === '1';
        Array.prototype.forEach.call(wrap.querySelectorAll('.aps__group'), function (g) { g.classList.toggle('collapsed', collapse); });
        if (collapseGroupsDefault) {
          var m = {};
          if (!collapse) Array.prototype.forEach.call(wrap.querySelectorAll('.aps__group'), function (g) { m[g.getAttribute('data-group')] = 1; });
          writeOpenGroups(m);
        }
        return;
      }
      if (t = e.target.closest('[data-aps-gtoggle]')) {
        var grpEl = t.closest('.aps__group');
        grpEl.classList.toggle('collapsed');
        if (collapseGroupsDefault) setGroupOpen(grpEl.getAttribute('data-group'), !grpEl.classList.contains('collapsed'));
        return;
      }
      if (t = e.target.closest('[data-aps-add]')) { e.stopPropagation(); doAdd(t.getAttribute('data-aps-add')); return; }
      if (t = e.target.closest('[data-aps-item]')) { var p = t.getAttribute('data-aps-item').split('\u0001'); select(p[0], p[1]); return; }
    }

    /* ── rail ── */
    /* «Sidetekster & banner» er en EGEN, godt synlig rad øverst i rail-en som
       åpner panelets topptekst-felt i DETALJ-ruten (likt alle andre rader) —
       ikke en innfelt utvid-i-menyen-blokk. */
    function settingsRowHTML() {
      if (!useBanner) return '';
      var cur = ''; try { cur = cfg.banner.current ? cfg.banner.current() : ''; } catch (_) {}
      return '<button type="button" class="aps__setrow' + (isSettingsSel(sel) ? ' active' : '') + '" data-aps-item="' + SET_KEY + '\u0001' + SET_KEY + '">'
        + '<span class="ic">⚙</span>'
        + '<span class="meta"><span class="nm">' + esc(cfg.banner.label || 'Sidetekster & banner') + '</span>'
        + '<span class="ro">' + (cur ? ('«' + esc(cur) + '»') : esc(cfg.banner.sub || 'Topptekst og banner')) + '</span></span>'
        + '<span class="chev">›</span></button>';
    }
    function parkAdopted() {
      if (adoptedNode && adoptedHome) {
        var n = adoptedNode; n.classList.remove('aps__adopted');
        // Marker-elementet har fulgt med inn i .pv-editor (om den ble opprettet
        // etter adopsjonen), så noden returneres ALLTID til riktig container.
        if (adoptedHome.parentNode) adoptedHome.parentNode.replaceChild(n, adoptedHome);
        else if (wrap && wrap.parentNode) wrap.parentNode.appendChild(n);
        if (active()) n.style.display = 'none';
        adoptedNode = null; adoptedHome = null;
      }
    }
    function adoptIntoDetail(node, det) {
      if (!node) return;
      var marker = document.createElement('span');
      marker.className = 'aps__home-marker'; marker.style.display = 'none';
      if (node.parentNode) node.parentNode.insertBefore(marker, node);
      adoptedHome = marker;
      node.style.display = ''; node.classList.add('aps__adopted');
      det.appendChild(node); adoptedNode = node;
    }
    function dockPreview() {
      if (!cfg.previewDock || dockNode || !wrap) return;
      var pt = host.querySelector(PREVIEW_SEL); if (!pt) return;
      var dock = wrap.querySelector('[data-aps-dock]'); if (!dock) return;
      dockMarker = document.createElement('span'); dockMarker.className = 'aps__home-marker'; dockMarker.style.display = 'none';
      if (pt.parentNode) pt.parentNode.insertBefore(dockMarker, pt);
      pt.style.display = ''; pt.classList.add('aps__docked');
      dock.appendChild(pt); dock.hidden = false; dockNode = pt;
      try { window.dispatchEvent(new Event('resize')); } catch (_) {}
    }
    function undockPreview() {
      if (!dockNode) return;
      var dock = wrap && wrap.querySelector('[data-aps-dock]'); if (dock) dock.hidden = true;
      dockNode.classList.remove('aps__docked');
      if (dockMarker && dockMarker.parentNode) dockMarker.parentNode.replaceChild(dockNode, dockMarker);
      else if (host) host.appendChild(dockNode);
      dockNode = null; dockMarker = null;
      try { window.dispatchEvent(new Event('resize')); } catch (_) {}
    }
    function showBannerInDetail(det) {
      var node = null; try { node = cfg.banner.adopt ? cfg.banner.adopt() : null; } catch (_) {}
      if (cfg.banner.adopt && node) { adoptIntoDetail(node, det); }
      else if (cfg.banner.build) {
        var box = document.createElement('div'); box.className = 'aps__banner-built';
        try { cfg.banner.build(box); } catch (_) {}
        det.appendChild(box);
      }
      AC.enhanceHelp && AC.enhanceHelp(det);
    }
    function rowHTML(g, item) {
      var m = {};
      try { m = g.meta(item) || {}; } catch (_) {}
      var dot = m.dot ? '<span class="aps__dot ' + esc(m.dot) + '"></span>' : '';
      var drag = g.onReorder ? '<span class="aps__drag" title="Dra for å flytte" aria-hidden="true">⠿</span>' : '';
      return '<button type="button" class="aps__item' + (g.onReorder ? ' aps__item--drag' : '') + '" data-aps-item="' + esc(g.key) + '\u0001' + esc(itemId(g, item)) + '" data-id="' + esc(itemId(g, item)) + '">'
        + drag
        + '<span class="av ' + esc(m.cls || '') + '">' + esc(m.av || '') + '</span>'
        + '<span class="meta"><span class="nm">' + esc(m.nm || '(uten navn)') + '</span><span class="ro">' + esc(m.sub || '') + '</span></span>'
        + dot + '</button>';
    }
    function rowsForGroup(g) {
      var a = itemsOf(g);
      if (isFilter && filterSeg && g.matchFilter) a = a.filter(function (it) { return g.matchFilter(it, filterSeg); });
      return a.map(function (it) { return rowHTML(g, it); }).join('');
    }
    function renderSegs() {
      var segWrap = wrap.querySelector('[data-aps-segs]'); if (!segWrap) return;
      segWrap.innerHTML = (cfg.filter.segments || []).map(function (s) {
        var n = ''; try { n = s.count ? (' ' + s.count()) : ''; } catch (_) {}
        return '<button type="button" class="aps__seg' + (s.key === filterSeg ? ' on' : '') + '" data-seg="' + esc(s.key) + '">' + esc(s.label) + n + '</button>';
      }).join('');
      Array.prototype.forEach.call(segWrap.querySelectorAll('[data-seg]'), function (b) {
        b.addEventListener('click', function () { filterSeg = b.getAttribute('data-seg'); renderNav(); });
      });
    }
    function renderNav() {
      var scroll = wrap.querySelector('[data-aps-scroll]');
      if (isSections) {
        var secs = sectionList();
        var canReorderSecs = typeof cfg.onSectionReorder === 'function';
        scroll.innerHTML = secs.map(function (s) {
          var fixed = canReorderSecs && !!s.fixed;
          // Låste/faste rader vises som en INNSTILLING (gull ramme + ikon-boks),
          // likt «Info-tekst & banner» i Merch — så det er tydelig at de ikke er
          // flyttbare seksjoner, men innstillinger/faste deler.
          if (fixed) {
            return '<button type="button" class="aps__item aps__item--setting" data-aps-item="' + SEC_KEY + '\u0001' + esc(s.id) + '" data-id="' + esc(s.id) + '" data-fixed>'
              + '<span class="ic">' + esc(s.av || '⚙') + '</span>'
              + '<span class="meta"><span class="nm">' + esc(s.label || '') + '</span><span class="ro">' + esc(s.sub || 'Innstilling') + '</span></span></button>';
          }
          var lead = canReorderSecs ? '<span class="aps__drag" title="Dra her, eller trykk og hold på raden, for å flytte" aria-hidden="true">⠿</span>' : '';
          return '<button type="button" class="aps__item' + (canReorderSecs ? ' aps__item--drag' : '') + '" data-aps-item="' + SEC_KEY + '\u0001' + esc(s.id) + '" data-id="' + esc(s.id) + '">'
            + lead
            + '<span class="av sq">' + esc(s.av || '✎') + '</span>'
            + '<span class="meta"><span class="nm">' + esc(s.label || '') + '</span><span class="ro">' + esc(s.sub || '') + '</span></span></button>';
        }).join('');
        if (canReorderSecs) {
          AC.enableDragSort(scroll, {
            itemSelector: '.aps__item', handleSelector: '.aps__drag', idAttr: 'data-id', holdToDrag: true,
            onReorder: function (ids) { try { cfg.onSectionReorder(ids.filter(function (x) { return x; })); } catch (_) {} renderNav(); }
          });
          Array.prototype.forEach.call(scroll.querySelectorAll('.aps__drag'), function (h) { h.addEventListener('click', function (e) { e.stopPropagation(); }); });
        }
        var foot0 = wrap.querySelector('[data-aps-foot]'); if (foot0) foot0.innerHTML = '';
        paintActive();
        return;
      }
      var openGroupKeys = {};
      Array.prototype.forEach.call(scroll.querySelectorAll('.aps__group'), function (g) { if (!g.classList.contains('collapsed')) openGroupKeys[g.getAttribute('data-group')] = 1; });
      var persistedOpen = collapseGroupsDefault ? (readOpenGroups() || {}) : null;
      var first = true, html = settingsRowHTML();
      // «Fold/åpne alle» når rail-en har flere kollapsbare grupper (Styret, Begrep …)
      var collapsibleGroups = useCollapse ? groups.filter(function (g) { return !g.listDetail; }).length : 0;
      if (collapsibleGroups >= 2) {
        html += '<div class="aps__tools"><button type="button" class="aps__tool" data-aps-collapseall="0">⌄ Åpne alle</button>'
          + '<button type="button" class="aps__tool" data-aps-collapseall="1">⌃ Fold sammen alle</button></div>';
      }
      groups.forEach(function (g) {
        var count = itemsOf(g).length;
        var rows = rowsForGroup(g);
        var openByDefault;
        if (collapseGroupsDefault) {
          // Alt lukket som standard; bare husket (eller nettopp åpnet) tilstand åpner.
          openByDefault = !useCollapse || !!persistedOpen[g.key] || openGroupKeys[g.key];
        } else {
          openByDefault = !useCollapse || g.primary || (first && !sel) || openGroupKeys[g.key];
        }
        if (sel && sel.group === g.key) openByDefault = true;
        first = false;
        var hint = (!collapseGroupsDefault && useCollapse && g.primary && !sel) ? '<span class="hint">åpnet sist</span>' : '';
        if (g.listDetail) {
          html += '<div class="aps__group" data-group="' + esc(g.key) + '">'
            + '<button type="button" class="aps__item aps__grouprow" data-aps-item="' + esc(g.key) + '\u0001' + LIST_KEY + '">'
            + '<span class="av sq">' + esc(g.icon || '≡') + '</span>'
            + '<span class="meta"><span class="nm">' + esc(g.label) + '</span><span class="ro">' + count + ' element</span></span>'
            + '<span class="chev">›</span></button></div>';
        } else if (useCollapse) {
          html += '<div class="aps__group' + (openByDefault ? '' : ' collapsed') + '" data-group="' + esc(g.key) + '">'
            + '<button type="button" class="aps__ghdr" data-aps-gtoggle><span class="gt">' + esc(g.label) + '</span><span class="gc">' + count + '</span>' + hint + '<span class="chev">▾</span></button>'
            + '<div class="aps__items">' + rows + '</div>'
            + (g.addLabel ? '<button type="button" class="aps__add" data-aps-add="' + esc(g.key) + '">+ ' + esc(g.addLabel) + '</button>' : '')
            + '</div>';
        } else {
          html += '<div class="aps__group" data-group="' + esc(g.key) + '"><div class="aps__items">' + rows + '</div></div>';
        }
      });
      scroll.innerHTML = html;
      // Dra-sortering av rail-elementer for grupper som støtter det (g.onReorder).
      groups.forEach(function (g) {
        if (!g.onReorder || g.listDetail) return;
        var itemsEl = scroll.querySelector('.aps__group[data-group="' + g.key + '"] .aps__items');
        if (!itemsEl) return;
        AC.enableDragSort(itemsEl, {
          itemSelector: '.aps__item', handleSelector: '.aps__drag', idAttr: 'data-id',
          onReorder: function (ids) { try { g.onReorder(ids); } catch (_) {} renderNav(); }
        });
        Array.prototype.forEach.call(itemsEl.querySelectorAll('.aps__drag'), function (h) {
          h.addEventListener('click', function (e) { e.stopPropagation(); });
        });
      });
      if (isFilter) renderSegs();
      // foot: global add for single/filter (én gruppe)
      var foot = wrap.querySelector('[data-aps-foot]');
      if (!useCollapse && groups.length === 1 && groups[0].addLabel) {
        foot.innerHTML = '<button type="button" class="btn-add" data-aps-add="' + esc(groups[0].key) + '">+ ' + esc(groups[0].addLabel) + '</button>';
      } else if (useLaunchpad) {
        foot.innerHTML = '<button type="button" class="btn-add" data-aps-add="' + esc((groups[0] || {}).key || '') + '">+ Nytt i valgt seksjon</button>';
      } else { foot.innerHTML = ''; }
      paintActive();
    }

    function paintActive() {
      Array.prototype.forEach.call(wrap.querySelectorAll('.aps__item, .aps__setrow'), function (b) {
        var p = b.getAttribute('data-aps-item').split('\u0001');
        b.classList.toggle('active', !overview && !!sel && p[0] === sel.group && p[1] === sel.id);
      });
      var hint = wrap.querySelector('[data-aps-hint]'); if (hint) hint.hidden = overview || !sel;
    }

    /* ── detalj ── */
    function launchpadHTML() {
      var cards;
      if (isSections) {
        cards = sectionList().map(function (s) {
          return '<button type="button" class="aps-ovw__card" data-aps-sec="' + esc(s.id) + '">'
            + '<span class="oc-nm">' + esc(s.label || '') + '</span><span class="oc-c">' + esc(s.sub || (s.fixed ? 'Innstilling' : 'Sideseksjon')) + '</span>'
            + '<span class="oc-act">Åpne</span></button>';
        }).join('');
      } else {
        cards = groups.map(function (g) {
          var n = itemsOf(g).length;
          return '<button type="button" class="aps-ovw__card" data-aps-open="' + esc(g.key) + '">'
            + '<span class="oc-nm">' + esc(g.label) + '</span><span class="oc-c">' + n + ' element</span>'
            + '<span class="oc-act">Åpne' + (g.addLabel ? ' <span class="oc-add" data-aps-add="' + esc(g.key) + '">+ Nytt</span>' : '') + '</span></button>';
        }).join('');
      }
      var rem = readRemember(); var recent = '';
      if (rem) { var it = findItem(rem.group, rem.id); if (it) { var g = groupByKey(rem.group); var m = g.meta(it) || {};
        recent = '<div class="aps-ovw__recent"><div class="orr-lbl">Sist redigert</div>'
          + '<button type="button" class="aps-orr" data-aps-item="' + esc(rem.group) + '\u0001' + esc(rem.id) + '"><span class="av ' + esc(m.cls || '') + '">' + esc(m.av || '') + '</span><span class="orr-nm">' + esc(m.nm || '') + '</span><span class="orr-go">Åpne →</span></button></div>'; } }
      return '<div class="aps-ovw"><div class="aps-ovw__hi">Hvor vil du begynne?</div>'
        + '<div class="aps-ovw__sub">Velg en seksjon, eller hopp til det du redigerte sist.</div>'
        + '<div class="aps-ovw__cards">' + cards + '</div>' + recent + '</div>';
    }
    function renderDetail() {
      var det = wrap.querySelector('[data-aps-detail]');
      parkAdopted();
      var r = resolveSel();
      if (isSectionSel(r)) {
        var s = findSection(r.id);
        det.innerHTML = '';
        if (s) {
          var secBack = document.createElement('button'); secBack.type = 'button'; secBack.className = 'aps__back'; secBack.setAttribute('data-aps-back', '1'); secBack.textContent = '← Oversikt'; det.appendChild(secBack);
          var sh2 = document.createElement('div'); sh2.className = 'aps__detail-h';
          sh2.innerHTML = '<span class="av sq">' + esc(s.av || '✎') + '</span><div class="dt"><div class="nm">' + esc(s.label || '') + '</div><div class="ro">' + esc(s.sub || 'Sideseksjon') + '</div></div>';
          // «Legg til som snarvei» — for alle flyttbare seksjoner i paneler som
          // har oppgitt sin side (cfg.page). Snarveien peker til seksjonen
          // (side.html#seksjon-id) og deles globalt med alle redaktører via Git.
          if (!s.fixed && cfg.page && cfg.page.href && window.AdminShortcuts && window.AdminShortcuts.addTarget) {
            var scHref0 = cfg.page.href + '#' + s.id;
            var scTarget = { id: (cfg.page.id || 'sec') + '-' + s.id, href: scHref0, label: s.label || cfg.page.label, ico: cfg.page.ico || '🔗' };
            var added0 = window.AdminShortcuts.hasHref(scHref0);
            var sbtn = document.createElement('button');
            sbtn.type = 'button';
            sbtn.className = 'aps__scbtn' + (added0 ? ' is-added' : '');
            sbtn.textContent = added0 ? '✓ Snarvei lagt til' : '🔗 Legg til som snarvei';
            sbtn.title = 'Vises som snarvei på Oversikt-siden i admin (delt med alle redaktører)';
            sbtn.addEventListener('click', function () {
              var on = window.AdminShortcuts.toggleTarget(scTarget);
              sbtn.classList.toggle('is-added', on);
              sbtn.textContent = on ? '✓ Snarvei lagt til' : '🔗 Legg til som snarvei';
            });
            sh2.appendChild(sbtn);
          }
          det.appendChild(sh2);
          if (s.node) { adoptIntoDetail(s.node, det); }
          else if (s.build) { var sbox = document.createElement('div'); sbox.className = 'aps__sec-built'; try { s.build(sbox); } catch (_) {} det.appendChild(sbox); }
          AC.enhanceHelp && AC.enhanceHelp(det);
        } else { det.innerHTML = '<div class="aps__empty">Fant ikke seksjonen.</div>'; }
        det.scrollTop = 0;
        return;
      }
      if (isSettingsSel(r)) {
        det.innerHTML = '';
        { var sb = document.createElement('button'); sb.type = 'button'; sb.className = 'aps__back'; sb.setAttribute('data-aps-back', '1'); sb.textContent = '← Oversikt'; det.appendChild(sb); }
        var sh = document.createElement('div'); sh.className = 'aps__detail-h'; sh.innerHTML = '<span class="av sq">⚙</span><div class="dt"><div class="nm">' + esc(cfg.banner.label || 'Sidetekster & banner') + '</div><div class="ro">' + esc(cfg.banner.sub || 'Topptekst og banner øverst på siden') + '</div></div>';
        det.appendChild(sh);
        showBannerInDetail(det);
        det.scrollTop = 0;
        return;
      }
      if (isListSel(r)) {
        var lg = groupByKey(r.group);
        det.innerHTML = '';
        { var lback = document.createElement('button'); lback.type = 'button'; lback.className = 'aps__back'; lback.setAttribute('data-aps-back', '1'); lback.textContent = '← Oversikt'; det.appendChild(lback); }
        var lh = document.createElement('div'); lh.className = 'aps__detail-h';
        lh.innerHTML = '<span class="av sq">' + esc(lg.icon || '≡') + '</span><div class="dt"><div class="nm">' + esc(lg.label || '') + '</div><div class="ro">Dra i ⠿ for å sortere</div></div>';
        det.appendChild(lh);
        var listWrap = document.createElement('div'); listWrap.className = 'aps__listdetail'; listWrap.setAttribute('data-group', lg.key);
        itemsOf(lg).forEach(function (it) { try { var c = lg.detail(it); if (c) listWrap.appendChild(c); } catch (_) {} });
        det.appendChild(listWrap);
        if (lg.addLabel) {
          var ab = document.createElement('button'); ab.type = 'button'; ab.className = 'btn-add aps__listadd';
          ab.textContent = '+ ' + lg.addLabel;
          ab.addEventListener('click', function () { doAdd(lg.key); });
          det.appendChild(ab);
        }
        if (lg.onReorder) {
          AC.enableDragSort(listWrap, { itemSelector: lg.reorderItemSelector || '.row-card', handleSelector: lg.reorderHandleSelector || '.drag-handle', idAttr: lg.reorderIdAttr || 'data-id', onReorder: function (ids) { try { lg.onReorder(ids); } catch (_) {} } });
        }
        AC.enhanceHelp && AC.enhanceHelp(det);
        det.scrollTop = 0;
        return;
      }
      if (!r) {
        det.innerHTML = launchpadHTML();
        det.querySelectorAll('[data-aps-sec]').forEach(function (b) {
          b.addEventListener('click', function () { select(SEC_KEY, b.getAttribute('data-aps-sec')); });
        });
        det.querySelectorAll('[data-aps-open]').forEach(function (b) {
          b.addEventListener('click', function (e) {
            if (e.target.closest('[data-aps-add]')) { doAdd(e.target.closest('[data-aps-add]').getAttribute('data-aps-add')); return; }
            var g = wrap.querySelector('.aps__group[data-group="' + b.getAttribute('data-aps-open') + '"]'); if (g) g.classList.remove('collapsed');
            var first = g && g.querySelector('.aps__item'); if (first) { var p = first.getAttribute('data-aps-item').split('\u0001'); select(p[0], p[1]); }
            else { var lg = groupByKey(b.getAttribute('data-aps-open')); if (lg && lg.listDetail) select(lg.key, LIST_KEY); }
          });
        });
        det.querySelectorAll('.aps-orr[data-aps-item]').forEach(function (b) {
          b.addEventListener('click', function () { var p = b.getAttribute('data-aps-item').split('\u0001'); select(p[0], p[1]); });
        });
        det.scrollTop = 0;
        return;
      }
      var g = groupByKey(r.group); var item = findItem(r.group, r.id);
      if (!g || !item) { det.innerHTML = '<div class="aps__empty">Fant ikke valgt element.</div>'; return; }
      det.innerHTML = '';
      { var back = document.createElement('button'); back.type = 'button'; back.className = 'aps__back'; back.setAttribute('data-aps-back', '1'); back.textContent = '← Oversikt'; det.appendChild(back); }
      var node;
      try { node = g.detail(item); } catch (e) { node = null; }
      if (node) det.appendChild(node);
      AC.enhanceHelp && AC.enhanceHelp(det);
      det.scrollTop = 0;
    }

    function syncActiveRow() {
      if (!wrap || !sel) return;
      if (isSectionSel(sel)) return;
      if (isSettingsSel(sel)) {
        var sr = wrap.querySelector('.aps__setrow .ro');
        if (sr) { var cur = ''; try { cur = cfg.banner.current ? cfg.banner.current() : ''; } catch (_) {} sr.textContent = cur ? ('«' + cur + '»') : 'Topptekst og banner'; }
        return;
      }
      var g = groupByKey(sel.group); var item = findItem(sel.group, sel.id); if (!g || !item) return;
      var m = {}; try { m = g.meta(item) || {}; } catch (_) {}
      var row = wrap.querySelector('.aps__item.active');
      if (row) {
        var nm = row.querySelector('.nm'); if (nm) nm.textContent = m.nm || '(uten navn)';
        var ro = row.querySelector('.ro'); if (ro) ro.textContent = m.sub || '';
        var av = row.querySelector('.av'); if (av) av.textContent = m.av || '';
      }
      Array.prototype.forEach.call(wrap.querySelectorAll('.aps__group'), function (grp) {
        var gg = groupByKey(grp.getAttribute('data-group')); if (!gg) return;
        var c = grp.querySelector('.gc'); if (c) c.textContent = itemsOf(gg).length;
      });
    }

    function applySearch(q) {
      q = String(q || '').toLowerCase().trim();
      if (isSections) {
        Array.prototype.forEach.call(wrap.querySelectorAll('[data-aps-scroll] > .aps__item'), function (row) {
          var nm = row.querySelector('.nm'), ro = row.querySelector('.ro');
          var hit = !q || (nm && nm.textContent.toLowerCase().indexOf(q) > -1) || (ro && ro.textContent.toLowerCase().indexOf(q) > -1);
          row.style.display = hit ? '' : 'none';
        });
        return;
      }
      Array.prototype.forEach.call(wrap.querySelectorAll('.aps__group'), function (grp) {
        var any = false;
        Array.prototype.forEach.call(grp.querySelectorAll('.aps__item'), function (row) {
          var nm = row.querySelector('.nm'), ro = row.querySelector('.ro');
          var hit = !q || (nm && nm.textContent.toLowerCase().indexOf(q) > -1) || (ro && ro.textContent.toLowerCase().indexOf(q) > -1);
          row.style.display = hit ? '' : 'none'; if (hit) any = true;
        });
        var hdr = grp.querySelector('.aps__ghdr'); if (hdr) hdr.style.opacity = any ? '' : '.4';
      });
    }

    /* ── handlinger ── */
    function select(gk, id) { overview = false; sel = { group: gk, id: id }; writeRemember(); paintActive(); renderDetail(); }
    function doAdd(gk) {
      var g = groupByKey(gk); if (!g || typeof g.onAdd !== 'function') return;
      var id = g.onAdd();
      renderNav();
      if (id != null && AC.undoable) {
        AC.undoable((g.addLabel || 'Nytt') + ' lagt til', function () {
          var a = itemsOf(g); for (var k = 0; k < a.length; k++) { if (String(itemId(g, a[k])) === String(id)) { a.splice(k, 1); break; } }
          if (g.onReorder) { try { g.onReorder(itemsOf(g).map(function (it) { return itemId(g, it); })); } catch (_) {} }
          sel = null; if (active()) { renderNav(); renderDetail(); }
        });
      }
      if (g.listDetail) { sel = { group: gk, id: LIST_KEY }; writeRemember(); paintActive(); renderDetail();
        setTimeout(function () { var inps = wrap.querySelectorAll('[data-aps-detail] .row-card:last-child input, [data-aps-detail] .row-card:last-child textarea'); if (inps.length) inps[0].focus(); }, 40); return; }
      if (id) { sel = { group: gk, id: id }; writeRemember(); paintActive(); renderDetail();
        setTimeout(function () { var inp = wrap.querySelector('[data-aps-detail] input, [data-aps-detail] textarea'); if (inp) inp.focus(); }, 40); }
    }

    /* ── offentlig API ── */
    function render() { ensureWrap(); resolveSel(); renderNav(); renderDetail(); }
    function refresh() { if (!active()) return; ensureWrap(); renderNav(); renderDetail(); }
    function refreshItem(id) { if (!active()) return; renderNav(); if (!id || (sel && sel.id === id)) renderDetail(); else syncActiveRow(); }
    function layoutChanged() {
      var on = active();
      ensureWrap();
      if (!on) { parkAdopted(); undockPreview(); }
      // Robust, panel-uavhengig: skjul ALLE søsken av skallet (det klassiske
      // editor-innholdet — .sec/.meta-panel/.editor-col/.tip osv.), men ALDRI
      // .preview-top (forhåndsvisningen åpnes som overlay via «👁»-knappen).
      var parent = wrap.parentNode;
      if (parent) {
        Array.prototype.forEach.call(parent.children, function (s) {
          if (s === wrap) return;
          if (s.classList && s.classList.contains('preview-top')) return;
          if (PREVIEW_SEL !== '.preview-top' && s.matches && s.matches(PREVIEW_SEL)) return;
          s.style.display = on ? 'none' : '';
        });
      }
      wrap.hidden = !on;
      var pHost = host.closest && host.closest('.panel-host');
      if (pHost) pHost.classList.toggle('shell-on', on);
      if (on) { render(); dockPreview(); }
    }
    function destroy() { parkAdopted(); if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap); wrap = null; }

    // Selv-helbredelse: hvis et fersk panel-mount kjørte layoutChanged før DOM-en
    // var ferdig (race med admin.html sin preview-/krom-oppsett), aktiver på neste tikk.
    setTimeout(function () { try { if (active() && wrap && wrap.hidden) layoutChanged(); } catch (_) {} }, 0);

    return { render: render, refresh: refresh, refreshItem: refreshItem, select: select, layoutChanged: layoutChanged, destroy: destroy, isActive: active };
  }

  window.AdminCommon = window.AdminCommon || {};
  window.AdminCommon.PanelShell = { mount: mount };
})();
