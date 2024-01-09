import { DBQuery } from "@/db/db";
import { DbTemplte } from "@/db/types";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { Merge } from "type-fest";

type ResultRow = Merge<Pick<DbTemplte, 'id' | 'name' | 'public' | 'tags'>, { stars: number }>
export type UserTemplateResponse = {
    success: true
    data: ResultRow[]
} | {
    success: false
    error: string
}
export const GET = async (req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse<UserTemplateResponse>> => {
    const token = await getToken({ req })
    console.log('token', token)
    if (!token) {
        return NextResponse.json({
            error: 'Not logged in',
            success: false,
        }, { status: 401 })
    }

    const { rows, rowCount } = await DBQuery<ResultRow>(`
        SELECT t.id, t.name, t.public, t.tags, COUNT(*) AS stars FROM TEMPLATES t
        JOIN user_template_stars uts ON uts.template_id=t.id
        WHERE t.owner_id=$1
        GROUP BY t.id
    `, [token.id])

    return NextResponse.json({
        success: true,
        data: rows,
    })
}
