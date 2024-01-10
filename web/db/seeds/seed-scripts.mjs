import { sql } from "@vercel/postgres";

async function createDummyScripts() {
    await sql`INSERT INTO scripts (id, name, public, owner_id, tags) VALUES
        (1, '@xDepcio/script1', true, 1, 'nextjs react typescript tailwind'),
        (2, '@xDepcio/script2', false, 1, 'express sequelize postgres socketio'),
        (3, '@xDepcio/script3', true, 1, 'python flask sql'),
        (4, '@xDepcio/script4', false, 1, 'sql express'),
        (5, '@xDepcio/script5', true, 1, 'javascript vue nodejs'),
        (6, '@xDepcio/script6', true, 1, 'angular typescript rxjs'),
        (7, '@xDepcio/script7', true, 1, 'react native redux'),
        (8, '@xDepcio/script8', true, 1, 'php laravel mysql'),
        (9, '@xDepcio/script9', true, 1, 'ruby rails postgresql'),
        (10, '@xDepcio/script10', true, 1, 'java spring boot hibernate'),
        (11, '@xDepcio/script11', true, 1, 'c# .net entityframework'),
        (12, '@xDepcio/script12', true, 1, 'go gin gorm'),
        (13, '@xDepcio/script13', true, 1, 'kotlin spring react'),
        (14, '@xDepcio/script14', true, 1, 'swift vapor postgresql'),
        (15, '@xDepcio/script15', true, 1, 'docker kubernetes cloud'),
        (16, '@xDepcio/script16', true, 1, 'graphql apollo server'),
        (17, '@xDepcio/script17', true, 1, 'html css javascript bootstrap'),
        (18, '@xDepcio/script18', true, 1, 'typescript webpack babel'),
        (19, '@xDepcio/script19', true, 1, 'rust actix-web wasm'),
        (20, '@xDepcio/script20', true, 1, 'elixir phoenix liveview'),
        (21, '@xDepcio/script21', true, 1, 'perl catalyst dbix'),
        (22, '@xDepcio/script22', true, 1, 'nodejs express mongodb'),
        (23, '@xDepcio/script23', true, 1, 'svelte sapper tailwindcss'),
        (24, '@xDepcio/script24', true, 1, 'haskell yesod postgresql'),
        (25, '@xDepcio/script25', true, 1, 'clojure ring datomic'),
        (26, '@pyivy/script1', True, 2, 'nextjs ruby go kotlin'),
        (27, '@mebcc/script2', True, 9, 'vue'),
        (28, '@kqjmk/script3', False, 4, 'java kotlin'),
        (29, '@swbib/script4', False, 7, 'python'),
        (30, '@jbrwt/script5', False, 5, 'ruby'),
        (31, '@lrbeo/script6', True, 3, 'react nextjs nodejs ruby python'),
        (32, '@jbrwt/script7', False, 5, 'vue python javascript java angular'),
        (33, '@kdjbg/script8', False, 6, 'kotlin typescript php nextjs ruby'),
        (34, '@tpjcw/script9', False, 1, 'angular kotlin swift'),
        (35, '@wvqxw/script10', True, 8, 'kotlin react'),
        (36, '@tgbak/script11', False, 5, 'ruby'),
        (37, '@mebcc/script12', False, 9, 'java go ruby angular python'),
        (38, '@vsbis/script13', True, 3, 'php swift go java'),
        (39, '@vomwq/script14', False, 9, 'swift python ruby'),
        (40, '@xhgkc/script15', True, 8, 'php'),
        (41, '@uemki/script16', False, 1, 'kotlin'),
        (42, '@lrbeo/script17', False, 3, 'swift'),
        (43, '@swbib/script18', False, 7, 'nodejs go react angular kotlin'),
        (44, '@swbib/script19', False, 7, 'ruby php vue'),
        (45, '@wvqxw/script20', False, 8, 'angular javascript'),
        (46, '@uemki/script21', True, 1, 'kotlin vue javascript python'),
        (47, '@zdfod/script22', False, 7, 'angular python'),
        (48, '@zdfod/script23', True, 7, 'go javascript angular swift kotlin'),
        (49, '@pyivy/script24', False, 2, 'go python'),
        (50, '@lzgoq/script25', True, 1, 'java php javascript go vue'),
        (51, '@wyfcy/script26', True, 6, 'nodejs typescript python vue javascript'),
        (52, '@jbrwt/script27', False, 5, 'nextjs swift'),
        (53, '@pyivy/script28', True, 2, 'nextjs'),
        (54, '@lrbeo/script29', False, 3, 'nodejs'),
        (55, '@pyivy/script30', True, 2, 'nodejs java'),
        (56, '@vsbis/script31', True, 3, 'go react'),
        (57, '@wyfcy/script32', False, 6, 'nextjs swift go kotlin'),
        (58, '@admes/script33', True, 2, 'go'),
        (59, '@pyivy/script34', False, 2, 'go'),
        (60, '@tgbak/script35', True, 5, 'python'),
        (61, '@vomwq/script36', False, 9, 'nodejs python ruby'),
        (62, '@zusgk/script37', True, 4, 'php swift'),
        (63, '@zdfod/script38', False, 7, 'python'),
        (64, '@kdjbg/script39', True, 6, 'javascript nextjs vue react swift'),
        (65, '@vomwq/script40', True, 9, 'java'),
        (66, '@kqjmk/script41', True, 4, 'angular vue'),
        (67, '@uemki/script42', False, 1, 'react'),
        (68, '@swbib/script43', True, 7, 'swift go'),
        (69, '@admes/script44', False, 2, 'ruby nextjs vue swift python'),
        (70, '@wvqxw/script45', False, 8, 'javascript java nextjs swift typescript'),
        (71, '@wyfcy/script46', True, 6, 'go swift angular ruby kotlin'),
        (72, '@vomwq/script47', True, 9, 'typescript react java kotlin'),
        (73, '@kdjbg/script48', True, 6, 'kotlin java go ruby'),
        (74, '@tpjcw/script49', False, 1, 'kotlin javascript'),
        (75, '@uemki/script50', False, 1, 'swift vue go ruby')
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
