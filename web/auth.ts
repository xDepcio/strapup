import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import PostgresAdapter from "@auth/pg-adapter"
import { Pool } from 'pg'

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})

export const { handlers, auth } = NextAuth({
    providers: [GitHub],
    adapter: PostgresAdapter(pool)
})
