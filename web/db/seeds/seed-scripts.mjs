import { sql } from "@vercel/postgres";
import { BASE_SEED_INDEX } from "./constants.mjs";

async function createDummyScripts() {
    const queryString = `INSERT INTO scripts (id, name, public, owner_id, tags) VALUES
        (${BASE_SEED_INDEX}1, '@xDepcio/script1', true, ${BASE_SEED_INDEX}1, 'nextjs react typescript tailwind'),
        (${BASE_SEED_INDEX}2, '@xDepcio/script2', false, ${BASE_SEED_INDEX}1, 'express sequelize postgres socketio'),
        (${BASE_SEED_INDEX}3, '@xDepcio/script3', true, ${BASE_SEED_INDEX}1, 'python flask sql'),
        (${BASE_SEED_INDEX}4, '@xDepcio/script4', false, ${BASE_SEED_INDEX}1, 'sql express'),
        (${BASE_SEED_INDEX}5, '@xDepcio/script5', true, ${BASE_SEED_INDEX}1, 'javascript vue nodejs'),
        (${BASE_SEED_INDEX}6, '@xDepcio/script6', true, ${BASE_SEED_INDEX}1, 'angular typescript rxjs'),
        (${BASE_SEED_INDEX}7, '@xDepcio/script7', true, ${BASE_SEED_INDEX}1, 'react native redux'),
        (${BASE_SEED_INDEX}8, '@xDepcio/script8', true, ${BASE_SEED_INDEX}1, 'php laravel mysql'),
        (${BASE_SEED_INDEX}9, '@xDepcio/script9', true, ${BASE_SEED_INDEX}1, 'ruby rails postgresql'),
        (${BASE_SEED_INDEX}10, '@xDepcio/script10', true, ${BASE_SEED_INDEX}1, 'java spring boot hibernate'),
        (${BASE_SEED_INDEX}11, '@xDepcio/script11', true, ${BASE_SEED_INDEX}1, 'c# .net entityframework'),
        (${BASE_SEED_INDEX}12, '@xDepcio/script12', true, ${BASE_SEED_INDEX}1, 'go gin gorm'),
        (${BASE_SEED_INDEX}13, '@xDepcio/script13', true, ${BASE_SEED_INDEX}1, 'kotlin spring react'),
        (${BASE_SEED_INDEX}14, '@xDepcio/script14', true, ${BASE_SEED_INDEX}1, 'swift vapor postgresql'),
        (${BASE_SEED_INDEX}15, '@xDepcio/script15', true, ${BASE_SEED_INDEX}1, 'docker kubernetes cloud'),
        (${BASE_SEED_INDEX}16, '@xDepcio/script16', true, ${BASE_SEED_INDEX}1, 'graphql apollo server'),
        (${BASE_SEED_INDEX}17, '@xDepcio/script17', true, ${BASE_SEED_INDEX}1, 'html css javascript bootstrap'),
        (${BASE_SEED_INDEX}18, '@xDepcio/script18', true, ${BASE_SEED_INDEX}1, 'typescript webpack babel'),
        (${BASE_SEED_INDEX}19, '@xDepcio/script19', true, ${BASE_SEED_INDEX}1, 'rust actix-web wasm'),
        (${BASE_SEED_INDEX}20, '@xDepcio/script20', true, ${BASE_SEED_INDEX}1, 'elixir phoenix liveview'),
        (${BASE_SEED_INDEX}21, '@xDepcio/script21', true, ${BASE_SEED_INDEX}1, 'perl catalyst dbix'),
        (${BASE_SEED_INDEX}22, '@xDepcio/script22', true, ${BASE_SEED_INDEX}1, 'nodejs express mongodb'),
        (${BASE_SEED_INDEX}23, '@xDepcio/script23', true, ${BASE_SEED_INDEX}1, 'svelte sapper tailwindcss'),
        (${BASE_SEED_INDEX}24, '@xDepcio/script24', true, ${BASE_SEED_INDEX}1, 'haskell yesod postgresql'),
        (${BASE_SEED_INDEX}25, '@xDepcio/script25', true, ${BASE_SEED_INDEX}1, 'clojure ring datomic'),
        (${BASE_SEED_INDEX}26, '@pyivy/script1', True, ${BASE_SEED_INDEX}2, 'nextjs ruby go kotlin'),
        (${BASE_SEED_INDEX}27, '@mebcc/script2', True, ${BASE_SEED_INDEX}9, 'vue'),
        (${BASE_SEED_INDEX}28, '@kqjmk/script3', False, ${BASE_SEED_INDEX}4, 'java kotlin'),
        (${BASE_SEED_INDEX}29, '@swbib/script4', False, ${BASE_SEED_INDEX}7, 'python'),
        (${BASE_SEED_INDEX}30, '@jbrwt/script5', False, ${BASE_SEED_INDEX}5, 'ruby'),
        (${BASE_SEED_INDEX}31, '@lrbeo/script6', True, ${BASE_SEED_INDEX}3, 'react nextjs nodejs ruby python'),
        (${BASE_SEED_INDEX}32, '@jbrwt/script7', False, ${BASE_SEED_INDEX}5, 'vue python javascript java angular'),
        (${BASE_SEED_INDEX}33, '@kdjbg/script8', False, ${BASE_SEED_INDEX}6, 'kotlin typescript php nextjs ruby'),
        (${BASE_SEED_INDEX}34, '@tpjcw/script9', False, ${BASE_SEED_INDEX}1, 'angular kotlin swift'),
        (${BASE_SEED_INDEX}35, '@wvqxw/script10', True, ${BASE_SEED_INDEX}8, 'kotlin react'),
        (${BASE_SEED_INDEX}36, '@tgbak/script11', False, ${BASE_SEED_INDEX}5, 'ruby'),
        (${BASE_SEED_INDEX}37, '@mebcc/script12', False, ${BASE_SEED_INDEX}9, 'java go ruby angular python'),
        (${BASE_SEED_INDEX}38, '@vsbis/script13', True, ${BASE_SEED_INDEX}3, 'php swift go java'),
        (${BASE_SEED_INDEX}39, '@vomwq/script14', False, ${BASE_SEED_INDEX}9, 'swift python ruby'),
        (${BASE_SEED_INDEX}40, '@xhgkc/script15', True, ${BASE_SEED_INDEX}8, 'php'),
        (${BASE_SEED_INDEX}41, '@uemki/script16', False, ${BASE_SEED_INDEX}1, 'kotlin'),
        (${BASE_SEED_INDEX}42, '@lrbeo/script17', False, ${BASE_SEED_INDEX}3, 'swift'),
        (${BASE_SEED_INDEX}43, '@swbib/script18', False, ${BASE_SEED_INDEX}7, 'nodejs go react angular kotlin'),
        (${BASE_SEED_INDEX}44, '@swbib/script19', False, ${BASE_SEED_INDEX}7, 'ruby php vue'),
        (${BASE_SEED_INDEX}45, '@wvqxw/script20', False, ${BASE_SEED_INDEX}8, 'angular javascript'),
        (${BASE_SEED_INDEX}46, '@uemki/script21', True, ${BASE_SEED_INDEX}1, 'kotlin vue javascript python'),
        (${BASE_SEED_INDEX}47, '@zdfod/script22', False, ${BASE_SEED_INDEX}7, 'angular python'),
        (${BASE_SEED_INDEX}48, '@zdfod/script23', True, ${BASE_SEED_INDEX}7, 'go javascript angular swift kotlin'),
        (${BASE_SEED_INDEX}49, '@pyivy/script24', False, ${BASE_SEED_INDEX}2, 'go python'),
        (${BASE_SEED_INDEX}50, '@lzgoq/script25', True, ${BASE_SEED_INDEX}1, 'java php javascript go vue'),
        (${BASE_SEED_INDEX}51, '@wyfcy/script26', True, ${BASE_SEED_INDEX}6, 'nodejs typescript python vue javascript'),
        (${BASE_SEED_INDEX}52, '@jbrwt/script27', False, ${BASE_SEED_INDEX}5, 'nextjs swift'),
        (${BASE_SEED_INDEX}53, '@pyivy/script28', True, ${BASE_SEED_INDEX}2, 'nextjs'),
        (${BASE_SEED_INDEX}54, '@lrbeo/script29', False, ${BASE_SEED_INDEX}3, 'nodejs'),
        (${BASE_SEED_INDEX}55, '@pyivy/script30', True, ${BASE_SEED_INDEX}2, 'nodejs java'),
        (${BASE_SEED_INDEX}56, '@vsbis/script31', True, ${BASE_SEED_INDEX}3, 'go react'),
        (${BASE_SEED_INDEX}57, '@wyfcy/script32', False, ${BASE_SEED_INDEX}6, 'nextjs swift go kotlin'),
        (${BASE_SEED_INDEX}58, '@admes/script33', True, ${BASE_SEED_INDEX}2, 'go'),
        (${BASE_SEED_INDEX}59, '@pyivy/script34', False, ${BASE_SEED_INDEX}2, 'go'),
        (${BASE_SEED_INDEX}60, '@tgbak/script35', True, ${BASE_SEED_INDEX}5, 'python'),
        (${BASE_SEED_INDEX}61, '@vomwq/script36', False, ${BASE_SEED_INDEX}9, 'nodejs python ruby'),
        (${BASE_SEED_INDEX}62, '@zusgk/script37', True, ${BASE_SEED_INDEX}4, 'php swift'),
        (${BASE_SEED_INDEX}63, '@zdfod/script38', False, ${BASE_SEED_INDEX}7, 'python'),
        (${BASE_SEED_INDEX}64, '@kdjbg/script39', True, ${BASE_SEED_INDEX}6, 'javascript nextjs vue react swift'),
        (${BASE_SEED_INDEX}65, '@vomwq/script40', True, ${BASE_SEED_INDEX}9, 'java'),
        (${BASE_SEED_INDEX}66, '@kqjmk/script41', True, ${BASE_SEED_INDEX}4, 'angular vue'),
        (${BASE_SEED_INDEX}67, '@uemki/script42', False, ${BASE_SEED_INDEX}1, 'react'),
        (${BASE_SEED_INDEX}68, '@swbib/script43', True, ${BASE_SEED_INDEX}7, 'swift go'),
        (${BASE_SEED_INDEX}69, '@admes/script44', False, ${BASE_SEED_INDEX}2, 'ruby nextjs vue swift python'),
        (${BASE_SEED_INDEX}70, '@wvqxw/script45', False, ${BASE_SEED_INDEX}8, 'javascript java nextjs swift typescript'),
        (${BASE_SEED_INDEX}71, '@wyfcy/script46', True, ${BASE_SEED_INDEX}6, 'go swift angular ruby kotlin'),
        (${BASE_SEED_INDEX}72, '@vomwq/script47', True, ${BASE_SEED_INDEX}9, 'typescript react java kotlin'),
        (${BASE_SEED_INDEX}73, '@kdjbg/script48', True, ${BASE_SEED_INDEX}6, 'kotlin java go ruby'),
        (${BASE_SEED_INDEX}74, '@tpjcw/script49', False, ${BASE_SEED_INDEX}1, 'kotlin javascript'),
        (${BASE_SEED_INDEX}75, '@uemki/script50', False, ${BASE_SEED_INDEX}1, 'swift vue go ruby')
    ;`

    await sql.query(queryString)
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
