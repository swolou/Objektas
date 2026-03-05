# Elektros Objektai

Mobiliesiems pritaikyta React aplikacija elektrikams, skirta registruoti darbo objektus, naudojamas medžiagas ir eksportuoti sąskaitas faktūras PDF formatu.

## Funkcijos
- Objektų pridėjimas / redagavimas / šalinimas
- Statuso keitimas tiesiogiai sąraše (Naujas → Vykdomas → Užbaigtas)
- Užsakovo informacija kiekviename objekte (įmonė, kodas, PVM, adresas)
- Medžiagų registravimas su kainomis
- PDF sąskaitos faktūros eksportas su pardavėjo ir pirkėjo duomenimis
- Pardavėjo duomenų nustatymai (⚙️ mygtukas)
- Duomenys saugomi naršyklės localStorage

## Technologijos
- React 19
- Vite (dev server, port 5000)
- jsPDF (PDF generavimas)
- localStorage duomenų saugojimui

## Failų struktūra
- `index.html` — pagrindinis HTML failas
- `src/main.jsx` — React entry point
- `src/App.jsx` — pagrindinė App logika ir navigacija
- `src/index.css` — visi stiliai
- `src/utils.js` — pagalbinės funkcijos
- `src/invoiceGenerator.js` — PDF sąskaitos faktūros generavimas
- `src/hooks/useLocalStorage.js` — localStorage hook
- `src/components/ObjectsList.jsx` — objektų sąrašas
- `src/components/ObjectForm.jsx` — objekto forma su užsakovo laukais
- `src/components/ObjectDetail.jsx` — objekto detalės, medžiagos, PDF eksportas
- `src/components/MaterialForm.jsx` — medžiagos forma
- `src/components/ConfirmModal.jsx` — patvirtinimo modalas
- `src/components/SellerSettings.jsx` — pardavėjo duomenų nustatymai
- `vite.config.js` — Vite + React konfigūracija
