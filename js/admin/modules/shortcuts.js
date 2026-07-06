/* admin-modules/shortcuts.js — usynlig «panel» som kun finnes for å PUBLISERE
   de egendefinerte snarveiene (content/admin-shortcuts.js) gjennom den vanlige
   publiseringsflyten. Selve redigeringen skjer på Oversikt-siden og inne i
   seksjonene (window.AdminShortcuts i admin.html). */
(function () {
  'use strict';
  if (!window.AdminPanels) return;
  AdminPanels.define('shortcuts', {
    title: 'Snarveier',
    exportName: 'content/admin-shortcuts.js',
    mount: function (host, AC) {
      return {
        export: function () {
          var data = window.ADMIN_SHORTCUTS || [];
          try { var raw = localStorage.getItem('apeiron-shortcuts-v1'); if (raw != null) data = JSON.parse(raw); } catch (_) {}
          if (!Array.isArray(data)) data = [];
          var js = '/* content/admin-shortcuts.js — egendefinerte snarveier i Admin-senteret.\n'
            + '   Deles globalt med alle redaktører via Git. Redigeres i Admin → Oversikt\n'
            + '   (kortet «Snarveier») eller med «Legg til som snarvei» inne i en seksjon.\n'
            + '   href peker INN i Admin-senteret: «admin.html#<panel>» eller «admin.html#<panel>/<seksjon>».\n'
            + '   Hvert element: { id, label, href, ico } */\n'
            + 'window.ADMIN_SHORTCUTS = ' + JSON.stringify(data, null, 2) + ';\n';
          AC.saveFile('content/admin-shortcuts.js', js);
        }
      };
    }
  });
})();
