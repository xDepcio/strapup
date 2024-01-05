'use client'

import { StarredScriptResponse } from "@/app/api/scripts/[id]/starred/route"
import { StarredTemplateResponse } from "@/app/api/starred-template/route"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

type UseHasUserStarredTemplateProps = {
    templateName: string
}
export function useHasUserStarredTemplate({ templateName }: UseHasUserStarredTemplateProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [data, setData] = useState<StarredTemplateResponse>()

    const revalidate = () => {
        setIsLoading(true)
        fetch(`/api/starred-template?templateName=${templateName}`, {})
            .then(res => res.json())
            .then((data: StarredTemplateResponse) => {
                setData(data)
                setIsLoading(false)
            })
    }

    useEffect(revalidate, [])

    return { data, revalidate, isLoading, setIsLoading }
}

type UseHasUserStarredScriptProps = {
    scriptId: number
}
export function useHasUserStarredScript({ scriptId }: UseHasUserStarredScriptProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [hasStarred, setHasStarred] = useState<boolean>(false)

    const revalidate = () => {
        setIsLoading(true)
        fetch(`/api/scripts/${scriptId}/starred`)
            .then(res => res.json())
            .then((data: StarredScriptResponse) => {
                if (data.success) {
                    setHasStarred(data.starred)
                }
                setIsLoading(false)
            })
    }

    useEffect(revalidate, [])

    return { hasStarred, revalidate, isLoading, setIsLoading }
}
