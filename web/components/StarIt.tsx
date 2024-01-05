'use client'

import React, { HTMLAttributes } from "react"
import { useSession } from "next-auth/react"
import { useHasUserStarredTemplate } from "@/hooks/userHooks"
import { Skeleton } from "./ui/skeleton"
import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { cn } from "@/lib/utils"
import { DbScript, DbTemplte } from "@/db/types"

interface StarItProps extends HTMLAttributes<HTMLDivElement> {
    template?: Partial<DbTemplte>
    script?: Partial<DbScript>
    name: string
}
export default function StarIt({ name, template, script, ...restProps }: StarItProps) {
    const { data, revalidate, isLoading, setIsLoading } = useHasUserStarredTemplate({ templateName: name })

    if (template) {
        if (isLoading) {
            return (
                <Skeleton className='w-20 h-6' />
            )
        }
        return (
            <div {...restProps} className={cn("cursor-pointer", restProps.className)} onClick={() => {
                console.log("DRT", template, data)
                if (!data) return
                if (!data.starred) {
                    setIsLoading(true)
                    fetch(`/api/star-template`, {
                        method: "POST",
                        body: JSON.stringify({ templateId: template.id })
                    }).then(revalidate)
                }
                else {
                    setIsLoading(true)
                    fetch(`/api/unstar-template`, {
                        method: "POST",
                        body: JSON.stringify({ templateId: template.id })
                    }).then(revalidate)
                }
            }}>
                {data?.starred ? (
                    <>
                        <p>unstar it</p>
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
