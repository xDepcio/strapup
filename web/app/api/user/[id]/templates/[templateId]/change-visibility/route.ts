import { DBQuery } from "@/db/db";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export type ChangeTemplateVisibilityReqBody = {
    toPublic: boolean
}
export const POST = async (req: NextRequest, { params }: { params: { id: string, templateId: string } }) => {
    const token = await getToken({ req })
    console.log('token', token)
    if (!token) {
        return NextResponse.json({
            error: 'Not logged in',
            success: false,
        }, { status: 401 })
    }

    const { toPublic } = await req.json() as ChangeTemplateVisibilityReqBody

    await DBQuery(`
        UPDATE templates SET public=$1 WHERE id=$2 AND owner_id=$3
    `, [toPublic, params.templateId, token.id])

    return NextResponse.json({
        success: true,
    })
}
