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
        ('@xDepcio/script25', true, 1, 'clojure ring datomic')
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
