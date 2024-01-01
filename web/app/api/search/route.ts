import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

export const POST = async (req: NextRequest) => {
    const client = new Client({
        connectionString: process.env.POSTGRES_URL + "?sslmode=require",
    })
    await client.connect()
    const result = await client.query(`SELECT * FROM scripts`)
    await client.end()
    console.log('res', result)
    return NextResponse.json({ message: "Hello World" })
}
