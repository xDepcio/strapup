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
        INSERT INTO user_template_stars (user_id, template_id)
        VALUES ($1, $2)
    `, [token.id, templateId])

    return NextResponse.json({
        success: true
    })
}
