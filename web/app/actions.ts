'use server'
// import { sql } from "@vercel/postgres"

// type FetchTemplatesScriptsParams = {
//     searchInput: string
//     searchScripts: boolean
//     searchTemplates: boolean
// }
// export async function fetchTemplatesScript({ searchInput, searchScripts, searchTemplates }: FetchTemplatesScriptsParams) {
//     const splittedSearchInput = searchInput.split(' ')
//     const sqlRegex = splittedSearchInput.join('|')
//     console.log({ sqlRegex })

//     let scripts = []
//     if (searchScripts) {
//         console.log('before quary')
//         const { command, fields, oid, rowCount, rows } = await sql`SELECT name, tags, stars FROM TEMPLATES
//             WHERE public IS TRUE
//             AND (
//                 LOWER(name) LIKE '%(${sqlRegex})%'
//                 OR tags SIMILAR TO '%(${sqlRegex})%'
//             )
//             ORDER BY stars DESC
//         ;`

//         console.log({ command, fields, oid, rowCount, rows })
//     }
// }


export async function serverFn() {
    'use server'

    console.log('server side code');

}
