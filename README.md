# Leerpuls — by Deekman Enterprises

Studie-app waarin studenten hun eigen stof per vak toevoegen en ermee leren met AI:
oefentoetsen met cijfer, flashcards (bakjessysteem), gesprekken oefenen, samenvattingen,
vragen stellen en een leerplan tot de toets.

- **Live adres:** https://leerpuls.deekmanenterprises.com/
- **Hoofdbeheerder:** info@deekmanenterprises.com (vast, kan niet verwijderd of gepauzeerd worden)
- **Accounts:** alleen beheerders voegen accounts toe. Inloggen gaat met een code per mail,
  daarna kan de student een wachtwoord instellen.

## Bestanden

| Bestand | Waar het heen gaat |
|---|---|
| `index.html`, `config.js`, `CNAME`, `README.md` | GitHub-repo (root), via GitHub Pages online |
| `supabase/schema.sql` | Supabase → SQL Editor |
| `supabase/functions/ai/index.ts` | Supabase → Edge Functions → functie `ai` |
| `supabase/functions/admin/index.ts` | Supabase → Edge Functions → functie `admin` |

## Installatie (eenmalig, in deze volgorde)

1. **Supabase-project aanmaken.** Maak in je organisatie Deekman-Enterprises een nieuw project,
   bijvoorbeeld `leerpuls`, regio Europe (Frankfurt of Amsterdam).
2. **Database.** SQL Editor → New query → plak `supabase/schema.sql` → Run.
3. **Inloggen instellen.** Authentication → Sign In / Providers:
   - Email aan, **"Allow new users to sign up" UIT** (alleen beheerders maken accounts aan).
   - Authentication → URL Configuration: Site URL `https://leerpuls.deekmanenterprises.com/`,
     en dezelfde URL bij Redirect URLs.
4. **Mail via Resend** (zelfde Resend-account en domein als Paginapuls en het Werknemersportaal).
   Authentication → Emails → SMTP Settings: host `smtp.resend.com`, poort `465`, username
   `resend`, wachtwoord = een Resend API-key, sender `noreply@deekmanenterprises.com`,
   sender name `Leerpuls`.
5. **Mailsjabloon met code.** Authentication → Emails → Templates → **Magic Link**. Zonder
   `{{ .Token }}` krijgen studenten alleen een link en geen code. Gebruik bijvoorbeeld:

   ```html
   <h2>Je inlogcode voor Leerpuls</h2>
   <p>Vul deze code in op de inlogpagina:</p>
   <p style="font-size:32px;font-weight:bold;letter-spacing:6px">{{ .Token }}</p>
   <p>De code is een uur geldig. Heb je niet geprobeerd in te loggen? Dan kun je deze mail negeren.</p>
   <p style="color:#5A6280;font-size:13px">Of klik op <a href="{{ .ConfirmationURL }}">deze link</a> om direct in te loggen.</p>
   ```
6. **Jouw eigen account.** Authentication → Users → Add user → Create new user:
   `info@deekmanenterprises.com`, vink **Auto Confirm User** aan (wachtwoord mag leeg of tijdelijk).
   De accountregel als hoofdbeheerder staat al in de database door `schema.sql`.
7. **Edge Functions.** Edge Functions → Deploy a new function → Via Editor:
   - naam `ai`, plak `supabase/functions/ai/index.ts`, Deploy;
   - naam `admin`, plak `supabase/functions/admin/index.ts`, Deploy;
   - zet bij beide functies onder Details **"Verify JWT with legacy secret" / "Enforce JWT
     verification" UIT**. De functies controleren de inlog zelf; met de nieuwe Supabase-keys
     weigert die oude controle anders geldige logins.
8. **Secrets.** Edge Functions → Secrets → Add:
   - `ANTHROPIC_API_KEY` = je key uit console.anthropic.com (verplicht voor alle AI-functies)
   - `RESEND_API_KEY` = een Resend API-key (voor de welkomstmail bij nieuwe accounts)
   - optioneel `APP_URL`, `MAIL_FROM`, `ANTHROPIC_MODEL`, `ANTHROPIC_MODEL_QUICK`
9. **config.js invullen.** Project Settings → API Keys / Data API: zet de Project URL
   (kaal, zonder `/rest/v1/`) en de **publishable key** in `config.js`. Nooit de secret key.
10. **GitHub.** Nieuwe repo, bijvoorbeeld `Deekman-Enterprises/leerpuls`. Upload `index.html`,
    `config.js`, `CNAME` en `README.md` in de root. Let op dat GitHub ze niet hernoemt naar
    `index_2.html` of iets dergelijks. Settings → Pages: branch `main`, map `/ (root)`.
    Custom domain `leerpuls.deekmanenterprises.com`, en zet **Enforce HTTPS** aan zodra dat kan.
11. **DNS in Squarespace.** CNAME-record: host `leerpuls` → `deekman-enterprises.github.io`.
12. **Testen.** Open de site, log in met info@deekmanenterprises.com en de code uit je mail,
    stel een wachtwoord in, en voeg bij Beheer een testaccount toe.

## Kosten en AI-limiet

- Elke AI-actie (toets maken, nakijken, gespreksbeurt, samenvatting, foto lezen) telt als
  één actie en gaat via jouw Anthropic-key; je betaalt per gebruik.
- Standaard heeft elke student **60 AI-acties per dag**. Per account aan te passen bij Beheer.
  Het hoofdaccount heeft geen limiet.
- Bij Beheer zie je per student hoeveel AI-acties er vandaag en deze week zijn gebruikt.
- Zet bij console.anthropic.com ook een maandlimiet op je key, als extra vangnet.

## Privacy

- Studenten zien alleen hun eigen stof, resultaten en gesprekken (Row Level Security).
- Beheerders zien alleen aantallen per student, nooit de inhoud.
- Studenten kunnen bij Account al hun gegevens downloaden. Verwijderen van een account bij
  Beheer wist ook alle stof, bestanden, kaarten en resultaten van die student.

## Bekende valkuilen (uit eerdere projecten)

- Bij een "Invalid path"-melding staat er waarschijnlijk `/rest/v1/` achter de URL in
  `config.js`, of staat de Site URL in Supabase nog op localhost.
- Kan een student de code niet helemaal intypen: het veld accepteert tot 12 cijfers.
- Na een upload naar GitHub kan het een paar minuten duren voordat de nieuwe versie zichtbaar
  is; probeer een incognitovenster.
- "Dit e-mailadres heeft nog geen account": het adres staat niet bij Beheer, of is met een
  hoofdletter of spatie anders ingevoerd.
