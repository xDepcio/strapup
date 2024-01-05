'use client'

import { StarredTemplateResponse } from "@/app/api/templates/[id]/starred/route"
import { DbTemplte } from "@/db/types"
import { cn } from "@/lib/utils"
import { useMutation, useQuery } from "@tanstack/react-query"
import { HTMLAttributes } from "react"
import { FaRegStar, FaStar } from "react-icons/fa"
import { Skeleton } from "./ui/skeleton"

interface StarTemplateProps extends HTMLAttributes<HTMLDivElement> {
    template: Partial<DbTemplte>
}
export default function StarTemplate({ template, ...restProps }: StarTemplateProps) {
    const { data, isLoading, refetch, isRefetching, ...rest } = useQuery({
        queryKey: ['starred-script', template.id],
        queryFn: async () => {
            const res = await fetch(`/api/templates/${template.id}/starred`)
            const data = await res.json()
            return data as StarredTemplateResponse
        }
    })
    const starMutation = useMutation({
        mutationFn: () => {
            return fetch(`/api/templates/${template.id}/star`, {
                method: "POST",
            })
        },
        onSettled: () => {
            refetch()
        }
    })
    const unStarMutation = useMutation({
        mutationFn: () => {
            return fetch(`/api/templates/${template.id}/un-star`, {
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
