import { sql } from "@vercel/postgres";

async function createDummyUserTemplatesStars() {
    await sql`INSERT INTO user_template_stars (user_id, template_id) VALUES
        (1, 1),
        (1, 2),
        (1, 3),
        (1, 4)
    ;`
}

async function createDummyUserScriptsStars() {
    await sql`INSERT INTO user_script_stars (user_id, script_id) VALUES
        (1, 1),
        (1, 2),
        (1, 3),
        (1, 4)
    ;`
}


async function main() {
    await createDummyUserTemplatesStars()
    await createDummyUserScriptsStars()
}

main().catch((err) => {
    console.error(
        "An error occured when seeding database:",
        err
    )
})
