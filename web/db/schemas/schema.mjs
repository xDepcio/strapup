import { sql } from '@vercel/postgres'


async function createTemplatesTable() {
    await sql`CREATE TABLE IF NOT EXISTS templates
    (
        id SERIAL,
        name VARCHAR(255) NOT NULL,
        public BOOLEAN NOT NULL,
        owner_id INTEGER NOT NULL REFERENCES users(id),
        tags VARCHAR(512),
        stars INTEGER DEFAULT 0,
        synced BOOLEAN DEFAULT FALSE,

        PRIMARY KEY (id)
    );`
}

async function createScriptsTable() {
    await sql`CREATE TABLE IF NOT EXISTS scripts
    (
        id SERIAL,
        name VARCHAR(255) NOT NULL,
        public BOOLEAN NOT NULL,
        owner_id INTEGER NOT NULL REFERENCES users(id),
        tags VARCHAR(512),
        stars INTEGER DEFAULT 0,
        synced BOOLEAN DEFAULT FALSE,

        PRIMARY KEY (id)
    );`
}

async function createUserTemplateStars() {
    await sql`CREATE TABLE IF NOT EXISTS user_template_stars
    (
        user_id INTEGER NOT NULL REFERENCES users(id),
        template_id INTEGER NOT NULL REFERENCES templates(id),

        PRIMARY KEY (user_id, template_id)
    );`
}

async function createUserScriptStars() {
    await sql`CREATE TABLE IF NOT EXISTS user_script_stars
    (
        user_id INTEGER NOT NULL REFERENCES users(id),
        script_id INTEGER NOT NULL REFERENCES scripts(id),

        PRIMARY KEY (user_id, script_id)
    );`
}

async function main() {
    await createTemplatesTable()
    await createScriptsTable()
    await createUserTemplateStars()
    await createUserScriptStars()
}

main().catch((err) => {
    console.error(
        "An error occured when creating database tables:",
        err
    )
})
