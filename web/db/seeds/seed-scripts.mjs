import { sql } from "@vercel/postgres";

async function createDummyScripts() {
    await sql`INSERT INTO scripts (name, public, owner_id, tags) VALUES
        ('@xDepcio/script1', true, 1, 'nextjs react typescript tailwind'),
        ('@xDepcio/script2', false, 1, 'express sequelize postgres socketio')
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
