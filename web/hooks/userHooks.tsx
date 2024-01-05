'use client'

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

type UseHasUserStarredTemplateProps = {
    templateName: string
}
export function useHasUserStarredTemplate({ templateName }: UseHasUserStarredTemplateProps) {
    const [hasStarred, setHasStarred] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const revalidate = () => {
        setIsLoading(true)
        fetch(`/api/starred-template?templateName=${templateName}`, {})
            .then(res => res.json())
            .then(data => {
                setHasStarred(data.starred)
                setIsLoading(false)
            })
    }

    useEffect(revalidate, [])

    return { hasStarred, revalidate, isLoading }

    // const [stars, setStars] = useState<string[]>([])

    // useEffect(() => {
    //     if (status === "authenticated") {
    //         setStars(data.user.stars)
    //     }
    // }, [status])

    // return { stars, setStars }
}
