'use client'

import { StarredScriptResponse } from "@/app/api/scripts/[id]/starred/route"
import { DbScript } from "@/db/types"
import { cn } from "@/lib/utils"
import { useMutation, useQuery } from "@tanstack/react-query"
import { HTMLAttributes } from "react"
import { FaRegStar, FaStar } from "react-icons/fa"
import { Skeleton } from "./ui/skeleton"

interface StarScriptProps extends HTMLAttributes<HTMLDivElement> {
    script: Partial<DbScript>
}
export default function StarScript({ script, ...restProps }: StarScriptProps) {
    const { data, isLoading, refetch, isRefetching, ...rest } = useQuery({
        queryKey: ['starred-script', script.id],
        queryFn: async () => {
            const res = await fetch(`/api/scripts/${script.id}/starred`)
            const data = await res.json()
            return data as StarredScriptResponse
        }
    })
    const starMutation = useMutation({
        mutationFn: () => {
            return fetch(`/api/scripts/${script.id}/star`, {
                method: "POST",
            })
        },
        onSettled: () => {
            refetch()
        }
    })
    const unStarMutation = useMutation({
        mutationFn: () => {
            return fetch(`/api/scripts/${script.id}/un-star`, {
                method: "POST",
            })
        },
        onSettled: () => {
            refetch()
        }
    })


    if (isRefetching || isLoading || !data?.success || starMutation.isPending || unStarMutation.isPending) {
        return (
            <Skeleton className='w-20 h-6' />
        )
    }
    // console.log("Passed loading", { rest, data, isLoading, starMutation, unStarMutation })

    return (
        <div {...restProps} className={cn("cursor-pointer", restProps.className)} onClick={() => {
            if (!data.starred) {
                starMutation.mutate()
            }
            else {
                unStarMutation.mutate()
            }
        }}>
            {data.starred ? (
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
