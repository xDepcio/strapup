### Instalation
`npm i strapup -g` - install globally to be able to paste and save your templates anywhere.

### Basic use
`npx strapup` - Opens up interactive CLI. Follow on-screen informations to save/paste templates and run custom scripts.

For rest, refer to the [docs](https://strapup.vercel.app/docs/Basic%20use/Save%20and%20Paste)
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
```sh
npm install @reduxjs/toolkit react-redux
npx strapup paste @otherUser/next-redux-ts ${pasteDir}
sed <some sed find combo here>
```
Przy uruchamianiu użytkownik zostanie poproszony o podanie `pasteDir`.

Sprawdzamy jak wygląda (jakie ma pliki i strukturę) schemat `@otherUser/next-redux-ts`. Odpowiada nam, więc z poziomu CLI uruchamiamy skrypt `@ExampleUserName/Add-Redux-Typescript-to-NextJS`, prosi nas on o podanie wartości dla `pasteDir`, po jej podaniu nasz projekt jest uzupełniony o boilerplate code potrzebny dla Reduxa.

## Główne Technologie
- Next.js 14
- NodeJS
- TypeScript
