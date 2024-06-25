import { DBQuery } from '../db'


async function createTemplatesTable() {
    await DBQuery(
        `CREATE TABLE IF NOT EXISTS templates
        (
        id SERIAL,
        name VARCHAR(255) NOT NULL,
        description VARCHAR(1024),
        public BOOLEAN NOT NULL,
        owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tags VARCHAR(512),
        synced BOOLEAN DEFAULT FALSE,

        PRIMARY KEY (id)
        );`
    )
}

async function createScriptsTable() {
    await DBQuery(
        `CREATE TABLE IF NOT EXISTS scripts
        (
        id SERIAL,
        name VARCHAR(255) NOT NULL,
        description VARCHAR(1024),
        public BOOLEAN NOT NULL,
        owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tags VARCHAR(512),
        synced BOOLEAN DEFAULT FALSE,

        PRIMARY KEY (id)
        );`
    )
}

async function createUserTemplateStars() {
    await DBQuery(
        `CREATE TABLE IF NOT EXISTS user_template_stars
        (
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        template_id INTEGER NOT NULL REFERENCES templates(id) ON DELETE CASCADE,

        PRIMARY KEY (user_id, template_id)
        );`
    )
}

async function createUserScriptStars() {
    await DBQuery(
        `CREATE TABLE IF NOT EXISTS user_script_stars
        (
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        script_id INTEGER NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,

        PRIMARY KEY (user_id, script_id)
        );`
    )
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
