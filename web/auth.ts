import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import PostgresAdapter from "@auth/pg-adapter"
import { Pool } from 'pg'
import { sql } from '@vercel/postgres'

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})

export const { handlers, auth } = NextAuth({
    providers: [
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
            profile(profile) {
                // console.log(profile)
                return {
                    id: profile.id.toString(),
                    name: profile.name || profile.login,
                    email: profile.email,
                    image: profile.avatar_url,
                    login: profile.login
                }
            }
        })
    ],
    adapter: PostgresAdapter(pool),
    session: {
        strategy: 'jwt'
    },
    events: {
        async linkAccount(e) {
            // console.log('linkAccount', e)
            // @ts-ignore
            pool.query(`UPDATE users SET login = '${e.profile.login}' WHERE id = '${e.user.id}'`)
        }
    },
    callbacks: {
        async jwt({ token, profile }) {
            if (profile?.login) {
                token.login = profile.login
            }
            return token
        },
        async session({ token, session }) {
            console.log('session', token, session)
            if (token?.login) {
                session.user.login = token.login as string
            }
            return session
        }
    }
})
