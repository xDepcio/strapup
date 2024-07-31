import { DBQuery } from "../db";

export async function createDummyUserTemplatesStars() {
    const queryString = `INSERT INTO user_template_stars (user_id, template_id) VALUES
        (99999999, 99999999)
    ;`

    await DBQuery(queryString)
}

export async function createDummyUserScriptsStars() {
    const queryString = `INSERT INTO user_script_stars (user_id, script_id) VALUES
        (99999999, 99999999)
    ;`

    await DBQuery(queryString)
}
