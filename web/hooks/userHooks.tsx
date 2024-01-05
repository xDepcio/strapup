'use client'

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

    // const [stars, setStars] = useState<string[]>([])

    // useEffect(() => {
    //     if (status === "authenticated") {
    //         setStars(data.user.stars)
    //     }
    // }, [status])

    // return { stars, setStars }
}
