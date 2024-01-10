import { DBQuery } from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import { Client, QueryResult } from "pg";
import { z } from "zod";

const reqBodySchema = z.object({
    searchString: z.string(),
    searchScripts: z.boolean(),
    searchTemplates: z.boolean(),
    page: z.number().min(1).optional().default(1),
    pageSize: z.number().min(1).max(30).optional().default(10),
})

// type ReqBody = z.infer<typeof reqBodySchema>
export type SearchResBody = {
    error: null
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
} | {
    error: string
}
export const POST = async (req: NextRequest): Promise<NextResponse<SearchResBody>> => {
    const body = reqBodySchema.safeParse(await req.json())
    if (!body.success) {
        return NextResponse.json({
            error: 'Invalid request body',
        }, {
            status: 400,
        })
    }
    // const body = await req.json() as ReqBody
    console.log('search', body)
    const { data: { page, pageSize, searchScripts, searchString, searchTemplates } } = body
    const sqlRegex = searchString
        .toLowerCase()
        .split(' ')
        .join('|')
    const sqlRegexWildcards = '%(' + sqlRegex + ')%'

    let scriptResults: QueryResult | null = null
    if (searchScripts) {
        scriptResults = await DBQuery(`SELECT s.id, s.name, s.tags, COUNT(uss.script_id) as stars FROM scripts s
            LEFT JOIN user_script_stars uss ON uss.script_id=s.id
            WHERE s.public IS TRUE
                AND LOWER(s.name) SIMILAR TO $1
                OR s.tags SIMILAR TO $1
            GROUP BY uss.script_id, s.id
            ORDER BY stars DESC
            LIMIT $2
            OFFSET $3;
        `, [sqlRegexWildcards, pageSize, (page - 1) * pageSize])
    }
    console.log('scriptResults', scriptResults?.rows)

    let templateResults: QueryResult | null = null
    if (searchTemplates) {
        templateResults = await DBQuery(`SELECT t.id, t.name, t.tags, COUNT(uts.template_id) as stars FROM templates t
        LEFT JOIN user_template_stars uss ON uts.template_id=t.id
        WHERE t.public IS TRUE
            AND LOWER(t.name) SIMILAR TO $1
            OR t.tags SIMILAR TO $1
        GROUP BY uts.template_id, t.id
        ORDER BY stars DESC
        LIMIT $2
        OFFSET $3;
        `, [sqlRegexWildcards, pageSize, (page - 1) * pageSize])
    }
    console.log('templateResults', templateResults?.rows)

    return NextResponse.json({
        error: null,
        scripts: scriptResults ? scriptResults.rows : [],
        templates: templateResults ? templateResults.rows : []
    })
}
