import { NextRequest, NextResponse } from "next/server";
import { Client, QueryResult } from "pg";

type ReqBody = {
    searchString: string
    searchScripts: boolean
    searchTemplates: boolean
}
export type SearchResBody = {
    scripts: {
        id: number
        name: string
        tags: string
        stars: number
    }[]
    templates: {
        id: number
        name: string
        tags: string
        stars: number
    }[]
}
export const POST = async (req: NextRequest) => {
    const body = await req.json() as ReqBody
    console.log('search', body)
    const { searchString, searchScripts, searchTemplates } = body
    const sqlRegex = searchString
        .toLowerCase()
        .split(' ')
        .join('|')
    const sqlRegexWildcards = '%(' + sqlRegex + ')%'

    const client = new Client({
        connectionString: process.env.POSTGRES_URL + "?sslmode=require",
    })
    await client.connect()

    let scriptResults: QueryResult | null = null
    if (searchScripts) {
        scriptResults = await client.query(`SELECT id, name, tags, stars FROM scripts
            WHERE public IS TRUE
            AND (
                LOWER(name) SIMILAR TO $1
                OR tags SIMILAR TO $1
            )
            ORDER BY stars DESC
            LIMIT 10;
        `, [sqlRegexWildcards])
    }
    console.log('scriptResults', scriptResults?.rows)

    let templateResults: QueryResult | null = null
    if (searchTemplates) {
        templateResults = await client.query(`SELECT id, name, tags, stars FROM templates
            WHERE public IS TRUE
            AND (
                LOWER(name) SIMILAR TO $1
                OR tags SIMILAR TO $1
            )
            ORDER BY stars DESC
            LIMIT 10;
        `, [sqlRegexWildcards])
    }
    console.log('templateResults', templateResults?.rows)

    await client.end()
    return NextResponse.json({
        scripts: scriptResults ? scriptResults.rows : [],
        templates: templateResults ? templateResults.rows : []
    } as SearchResBody)
}
