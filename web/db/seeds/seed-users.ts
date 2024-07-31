import { DBQuery } from "../db";

export async function createDummyUsers() {
    const string = `INSERT INTO users (id, name, email, image, login, github_id) VALUES
        (99999999, 'zlacoreczka', 'zlacoreczka@gmail.com', 'https://avatars.githubusercontent.com/u/107278893?v=4', 'zlacoreczka', 107278853)
    ;`
    await DBQuery(string)
}
