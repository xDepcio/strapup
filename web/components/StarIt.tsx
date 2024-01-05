'use client'

import React, { HTMLAttributes } from "react"
import { useSession } from "next-auth/react"
import { useHasUserStarredTemplate } from "@/hooks/userHooks"
import { Skeleton } from "./ui/skeleton"
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";

interface StarItProps extends HTMLAttributes<HTMLDivElement> {
    template?: boolean
    script?: boolean
    name: string
}
export default function StarIt({ name, template = false, script = false, ...restProps }: StarItProps) {
    if (template) {
        const { hasStarred, revalidate, isLoading } = useHasUserStarredTemplate({ templateName: name })
        if (isLoading) {
            return (
                <Skeleton className='w-20 h-6' />
            )
        }
        return (
            <div {...restProps}>
                {hasStarred ? (
                    <>
                        <p>Unstar It</p>
                        <FaStar />
                    </>
                ) : (
                    <>
                        <p>star it</p>
                        <FaRegStar />
                    </>
                )}
            </div>
        )
    }

    return (
        <div {...restProps} >
            <p>Star It!</p>
        </div>
    )
}
