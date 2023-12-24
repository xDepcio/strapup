import { sql } from "@vercel/postgres";

async function createDummyScripts() {
    await sql`INSERT INTO scripts (name, public, owner_id) VALUES
        ('@xDepcio/script1', true, 1),
        ('@xDepcio/script2', false, 1)
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
