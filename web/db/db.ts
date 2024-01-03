import { Client } from "pg";

export const dbClient = new Client({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})
