# Spanish pilot: strings for a fluent reader to review (#1101)

Claude drafted every Spanish string below on November 1, 2026 (method `machine-plus-review`, #1067 decision 3). **None of it is on the site.** Each file says `reviewed: false`, so the site shows English and the Spanish page does not build. A fluent Spanish reader must check every line before anything goes live. Crisis text (the crisis strip) and the benefits office title also need a second fluent reader.

Phone numbers, addresses, hours, links and checked dates are not in these files. The page takes them from the English records when it is built, so they cannot be mistyped.

## How to review

For each line: does the Spanish say the same thing as the English, no more and no less, in plain words a resident would use? Watch for words that look right but mean something else, and for anything that sounds like a promise the English does not make.

When a file is right (or after you fix it), in that file:

1. Change `reviewed: false` to the date, for example `reviewed: 2026-11-15`.
2. Add `reviewer: es-reviewer-1` (a role ID, never a name; who that is stays private).
3. For the two high-stakes files (`parts/CrisisStrip.yaml` and `resources/monongalia-county-dohs-office.yaml`), a different reader adds:
   ```yaml
   second_review:
     reviewer: es-reviewer-2
     reviewed: 2026-11-16
   ```
4. Run `npm run check-content` in `site/`. If the English changed since the draft, it prints a `stale` warning: copy in the new hash with `node scripts/check-translations.mjs --hash <file>`.

That PR changes what residents see, so it waits for David (#1067 decisions 4 and 9).

## 1. Page: Help in your language

File: `content/translations/es/pages/help-in-your-language.yaml`. English: `site/src/pages/help-in-your-language.astro`. Shown at `/es/help-in-your-language/` once reviewed.

| Key | English | Spanish draft | Back-translation (machine, for David) |
|---|---|---|---|
| `title` | Help in your language in Morgantown and Mon County | Ayuda en su idioma en Morgantown y el condado de Monongalia | Help in your language in Morgantown and Monongalia County |
| `description` | Where to get free interpreters and help in languages other than English in Morgantown and Monongalia County, WV: hospitals, the Health Department, state benefit offices, courts, legal help and English classes. | Dónde conseguir intérpretes gratis y ayuda en otros idiomas en Morgantown y el condado de Monongalia, WV: hospitales, el Departamento de Salud, oficinas del estado, tribunales, ayuda legal y clases de inglés. | Where to get free interpreters and help in other languages in Morgantown and Monongalia County, WV: hospitals, the Health Department, state offices, courts, legal help and English classes. |
| `heading` | Help in your language | Ayuda en su idioma | Help in your language |
| `lede` | Many offices here will get you an interpreter for free. Say "I need an interpreter" and the name of your language. You can also ask a friend to call with you, but in court a family member or friend cannot interpret for you. | Muchas oficinas de aquí le consiguen un intérprete gratis. Diga "I need an interpreter" (necesito un intérprete) y el nombre de su idioma. También puede pedirle a un amigo que llame con usted, pero en un tribunal un familiar o un amigo no puede ser su intérprete. | Many offices here get you an interpreter for free. Say "I need an interpreter" (I need an interpreter) and the name of your language. You can also ask a friend to call with you, but in a court a family member or a friend cannot be your interpreter. |
| `h_doctor` | At the doctor, hospital or clinic | En el médico, el hospital o la clínica | At the doctor, the hospital or the clinic |
| `h_state` | Food, health coverage and other state help | Comida, seguro médico y otra ayuda del estado | Food, health insurance and other state help |
| `state_text` | The state Department of Human Services handles SNAP, Medicaid and other state help. The state's language access plan from June 2023 (written when the department was part of WVDHHR) says bilingual staff can help in Spanish, outside interpreters are used when needed, and offices are to get cards in several languages so you can point to yours. Ask for an interpreter at the office or when you call. | El Departamento de Servicios Humanos del estado (DoHS) se encarga de SNAP, Medicaid y otra ayuda del estado. El plan de acceso a idiomas del estado, de junio de 2023 (escrito cuando el departamento era parte del WVDHHR), dice que hay personal bilingüe que puede ayudar en español, que se usan intérpretes de afuera cuando hace falta, y que las oficinas deben tener tarjetas en varios idiomas para que usted pueda señalar el suyo. Pida un intérprete en la oficina o cuando llame. | The state Department of Human Services (DoHS) handles SNAP, Medicaid and other state help. The state's language access plan, from June 2023 (written when the department was part of WVDHHR), says there is bilingual staff who can help in Spanish, that outside interpreters are used when needed, and that offices must have cards in several languages so you can point to yours. Ask for an interpreter at the office or when you call. |
| `h_legal` | Court and legal help | Tribunales y ayuda legal | Courts and legal help |
| `h_english` | Learn English | Aprender inglés | Learn English |
| `h_not_listed` | Not on this list yet | Todavía no están en esta lista | Not on this list yet |
| `not_listed` + `not_listed_link` | We checked the websites of Milan Puskar Health Right, Monongalia County Schools and the Morgantown Public Library on October 30, 2026, and none said whether they offer interpreters. Ask when you call. If you work at one of these places and can point us to a page that says so, tell us. | El 30 de octubre de 2026 revisamos los sitios web de Milan Puskar Health Right, Monongalia County Schools y la Morgantown Public Library, y ninguno decía si ofrece intérpretes. Pregunte cuando llame. Si usted trabaja en uno de estos lugares y nos puede mostrar una página que lo diga, díganos. | On October 30, 2026 we checked the websites of Milan Puskar Health Right, Monongalia County Schools and the Morgantown Public Library, and none said whether it offers interpreters. Ask when you call. If you work at one of these places and can show us a page that says so, tell us. |
| `about_translation` | (Spanish page only; replaces "This site is in English only for now. We do not use machine translation...") | Claude, una inteligencia artificial (IA), escribió el primer borrador de esta página en español. Una persona que lee bien el español revisó cada línea antes de ponerla en el sitio. Los números de teléfono, las direcciones y los horarios siempre vienen de nuestras listas en inglés, así que coinciden. El resto del sitio está solo en inglés por ahora. | Claude, an artificial intelligence (AI), wrote the first draft of this page in Spanish. A person who reads Spanish well checked every line before putting it on the site. Phone numbers, addresses and hours always come from our English listings, so they match. The rest of the site is only in English for now. |
| `new_country` | New to the country? ... lists first steps in order. | ¿Es nuevo en el país? Esta página da los primeros pasos en orden: | Are you new to the country? This page gives the first steps in order: |
| `families` | More for families: | Más para familias: | More for families: |
| `in_english` | (marks a link to an English page) | (en inglés) | (in English) |
| `call` | Call | Llamar al | Call |
| `website` | (website button) | Sitio web | Website |
| `more_in_english` | (link to the full English listing) | Más detalles en inglés | More details in English |
| `checked_label` | Checked | Lo revisamos el | We checked it on |
| `source_label` | Source | Fuente | Source |
| `stale_note` | (shown only if the English changes after review) | Una parte de esta página cambió en inglés y la estamos revisando. | A part of this page changed in English and we are checking it. |
| `language_label` | Language (label of the language switcher) | Idioma | Language |

Note for the reviewer: `lede` keeps "I need an interpreter" in English on purpose, so a reader can say those exact words to staff.

## 2. Part: the "I need an interpreter" card

File: `content/translations/es/parts/InterpreterCard.yaml`. English: `site/src/components/InterpreterCard.astro`. The card shows each Spanish line with the English under it, so staff can read it. It appears only on the Spanish page.

| Key | English (shown under the Spanish) | Spanish draft | Back-translation |
|---|---|---|---|
| `heading` | (card heading) | Tarjeta para pedir un intérprete | Card to ask for an interpreter |
| `show_this` | (instruction to the reader) | Muestre esta tarjeta en una oficina, una clínica o un tribunal. | Show this card at an office, a clinic or a court. |
| `need` | I need an interpreter. | Necesito un intérprete. | I need an interpreter. |
| `my_language` | My language is Spanish. | Mi idioma es el español. | My language is Spanish. |
| `please` | Please get an interpreter for me. | Por favor, pida un intérprete para mí. | Please, ask for an interpreter for me. |

## 3. Part: the crisis strip (high stakes: needs two readers)

File: `content/translations/es/parts/CrisisStrip.yaml`. English: `site/src/components/CrisisStrip.astro`. The numbers 911 and 988 come from the page code and the 988 record, never from this file.

| Key | English | Spanish draft | Back-translation |
|---|---|---|---|
| `label` | Danger or crisis (screen reader label) | Peligro o crisis | Danger or crisis |
| `danger` | Danger? Call [911]. | ¿Peligro? Llame al [911]. | Danger? Call [911]. |
| `crisis` | Crisis? Call or text [988]. | ¿Crisis? Llame o envíe un mensaje de texto al [988]. | Crisis? Call or send a text message to [988]. |
| `quick_exit` | Quick exit | Salida rápida | Quick exit |
| `what_is_this` | What is this? | ¿Qué es esto? | What is this? |

The Spanish help page does not show the crisis strip today, because the English page does not either. These words are ready for later Spanish pages that do (for example a Spanish food or shelter page). The "About Quick exit" note the strip links to is not translated yet.

## 4. Listing titles

Only the title of each listing is translated. The rest of each listing stays on the English page, which the Spanish card links to ("Más detalles en inglés"). Official names stay in English, so a reader can say them at the office.

| File (`content/translations/es/resources/`) | English title | Spanish draft | Back-translation |
|---|---|---|---|
| `wvu-medicine-language-services.yaml` | Free interpreters at WVU Medicine hospitals | Intérpretes gratis en los hospitales de WVU Medicine | Free interpreters in WVU Medicine hospitals |
| `monchd-language-help.yaml` | Interpreters at the Monongalia County Health Department | Intérpretes en el Monongalia County Health Department (el Departamento de Salud del condado) | Interpreters at the Monongalia County Health Department (the county Health Department) |
| `monongalia-county-dohs-office.yaml` (high stakes: two readers) | Monongalia County Department of Human Services (DoHS) office | Oficina del Monongalia County Department of Human Services (DoHS, el Departamento de Servicios Humanos del condado) | Office of the Monongalia County Department of Human Services (DoHS, the county Department of Human Services) |
| `wv-court-interpreters.yaml` | Free interpreters in West Virginia state courts | Intérpretes gratis en los tribunales estatales de West Virginia | Free interpreters in the state courts of West Virginia |
| `msj-immigration-legal-help.yaml` | Free immigration legal consultations at Mountain State Justice | Consultas legales gratis sobre inmigración en Mountain State Justice | Free legal consultations about immigration at Mountain State Justice |
| `ccwva-immigration-services.yaml` | Refugee resettlement and low-cost immigration legal help from Catholic Charities West Virginia | Reasentamiento de refugiados y ayuda legal de inmigración a bajo costo de Catholic Charities West Virginia | Refugee resettlement and low-cost immigration legal help from Catholic Charities West Virginia |
| `mtec-adult-education-esl.yaml` | Adult education and English classes at MTEC | Educación para adultos y clases de inglés en MTEC | Education for adults and English classes at MTEC |

## 5. The English page sentence (English, for David)

When the Spanish page goes live (and only then), `/help-in-your-language/` stops saying "This site is in English only for now. We do not use machine translation, because a wrong phone number, date or rule could send someone to the wrong place." and says instead:

> This page is also in Spanish (en español). Claude, an AI, wrote the first draft of the Spanish, and a person who reads Spanish well checked every line before it went on the site. Phone numbers, addresses and hours always come from the English listings, so they match. The rest of the site is in English only for now.

The page decides this at build time, from whether the reviewed Spanish page exists, so the old sentence can never sit next to a live Spanish page, and the new one can never show before review.

## Not included: official Spanish pages

The plan says to link official Spanish pages (988, SNAP, Medicaid, WIC) only after checking each is a current official page. On November 1, 2026 none could be confirmed by an automated read: the USDA addresses for Spanish SNAP and WIC (`fns.usda.gov/es/snap`, `/es/wic`) now send readers to the English pages, and 988lifeline.org and medicaid.gov refuse automated reads. So the Spanish page links none of them yet. A person can check them (see the `needs-verification` issue linked from #1101).
