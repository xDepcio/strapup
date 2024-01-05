import { DBQuery } from "@/db/db";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const token = await getToken({ req })
    if (!token) {
        return NextResponse.json({
            starred: false
        })
    }

    const searchParams = req.nextUrl.searchParams
    const templateName = searchParams.get('templateName')

    console.log('templateName', templateName)
    console.log('token', token)
    const { rowCount } = await DBQuery(`
        SELECT u.login FROM users u
        JOIN user_template_stars uts ON uts.user_id = u.id
        JOIN templates t ON t.id = uts.template_id
        WHERE u.id = $1 AND t.name = $2
    `, [token.id, templateName])
    console.log('rowCount', rowCount)
    if (rowCount === 0) {
        return NextResponse.json({
            starred: false
        })
    }

    return NextResponse.json({
        starred: true
    })
}
