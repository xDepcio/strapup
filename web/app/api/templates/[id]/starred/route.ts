import { DBQuery } from "@/db/db";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export type StarredTemplateResponse = {
    success: true
    starred: boolean
} | {
    success: false
    error: string
}
export async function GET(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse<StarredTemplateResponse>> {
    const token = await getToken({ req })
    if (!token) {
        return NextResponse.json({
            error: 'Not logged in',
            success: false,
        }, { status: 401 })
    }

    const { rowCount } = await DBQuery(`
        SELECT u.login, t.id FROM users u
        JOIN user_template_stars uts ON uts.user_id = u.id
        JOIN templates t ON t.id = uts.template_id
        WHERE u.id = $1 AND t.id = $2
    `, [token.id, params.id])

    if (rowCount === 0) {
        return NextResponse.json({
            starred: false,
            success: true,
        })
    }

    return NextResponse.json({
        starred: true,
        success: true,
    })
}
