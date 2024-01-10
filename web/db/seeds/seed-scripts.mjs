import { sql } from "@vercel/postgres";

async function createDummyScripts() {
    await sql`INSERT INTO scripts (name, public, owner_id, tags) VALUES
        ('@xDepcio/script1', true, 1, 'nextjs react typescript tailwind'),
        ('@xDepcio/script2', false, 1, 'express sequelize postgres socketio'),
        ('@xDepcio/script3', true, 1, 'python flask sql'),
        ('@xDepcio/script4', false, 1, 'sql express'),
        ('@xDepcio/script5', true, 1, 'javascript vue nodejs'),
        ('@xDepcio/script6', true, 1, 'angular typescript rxjs'),
        ('@xDepcio/script7', true, 1, 'react native redux'),
        ('@xDepcio/script8', true, 1, 'php laravel mysql'),
        ('@xDepcio/script9', true, 1, 'ruby rails postgresql'),
        ('@xDepcio/script10', true, 1, 'java spring boot hibernate'),
        ('@xDepcio/script11', true, 1, 'c# .net entityframework'),
        ('@xDepcio/script12', true, 1, 'go gin gorm'),
        ('@xDepcio/script13', true, 1, 'kotlin spring react'),
        ('@xDepcio/script14', true, 1, 'swift vapor postgresql'),
        ('@xDepcio/script15', true, 1, 'docker kubernetes cloud'),
        ('@xDepcio/script16', true, 1, 'graphql apollo server'),
        ('@xDepcio/script17', true, 1, 'html css javascript bootstrap'),
        ('@xDepcio/script18', true, 1, 'typescript webpack babel'),
        ('@xDepcio/script19', true, 1, 'rust actix-web wasm'),
        ('@xDepcio/script20', true, 1, 'elixir phoenix liveview'),
        ('@xDepcio/script21', true, 1, 'perl catalyst dbix'),
        ('@xDepcio/script22', true, 1, 'nodejs express mongodb'),
        ('@xDepcio/script23', true, 1, 'svelte sapper tailwindcss'),
        ('@xDepcio/script24', true, 1, 'haskell yesod postgresql'),
        ('@xDepcio/script25', true, 1, 'clojure ring datomic'),
        ('@pyivy/script1', True, 2, 'nextjs ruby go kotlin'),
        ('@mebcc/script2', True, 9, 'vue'),
        ('@kqjmk/script3', False, 4, 'java kotlin'),
        ('@swbib/script4', False, 7, 'python'),
        ('@jbrwt/script5', False, 5, 'ruby'),
        ('@lrbeo/script6', True, 3, 'react nextjs nodejs ruby python'),
        ('@jbrwt/script7', False, 5, 'vue python javascript java angular'),
        ('@kdjbg/script8', False, 6, 'kotlin typescript php nextjs ruby'),
        ('@tpjcw/script9', False, 1, 'angular kotlin swift'),
        ('@wvqxw/script10', True, 8, 'kotlin react'),
        ('@tgbak/script11', False, 5, 'ruby'),
        ('@mebcc/script12', False, 9, 'java go ruby angular python'),
        ('@vsbis/script13', True, 3, 'php swift go java'),
        ('@vomwq/script14', False, 9, 'swift python ruby'),
        ('@xhgkc/script15', True, 8, 'php'),
        ('@uemki/script16', False, 1, 'kotlin'),
        ('@lrbeo/script17', False, 3, 'swift'),
        ('@swbib/script18', False, 7, 'nodejs go react angular kotlin'),
        ('@swbib/script19', False, 7, 'ruby php vue'),
        ('@wvqxw/script20', False, 8, 'angular javascript'),
        ('@uemki/script21', True, 1, 'kotlin vue javascript python'),
        ('@zdfod/script22', False, 7, 'angular python'),
        ('@zdfod/script23', True, 7, 'go javascript angular swift kotlin'),
        ('@pyivy/script24', False, 2, 'go python'),
        ('@lzgoq/script25', True, 1, 'java php javascript go vue'),
        ('@wyfcy/script26', True, 6, 'nodejs typescript python vue javascript'),
        ('@jbrwt/script27', False, 5, 'nextjs swift'),
        ('@pyivy/script28', True, 2, 'nextjs'),
        ('@lrbeo/script29', False, 3, 'nodejs'),
        ('@pyivy/script30', True, 2, 'nodejs java'),
        ('@vsbis/script31', True, 3, 'go react'),
        ('@wyfcy/script32', False, 6, 'nextjs swift go kotlin'),
        ('@admes/script33', True, 2, 'go'),
        ('@pyivy/script34', False, 2, 'go'),
        ('@tgbak/script35', True, 5, 'python'),
        ('@vomwq/script36', False, 9, 'nodejs python ruby'),
        ('@zusgk/script37', True, 4, 'php swift'),
        ('@zdfod/script38', False, 7, 'python'),
        ('@kdjbg/script39', True, 6, 'javascript nextjs vue react swift'),
        ('@vomwq/script40', True, 9, 'java'),
        ('@kqjmk/script41', True, 4, 'angular vue'),
        ('@uemki/script42', False, 1, 'react'),
        ('@swbib/script43', True, 7, 'swift go'),
        ('@admes/script44', False, 2, 'ruby nextjs vue swift python'),
        ('@wvqxw/script45', False, 8, 'javascript java nextjs swift typescript'),
        ('@wyfcy/script46', True, 6, 'go swift angular ruby kotlin'),
        ('@vomwq/script47', True, 9, 'typescript react java kotlin'),
        ('@kdjbg/script48', True, 6, 'kotlin java go ruby'),
        ('@tpjcw/script49', False, 1, 'kotlin javascript'),
        ('@uemki/script50', False, 1, 'swift vue go ruby')
    ;`
}


async function main() {
    await createDummyScripts()
}

main().catch((err) => {
    console.error(
        "An error occured when seeding database:",
        err
    )
})
