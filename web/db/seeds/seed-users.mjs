import { sql } from "@vercel/postgres";

async function createDummyScripts() {
    await sql`INSERT INTO users (id, name, email, image, login) VALUES
        (1, 'Uemki', 'uemki@example.com', 'https://avatars.githubusercontent.com/u/25835?v=4', 'uemki'),
        (2, 'Admes', 'admes@example.com', 'https://avatars.githubusercontent.com/u/31702?v=4', 'admes'),
        (3, 'Vsbis', 'vsbis@example.com', 'https://avatars.githubusercontent.com/u/76192?v=4', 'vsbis'),
        (4, 'Zusgk', 'zusgk@example.com', 'https://avatars.githubusercontent.com/u/35695?v=4', 'zusgk'),
        (5, 'Tgbak', 'tgbak@example.com', 'https://avatars.githubusercontent.com/u/55921?v=4', 'tgbak'),
        (6, 'Wyfcy', 'wyfcy@example.com', 'https://avatars.githubusercontent.com/u/76323?v=4', 'wyfcy'),
        (7, 'Zdfod', 'zdfod@example.com', 'https://avatars.githubusercontent.com/u/19310?v=4', 'zdfod'),
        (8, 'Wvqxw', 'wvqxw@example.com', 'https://avatars.githubusercontent.com/u/14656?v=4', 'wvqxw'),
        (9, 'Vomwq', 'vomwq@example.com', 'https://avatars.githubusercontent.com/u/20150?v=4', 'vomwq'),
        (10, 'Lzgoq', 'lzgoq@example.com', 'https://avatars.githubusercontent.com/u/97502?v=4', 'lzgoq')
    ;`
}


async function main() {
    await createDummyScripts()
}

main().catch((err) => {
    console.error(
        "An error occured when seeding database:",
        err
    )
})
