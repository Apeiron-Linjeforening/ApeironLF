/* ============================================================
   nav-content.js — redigerbar meny for hele nettstedet
   Leses av site-chrome.js, som bygger BÅDE header-menyen og
   mobilmenyen (skuffen) fra denne ene lista — på alle sider.
   Rediger via meny-admin.html (eller for hånd her).

   ── Datamodell ──
   window.SITE_NAV er en liste med toppnivå-oppføringer i den
   rekkefølgen de skal vises (venstre→høyre i header, topp→bunn
   i mobilmenyen). Hver oppføring:

     {
       label:   "Tekst som vises",
       href:    "hvor lenken går",       // f.eks. "begrep.html"
                                          // eller "index.html#kontakt"
       children: [                        // VALGFRITT — gjør oppføringen
         { label, href }, ...             // til en nedtrekksmeny (desktop)
       ],                                 // og en sammenleggbar gruppe (mobil)
       drawerOnly: true                   // VALGFRITT — vis KUN i mobilmenyen
       desktopOnly: true                  // VALGFRITT — vis KUN i header-menyen
     }

   Tips: skriv hele «side.html#anker» i href — menyen forkorter
   den automatisk til «#anker» på den siden den peker til, så
   scroll blir mykt. Første barn i en nedtrekksmeny er som regel
   selve landingslenken (samme href som forelderen).
   ============================================================ */
window.SITE_NAV = [
  {
    label: "Om oss",
    href: "index.html#om",
    children: [
      { label: "Om oss", href: "index.html#om" },
      { label: "Lesesalen", href: "index.html#lesesalen" },
      { label: "Samarbeid", href: "index.html#samarbeid" }
    ]
  },
  {
    label: "Studiene",
    href: "index.html#studiet",
    children: [
      { label: "Studiene", href: "index.html#studiet" },
      { label: "Pensum", href: "pensum.html" }
    ]
  },
  {
    label: "Arrangementer",
    href: "index.html#arrangementer",
    children: [
      { label: "Arrangementer", href: "index.html#arrangementer" },
      { label: "Aporetisk Aften", href: "index.html#aporetisk" },
      { label: "Fadderuke", href: "index.html#fadderuke" }
    ]
  },
  {
    label: "Styret",
    href: "styret.html",
    children: [
      { label: "Apeiron styret", href: "styret.html" },
      { label: "Tillitsvalgte", href: "styret.html#tillitsvalgte" },
      { label: "S.A.K", href: "styret.html#sak" },
      { label: "Verv", href: "styret.html#vervene" }
    ]
  },
  { label: "Begrep", href: "begrep.html" },
  { label: "Galleri", href: "galleri.html" },
  { label: "Hjelp & støtte", href: "hjelp.html" },
  {
    label: "Merch",
    href: "merch.html",
    children: [
      { label: "Merch", href: "merch.html" },
      { label: "Kjøp & bytte", href: "marked.html" }
    ]
  },
  { label: "Kontakt", href: "index.html#kontakt" },
  { label: "Bli medlem", href: "index.html#bli-medlem", drawerOnly: true }
];

/* ── Plassering på desktop-menylinja ──
   align: 0 = venstrelent (lenkene hugger logoen), 50 = sentrert,
   100 = høyrelent (lenkene skyves mot høyre, ved siden av søk/modus).
   Mellomverdier (hakk på 5) finjusterer. Settes i meny-admin.html. */
window.SITE_NAV_CONFIG = { align: 0 };
