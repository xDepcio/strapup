'use client'

import React, { HTMLAttributes } from "react"
import { useSession } from "next-auth/react"

interface StarItProps extends HTMLAttributes<HTMLDivElement> {
    template?: boolean
    script?: boolean
}
export default function StarIt({ template = false, script = false, ...restProps }: StarItProps) {
    const { data, status, update } = useSession()

    return (
        <div {...restProps} >
            <p>Star It!</p>
        </div>
    )
}
