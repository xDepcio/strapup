import { DBQuery } from "@/db/db";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export type UnstarScriptResponse = {
    success: true
} | {
    success: false
    error: string
}
export const POST = async (req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse<UnstarScriptResponse>> => {
    const token = await getToken({ req })
    if (!token) {
        return NextResponse.json({
            error: 'Not logged in',
            success: false,
        }, { status: 401 })
    }

    await DBQuery(`
        INSERT INTO user_script_stars (user_id, script_id)
        VALUES ($1, $2)
    `, [token.id, params.id])

    return NextResponse.json({
        success: true
    })
}
