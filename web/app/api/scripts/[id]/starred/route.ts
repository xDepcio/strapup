import { DBQuery } from "@/db/db";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export type StarredScriptResponse = {
    success: true
    starred: boolean
} | {
    success: false
    error: string
}
export async function GET(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse<StarredScriptResponse>> {
    const token = await getToken({ req })
    if (!token) {
        return NextResponse.json({
            error: 'Not logged in',
            success: false,
        }, { status: 401 })
    }

    const { rowCount } = await DBQuery(`
        SELECT u.login, s.id FROM users u
        JOIN user_script_stars uss ON uss.user_id = u.id
        JOIN scripts s ON s.id = uss.script_id
        WHERE u.id = $1 AND s.id = $2
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
