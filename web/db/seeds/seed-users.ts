import { BASE_SEED_INDEX } from "./constants";
import { DBQuery } from "../db";

export async function createDummyUsers() {
    // const string = `INSERT INTO users (id, name, email, image, login) VALUES
    //     (${BASE_SEED_INDEX}1, 'Uemki', 'uemki@example.com', 'https://avatars.githubusercontent.com/u/25835?v=4', 'uemki'),
    //     (${BASE_SEED_INDEX}2, 'Admes', 'admes@example.com', 'https://avatars.githubusercontent.com/u/31702?v=4', 'admes'),
    //     (${BASE_SEED_INDEX}3, 'Vsbis', 'vsbis@example.com', 'https://avatars.githubusercontent.com/u/76192?v=4', 'vsbis'),
    //     (${BASE_SEED_INDEX}4, 'Zusgk', 'zusgk@example.com', 'https://avatars.githubusercontent.com/u/35695?v=4', 'zusgk'),
    //     (${BASE_SEED_INDEX}5, 'Tgbak', 'tgbak@example.com', 'https://avatars.githubusercontent.com/u/55921?v=4', 'tgbak'),
    //     (${BASE_SEED_INDEX}6, 'Wyfcy', 'wyfcy@example.com', 'https://avatars.githubusercontent.com/u/76323?v=4', 'wyfcy'),
    //     (${BASE_SEED_INDEX}7, 'Zdfod', 'zdfod@example.com', 'https://avatars.githubusercontent.com/u/19310?v=4', 'zdfod'),
    //     (${BASE_SEED_INDEX}8, 'Wvqxw', 'wvqxw@example.com', 'https://avatars.githubusercontent.com/u/14656?v=4', 'wvqxw'),
    //     (${BASE_SEED_INDEX}9, 'Vomwq', 'vomwq@example.com', 'https://avatars.githubusercontent.com/u/20150?v=4', 'vomwq'),
    //     (${BASE_SEED_INDEX}10, 'Lzgoq', 'lzgoq@example.com', 'https://avatars.githubusercontent.com/u/97502?v=4', 'lzgoq'),
    //     (${BASE_SEED_INDEX}11, 'Gabrysia', 'zlacoreczka@gmail.com', 'https://avatars.githubusercontent.com/u/97502?v=4', 'zlacoreczka')
    // ;`
    const string = `INSERT INTO users (id, name, email, image, login, github_id) VALUES
        (1, 'Aleksander Drwal', 'olek.drwal@gmail.com', 'https://avatars.githubusercontent.com/u/107278893?v=4', 'xDepcio', 107278893)
    ;`
    await DBQuery(string)
}
