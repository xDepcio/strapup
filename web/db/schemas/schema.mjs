import { sql } from '@vercel/postgres'


async function createTemplatesTable() {
    await sql`CREATE TABLE IF NOT EXISTS templates
    (
        id SERIAL,
        name VARCHAR(255) NOT NULL,
        public BOOLEAN NOT NULL,
        owner_id INTEGER NOT NULL REFERENCES users(id),

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

        PRIMARY KEY (id)
    );`
}

async function main() {
    await createTemplatesTable()
    await createScriptsTable()
}

main().catch((err) => {
    console.error(
        "An error occured when creating database tables:",
        err
    )
})
