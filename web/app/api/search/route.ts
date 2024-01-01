import { NextRequest, NextResponse } from "next/server";
import { sql } from '@vercel/postgres'

export const POST = async (req: NextRequest) => {
    const { fields, rows } = await sql`SELECT * FROM scripts;`
    console.log('fields', fields, 'rows', rows)
    return NextResponse.json({ message: "Hello World" })
}
