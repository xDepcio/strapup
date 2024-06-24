import { db, sql } from '@vercel/postgres'

/* =========== Tables definitions for next-auth =========== */
async function createVerificationTokenTable() {
    await sql`CREATE TABLE IF NOT EXISTS verification_token
    (
      identifier TEXT NOT NULL,
      expires TIMESTAMPTZ NOT NULL,
      token TEXT NOT NULL,

      PRIMARY KEY (identifier, token)
    );`
}

async function createAccountsTable() {
    await sql`CREATE TABLE IF NOT EXISTS accounts
    (
      id SERIAL,
      "userId" INTEGER NOT NULL,
      type VARCHAR(255) NOT NULL,
      provider VARCHAR(255) NOT NULL,
      "providerAccountId" VARCHAR(255) NOT NULL,
      refresh_token TEXT,
      access_token TEXT,
      expires_at BIGINT,
      id_token TEXT,
      scope TEXT,
      session_state TEXT,
      token_type TEXT,

      PRIMARY KEY (id)
    );`
}

async function createSessionsTable() {
    await sql`CREATE TABLE IF NOT EXISTS sessions
    (
      id SERIAL,
      "userId" INTEGER NOT NULL,
      expires TIMESTAMPTZ NOT NULL,
      "sessionToken" VARCHAR(255) NOT NULL,

      PRIMARY KEY (id)
    );`
}

async function createUsersTable() {
    await sql`CREATE TABLE IF NOT EXISTS users
    (
      id SERIAL,
      name VARCHAR(255),
      email VARCHAR(255),
      "emailVerified" TIMESTAMPTZ,
      image TEXT,
      login VARCHAR(255),
      github_id INTEGER,

      PRIMARY KEY (id)
    );`
}
/* ========================= */

async function main() {
    await createVerificationTokenTable()
    await createAccountsTable()
    await createSessionsTable()
    await createUsersTable()
}

main().catch((err) => {
    console.error(
        "An error occured when creating database tables:",
        err
    )
})
