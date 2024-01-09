import PostgresAdapter from "@auth/pg-adapter"
import { AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { Pool } from 'pg'

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})

export const authOptions: AuthOptions = {
    providers: [
        // @ts-ignore
        GithubProvider({
            clientId: process.env.AUTH_GITHUB_ID as string,
            clientSecret: process.env.AUTH_GITHUB_SECRET as string,
            profile(profile) {
                console.log('prof', profile)
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
    // @ts-ignore
    adapter: PostgresAdapter(pool),
    session: {
        strategy: 'jwt'
    },
    events: {
        async linkAccount(e) {
            console.log('linkAccount', e)
            // @ts-ignore
            pool.query(
                // @ts-ignore
                `UPDATE users SET login = $1, github_id = $2 WHERE id = $3`,
                // @ts-ignore
                [e.profile.login, e.profile.id, e.user.id]
            )
        }
    },
    callbacks: {
        async jwt({ token, profile, user, account, session, trigger }) {
            // console.log('jwt', token, profile)
            // console.log('in JWT')
            // console.log({
            //     token,
            //     profile,
            //     user,
            //     account,
            //     session,
            //     trigger
            // })

            // @ts-ignore
            if (profile?.login) {
                // @ts-ignore
                token.login = profile.login
                token.id = user.id
            }
            return token
        },
        async session({ token, session }) {
            // console.log('session', token, session)
            if (token?.login) {
                session.user.login = token.login as string
                session.user.id = token.id as number
                // @ts-ignore
                session.user.xd = 'xd'
            }
            return session
        }
    }
}
