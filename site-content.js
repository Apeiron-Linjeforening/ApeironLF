/* ============================================================
   site-content.js — redigerbart innhold for delt footer
   Leses av site-chrome.js, som bygger footeren på alle sider.
   Rediger denne via footer-admin.html (eller for hånd her).

   window.SITE_FOOTER:
     name     — stor tittel i footeren
     tagline  — kursiv undertekst
     links    — generelle lenker (vises som rad; { label, href })
                href kan være "side.html", "side.html#anker" eller "#anker"
     social   — sosiale lenker ({ label, href, icon })
                icon: "github" | "facebook" | "instagram" (ellers vises kun tekst)
     report   — «Rapporter en feil»-lenken ({ label, email, subject })
     fine     — copyright-/finstilt linje nederst
   ============================================================ */
window.SITE_FOOTER = {
  name: "APEIRON",
  tagline: "filosofi & etikk · NTNU Trondheim",
  links: [
    { label: "Hjem", href: "index.html" },
    { label: "Om oss", href: "om-oss.html#om" },
    { label: "Studiet", href: "pensum.html" },
    { label: "Pensum", href: "pensum.html" },
    { label: "Begrep", href: "begrep.html" },
    { label: "Arrangementer", href: "index.html#arrangementer" },
    { label: "Oppslagstavla", href: "oppslagstavla.html" },
    { label: "Aporetisk Aften", href: "index.html#aporetisk" },
    { label: "Fadderuke", href: "index.html#fadderuke" },
    { label: "Apeiron styret", href: "styret.html" },
    { label: "Tillitsvalgte", href: "styret.html#tillitsvalgte" },
    { label: "S.A.K", href: "styret.html#sak" },
    { label: "Verv", href: "styret.html#vervene" },
    { label: "Utmerkelser", href: "utmerkelser.html" },
    { label: "Oppnåelser", href: "oppnaelser.html" },
    { label: "Lesesalen", href: "om-oss.html#lesesalen" },
    { label: "Samarbeid", href: "om-oss.html#samarbeid" },
    { label: "Galleri", href: "galleri.html" },
    { label: "Hjelp", href: "hjelp.html" },
    { label: "Merch", href: "merch.html" },
    { label: "Kjøp & bytte", href: "marked.html" },
    { label: "Bli medlem", href: "index.html#bli-medlem" },
    { label: "Kontakt", href: "index.html#kontakt" }
  ],
  social: [
    { label: "GitHub", href: "https://github.com/Apeiron-Linjeforening/ApeironLF", icon: "github" },
    { label: "Facebook", href: "https://www.facebook.com/ApeironNTNU/", icon: "facebook" },
    { label: "Instagram", href: "https://www.instagram.com/apeiron_linjeforening_ntnu/", icon: "instagram" },
    { label: "Meme", href: "https://www.instagram.com/apeironmeme/", icon: "instagram" }
  ],
  report: {
    label: "Rapporter en feil på nettsiden",
    email: "apeironlinjeforening@gmail.com",
    subject: "Feil på nettsiden"
  },
  fine: "© 2026 Apeiron Linjeforening"
};
