import { sql } from '@vercel/postgres'


async function createTemplatesTable() {
    await sql`CREATE TABLE IF NOT EXISTS templates
    (
        id SERIAL,
        name VARCHAR(255) NOT NULL,
        public BOOLEAN NOT NULL,
        owner INTEGER NOT NULL REFERENCES users(id),

        PRIMARY KEY (id)
    );`
}

async function main() {
    await createTemplatesTable()
}

main().catch((err) => {
    console.error(
        "An error occured when creating database tables:",
        err
    )
})
