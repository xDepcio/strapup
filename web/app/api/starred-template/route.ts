import { DBQuery } from "@/db/db";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export type StarredTemplateResponse = {
    starred: boolean
    templateId?: number
}
export const GET = async (req: NextRequest) => {
    const token = await getToken({ req })
    if (!token) {
        return NextResponse.json({
            starred: false
        } as StarredTemplateResponse)
    }

    const searchParams = req.nextUrl.searchParams
    const templateName = searchParams.get('templateName')

    // console.log('templateName', templateName)
    // console.log('token', token)
    const { rowCount, rows } = await DBQuery(`
        SELECT u.login, t.id FROM users u
        JOIN user_template_stars uts ON uts.user_id = u.id
        JOIN templates t ON t.id = uts.template_id
        WHERE u.id = $1 AND t.name = $2
    `, [token.id, templateName])
    // console.log('rowCount', rowCount)
    if (rowCount === 0) {
        return NextResponse.json({
            starred: false
        } as StarredTemplateResponse)
    }

    return NextResponse.json({
        starred: true,
        templateId: rows[0].id
    } as StarredTemplateResponse)
}
