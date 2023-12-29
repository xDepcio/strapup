import { sql } from "@vercel/postgres";

async function createDummyTemplates() {
    await sql`INSERT INTO templates (name, public, owner_id, tags) VALUES
        ('@xDepcio/template1', true, 1, 'nextjs react typescript tailwind'),
        ('@xDepcio/template2', false, 1, 'express sequelize postgres socketio')
    ;`
}


async function main() {
    await createDummyTemplates()
}

main().catch((err) => {
    console.error(
        "An error occured when seeding database:",
        err
    )
})
