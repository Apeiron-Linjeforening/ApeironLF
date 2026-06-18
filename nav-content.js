/* ============================================================
   nav-content.js — redigerbar meny for hele nettstedet
   Leses av site-chrome.js, som bygger BÅDE header-menyen og
   mobilmenyen (skuffen) fra denne ene lista — på alle sider.
   Rediger via meny-admin.html (eller for hånd her).

   Datamodell: window.SITE_NAV = liste med toppnivå-punkter.
   Hvert punkt: { label, href, children?[{label,href}],
   drawerOnly?  (kun mobil),  desktopOnly? (kun desktop) }.
   Skriv hele «side.html#anker» i href — forkortes automatisk.
   Sist oppdatert: 18.6.2026
   ============================================================ */
window.SITE_NAV = [
  {
    "label": "Hjem",
    "href": "index.html"
  },
  {
    "label": "Hva skjer",
    "href": "index.html#arrangementer",
    "children": [
      {
        "label": "Arrangementer",
        "href": "index.html#arrangementer"
      },
      {
        "label": "Oppslagstavla",
        "href": "oppslagstavla.html"
      },
      {
        "label": "Aporetisk Aften",
        "href": "index.html#aporetisk"
      },
      {
        "label": "Fadderuke",
        "href": "index.html#fadderuke"
      },
      {
        "label": "Galleri",
        "href": "galleri.html"
      }
    ]
  },
  {
    "label": "Faglig",
    "href": "pensum.html",
    "children": [
      {
        "label": "Pensum & studieretninger",
        "href": "pensum.html"
      },
      {
        "label": "Grader & løp",
        "href": "pensum.html#grader"
      }
    ]
  },
  {
    "label": "Foreningen",
    "href": "om-oss.html",
    "children": [
      {
        "label": "Om oss",
        "href": "om-oss.html#om"
      },
      {
        "label": "Styret & tillitsvalgte",
        "href": "styret.html"
      },
      {
        "label": "Verv",
        "href": "styret.html#vervene"
      },
      {
        "label": "Fellesskap & samarbeid",
        "href": "om-oss.html#samarbeid"
      },
      {
        "label": "Lesesalen",
        "href": "om-oss.html#lesesalen"
      },
      {
        "label": "Utmerkelser",
        "href": "utmerkelser.html"
      },
      {
        "label": "Oppnåelser",
        "href": "oppnaelser.html"
      }
    ]
  },
  {
    "label": "Begrep",
    "href": "begrep.html"
  },
  {
    "label": "Merch",
    "href": "merch.html",
    "children": [
      {
        "label": "Merch",
        "href": "merch.html"
      },
      {
        "label": "Kjøp & bytte",
        "href": "marked.html"
      }
    ]
  },
  {
    "label": "Hjelp & støtte",
    "href": "hjelp.html"
  },
  {
    "label": "Bli medlem",
    "href": "index.html#bli-medlem",
    "drawerOnly": true
  }
];
window.SITE_NAV_CONFIG = { align: 0 };
