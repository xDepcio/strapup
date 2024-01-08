'use client'

import { HTMLAttributes } from "react"
import { Button } from "./ui/button"
import { BsGithub } from "react-icons/bs"
import { signIn } from "next-auth/react"

interface LoginUserClientProps extends HTMLAttributes<HTMLButtonElement>, React.ComponentProps<typeof Button> {
}

export default function LoginUserClient({ ...props }: LoginUserClientProps) {
    return (
        <Button {...props} onClick={() => signIn('github', { redirect: true, callbackUrl: '/user/templates' })} >
            <p>Sign In</p>
            <BsGithub className="text-[1rem]" />
        </Button>
    )
}
