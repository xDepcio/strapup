import { DBQuery } from "@/db/db"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export const DELETE = async (req: NextRequest, { params }: { params: { id: string, scriptId: string } }) => {
    const token = await getToken({ req })
    console.log('token', token)
    if (!token) {
        return NextResponse.json({
            error: 'Not logged in',
            success: false,
        }, { status: 401 })
    }

    await DBQuery(`
        DELETE FROM scripts WHERE id=$1 AND owner_id=$2
    `, [params.scriptId, token.id])

    return NextResponse.json({
        success: true,
    })
}
