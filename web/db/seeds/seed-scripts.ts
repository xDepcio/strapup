import { DBQuery } from "../db";

export async function createDummyScripts() {
    const queryString = `INSERT INTO scripts (id, name, public, owner_id, tags) VALUES
        (99999999, '@zlacoreczka/Create-Next-ShadcnUI', true, 99999999, 'nextjs react typescript tailwind')
    ;`

    await DBQuery(queryString)
}
