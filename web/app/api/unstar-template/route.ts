import { DBQuery } from "@/db/db";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const token = await getToken({ req })
    if (!token) {
        return NextResponse.error()
    }

    const body = await req.json()
    const { templateId } = body

    await DBQuery(`
        DELETE FROM user_template_stars WHERE user_id = $1 AND template_id = $2
    `, [token.id, templateId])

    return NextResponse.json({
        success: true
    })
}
