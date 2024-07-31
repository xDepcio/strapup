import { DBQuery } from "../db";

export async function createDummyTemplates() {
    const queryString = `INSERT INTO templates (id, name, public, owner_id, tags) VALUES
        (99999999, '@zlacoreczka/cli-auth-test', true, 99999999, 'nextjs react typescript tailwind')
    ;`

    await DBQuery(queryString)
}
