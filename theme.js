/* Apeiron — lys/mørk modus. Lastes først i <head> (blokkerende) for å unngå FOUC.
   Standard er lyst; brukerens valg huskes i localStorage. Attributtet settes på
   <html> fordi <body> ikke finnes ennå når dette kjører. */
(function () {
  try {
    var dark = localStorage.getItem('colorMode') === 'dark';
    document.documentElement.dataset.mode = dark ? 'marine' : 'paper';
  } catch (e) {
    document.documentElement.dataset.mode = 'paper';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var t = document.getElementById('colorToggle');
    if (!t) return;
    t.addEventListener('click', function () {
      var d = document.documentElement.dataset.mode === 'marine';
      document.documentElement.dataset.mode = d ? 'paper' : 'marine';
      try { localStorage.setItem('colorMode', d ? 'light' : 'dark'); } catch (e) {}
    });
  });
})();
