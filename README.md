This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
### Instalation
`npm i strapup -g` - install globally to be able to paste and save your templates anywhere.

### Basic use
`npx strapup` - Opens up interactive CLI. Follow on-screen informations to save/paste templates and run custom scripts.

For rest, refer to the [docs](https://strapup.vercel.app/docs/Basic%20use/Save%20and%20Paste)
# PAP2023Z-Z29
# Strapup - Narzędzie CLI do bootsrapowania projektów
# Strapup - Narzędzie CLI do szybkiego inicjowania/modyfikowania projektów

## Planowane segmenty
### CLI
Program dystrybuowany za pomocą NPM umożliwiający inicjowanie/modyfikowanie projektów.
Wyróżniamy w nim:
- Schematy - Struktura plików, którą użytkownik może zapisać aby wykorzystać w późniejszym czasie
- Skrypty - Lista komend używana modyfikacji struktury plików za pomocą wcześniej zapisanych schematów

Użytkownik ma dodatkowo możliwość używania schematów/skryptów dodanych przez innych użytkowników.

### Strona internetowa
Celem strony jest stworzenie dokumentacji poszczególnych skryptów/schematów, gdzie użytkownik może sprawdzić strukturę każdego schematu i skryptu oraz wyszukać skrypt/schemat stworzony przez innych użytkowników dotyczący interesujących go technologii.

## Przykładowe użytkowanie
Chcemy do projektu w Next.js nad którym pracujemy dodać Redux - state manager do Reacta. Używając narzędzia wyszukiwania na stronie internetowej szukamy skryptu pod słowami kluczowymi Next i Redux. Z wyszukiwań wybieramy `@ExampleUserName/Add-Redux-Typescript-to-NextJS` dlatego, że ma najwięcej polubień. Oto co skrypt robi:
`npm install @reduxjs/toolkit react-redux`
`npx strapup paste @otherUser/next-redux-ts ${pasteDir}`
`sed <some sed find combo here>`
Przy uruchamianiu użytkownik zostanie poproszony o podanie pasteDir.

Sprawdzamy jak wygląda (jakie ma pliki i strukturę) schemat `@otherUser/next-redux-ts`. Odpowiada nam, więc z poziomu CLI uruchamiamy skrypt `@ExampleUserName/Add-Redux-Typescript-to-NextJS`, prosi nas on o podanie wartości dla `pasteDir`, po jej podaniu nasz projekt jest uzupełniony o boilerplate code potrzebny dla Reduxa.

## Główne Technologie
- Next.js 14
- NodeJS
- TypeScript
