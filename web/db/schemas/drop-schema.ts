import { DBQuery } from '../db'


async function dropSchema() {
    await DBQuery(
        `DROP SCHEMA public CASCADE;
        CREATE SCHEMA public;`
    )
}

async function main() {
    await dropSchema()
}

main().catch((err) => {
    console.error(
        "An error occured when creating database tables:",
        err
    )
})
