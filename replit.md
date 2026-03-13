# Elektros Objektai

Mobiliesiems pritaikyta React aplikacija elektrikams, skirta registruoti darbo objektus, naudojamas medžiagas ir eksportuoti sąskaitas faktūras PDF formatu.

## Funkcijos
- Objektų pridėjimas / redagavimas / šalinimas
- Statuso keitimas tiesiogiai sąraše (Naujas → Vykdomas → Užbaigtas)
- Užsakovo informacija kiekviename objekte (įmonė, kodas, PVM, adresas)
- Dienų sistema — medžiagos registruojamos pagal datą
- Medžiagų registravimas su kiekiu (metrais)
- Medžiagų autocomplete iš kamerų ir laidų duomenų bazių
- Bendro medžiagų kiekio suvestinė su PDF eksportu
- Rezultatų (suvestinių) saugojimas duomenų bazėje
- PDF sąskaitos faktūros eksportas su pardavėjo ir pirkėjo duomenimis
- Pardavėjo duomenų nustatymai (⚙️ mygtukas)
- Objektų paieška pagal pavadinimą, adresą, klientą

## Technologijos
- React 19 (frontend)
- Vite (dev server, port 5000)
- Express (backend API, port 3001)
- PostgreSQL (duomenų bazė)
- jsPDF (PDF generavimas)
- localStorage (pardavėjo nustatymai, sąskaitų PDF)

## Duomenų saugojimas
- **PostgreSQL** — objektai, dienos, medžiagos, kameros, laidai, rezultatai
- **localStorage** — pardavėjo nustatymai (`elektros_pardavejas`), sąskaitų PDF (`invoices_{objId}`)

## DB Lentelės
- `objektas` — objekto ir kliento informacija
- `dienos` — darbo dienos susietos su objektu
- `medziagos` — medžiagos susietos su diena
- `kameros` — kamerų pavadinimų duomenų bazė (autocomplete)
- `laidai` — laidų pavadinimų duomenų bazė (autocomplete)
- `rezultatas` — suvestinių skaičiavimo rezultatai

## Failų struktūra
- `index.html` — pagrindinis HTML failas
- `server.js` — Express backend API
- `src/main.jsx` — React entry point
- `src/App.jsx` — pagrindinė App logika ir navigacija
- `src/index.css` — visi stiliai
- `src/utils.js` — pagalbinės funkcijos
- `src/invoiceGenerator.js` — PDF sąskaitos faktūros generavimas
- `src/hooks/useApi.js` — API hook ir funkcijos
- `src/components/ObjectsList.jsx` — objektų sąrašas su paieška
- `src/components/ObjectForm.jsx` — objekto forma su užsakovo laukais
- `src/components/ObjectDetail.jsx` — objekto detalės, dienos, medžiagos, rezultatai
- `src/components/MaterialForm.jsx` — medžiagos forma su autocomplete ir DB valdymu
- `src/components/ConfirmModal.jsx` — patvirtinimo modalas
- `src/components/SellerSettings.jsx` — pardavėjo duomenų nustatymai
- `vite.config.js` — Vite + React + proxy konfigūracija
