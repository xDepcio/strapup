'use client'

import { signOut } from "next-auth/react"
import { Button } from "./ui/button"
import { HTMLAttributes } from "react"

export default function Logout({ ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div {...props} onClick={() => signOut({ redirect: true, callbackUrl: '/' })} >
            {props.children}
        </div>
    )
}
