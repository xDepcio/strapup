import { DBQuery } from "@/db/db";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export type ChangeScriptVisibilityReqBody = {
    toPublic: boolean
}
export const POST = async (req: NextRequest, { params }: { params: { id: string, scriptId: string } }) => {
    const token = await getToken({ req })
    console.log('token', token)
    if (!token) {
        return NextResponse.json({
            error: 'Not logged in',
            success: false,
        }, { status: 401 })
    }

    const { toPublic } = await req.json() as ChangeScriptVisibilityReqBody

    await DBQuery(`
        UPDATE scripts SET public=$1 WHERE id=$2 AND owner_id=$3
    `, [toPublic, params.scriptId, token.id])

    return NextResponse.json({
        success: true,
    })
}
