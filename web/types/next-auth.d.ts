import { DefaultSession, Profile, Account, User } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module 'next-auth' {
    interface Session {
        user: {
            login: string
        } & DefaultSession['user']
    }
}

// declare module 'next-auth/jwt' {
//     interface JWT extends JWT {
//         login: string
//     }
// }
