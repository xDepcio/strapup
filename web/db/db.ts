import { Client, QueryResult, QueryResultRow } from "pg";

// export const dbClient = new Client({
//     connectionString: process.env.POSTGRES_URL + "?sslmode=require",
// })


export async function DBQuery<T extends QueryResultRow>(query: string, params: any[] = []): Promise<QueryResult<T>> {
    const dbClient = new Client({
        connectionString: process.env.POSTGRES_URL + "?sslmode=require",
    })

    await dbClient.connect()
    const res = await dbClient.query<T>(query, params)
    dbClient.end()
    return res
}
