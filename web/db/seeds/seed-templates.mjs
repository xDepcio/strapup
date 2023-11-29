import { sql } from "@vercel/postgres";

async function createDummyTemplates() {
    await sql`INSERT INTO templates (name, public, owner_id) VALUES
        ('@xDepcio/template1', true, 2),
        ('@xDepcio/template2', false, 2)
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
